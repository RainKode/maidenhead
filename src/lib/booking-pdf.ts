import {
  PDFDocument,
  StandardFonts,
  popGraphicsState,
  pushGraphicsState,
  rgb,
  setCharacterSpacing,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import { contact, siteInfo } from "@/lib/content";
import {
  RESTAURANT_TIME_ZONE,
  formatFullDate,
  formatSlot,
  hoursForDate,
} from "@/lib/booking";

/**
 * A4 copy of a booking request that guests can save or print. Loaded with a
 * dynamic import from the confirmation card, so pdf-lib never ships with
 * the page itself.
 */

export type BookingPdfDetails = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  party: number;
  notes?: string;
  /** When the request was sent (ms since epoch). */
  requestedAt: number;
};

const A4: [number, number] = [595.28, 841.89];
const MARGIN = 56;
const LABEL_COLUMN = 128;

const INK = rgb(5 / 255, 3 / 255, 21 / 255);
const MUTED = rgb(0.36, 0.36, 0.42);
const OXBLOOD = rgb(66 / 255, 75 / 255, 59 / 255);
const SAFFRON = rgb(251 / 255, 166 / 255, 0);
const RULE = rgb(0.85, 0.85, 0.88);

const LOGO_VIEWBOX = { width: 838.24, height: 150.3 };

type Fonts = { regular: PDFFont; bold: PDFFont; italic: PDFFont; heading: PDFFont };

export async function downloadBookingPdf(details: BookingPdfDetails): Promise<void> {
  const bytes = await createBookingPdf(details);
  const url = URL.createObjectURL(new Blob([bytes.slice()], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `maidenhead-spice-booking-${details.date}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Give the browser time to start the download before releasing the file.
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export async function createBookingPdf(details: BookingPdfDetails): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Booking request — ${siteInfo.name}`);
  pdf.setAuthor(siteInfo.name);
  pdf.setSubject(`Table for ${details.party} on ${formatFullDate(details.date)}`);
  pdf.setCreator(siteInfo.url);

  const page = pdf.addPage(A4);
  const fonts: Fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    italic: await pdf.embedFont(StandardFonts.TimesRomanItalic),
    heading: await pdf.embedFont(StandardFonts.TimesRomanBoldItalic),
  };
  const { width, height } = page.getSize();
  const contentWidth = width - MARGIN * 2;
  // Layout runs top-down; PDF coordinates run bottom-up.
  const fromTop = (y: number) => height - y;

  // — Masthead: the wordmark, tagline and a saffron rule, centred.
  const logoWidth = 250;
  const logoScale = logoWidth / LOGO_VIEWBOX.width;
  for (const d of await loadLogoPaths()) {
    page.drawSvgPath(d, { x: (width - logoWidth) / 2, y: fromTop(56), scale: logoScale, color: INK });
  }
  let y = 56 + LOGO_VIEWBOX.height * logoScale + 24;
  drawCentred(page, siteInfo.tagline, fonts.italic, 12, fromTop(y), MUTED);
  y += 16;
  page.drawRectangle({ x: (width - 40) / 2, y: fromTop(y + 3), width: 40, height: 3, color: SAFFRON });

  y += 36;
  drawCentred(page, "BOOKING REQUEST", fonts.bold, 8.5, fromTop(y), OXBLOOD, 2);
  y += 30;
  const firstName = details.name.trim().split(/\s+/)[0] ?? "";
  drawCentred(page, `Thank you${firstName ? `, ${firstName}` : ""}`, fonts.heading, 26, fromTop(y), INK);

  // — Status box: the one thing guests must not miss.
  y += 26;
  const boxPadding = 16;
  const noticeLines = wrap(
    `We will call you on ${details.phone} to confirm your table. It is not booked until we do. ` +
      `To change or cancel, call us on ${contact.phones[0]}.`,
    fonts.regular,
    10.5,
    contentWidth - boxPadding * 2 - 6
  );
  const boxHeight = boxPadding * 2 + 14 + noticeLines.length * 15;
  page.drawRectangle({
    x: MARGIN,
    y: fromTop(y + boxHeight),
    width: contentWidth,
    height: boxHeight,
    borderColor: INK,
    borderWidth: 1.5,
  });
  page.drawRectangle({ x: MARGIN, y: fromTop(y + boxHeight), width: 6, height: boxHeight, color: SAFFRON });
  let boxY = y + boxPadding + 10;
  drawText(page, "Not confirmed yet", fonts.bold, 11.5, MARGIN + boxPadding + 6, fromTop(boxY), INK);
  for (const line of noticeLines) {
    boxY += 15;
    drawText(page, line, fonts.regular, 10.5, MARGIN + boxPadding + 6, fromTop(boxY), INK);
  }
  y += boxHeight + 34;

  // — The request itself, as a label / value table.
  drawText(page, "YOUR REQUEST", fonts.bold, 8.5, MARGIN, fromTop(y), OXBLOOD, 2);
  y += 12;
  const rows: [string, string][] = [
    ["Name", details.name],
    ["Date", formatFullDate(details.date)],
    ["Time", formatSlot(details.time)],
    ["Guests", `${details.party} ${details.party === 1 ? "guest" : "guests"}`],
    ["Phone", details.phone],
    ["Email", details.email],
  ];
  if (details.notes?.trim()) rows.push(["Special requests", details.notes.trim()]);

  const valueWidth = contentWidth - LABEL_COLUMN;
  for (const [label, value] of rows) {
    const lines = wrap(value, fonts.regular, 12, valueWidth);
    const rowHeight = 18 + lines.length * 16;
    drawText(page, label.toUpperCase(), fonts.bold, 7.5, MARGIN, fromTop(y + 22), MUTED, 1.2);
    lines.forEach((line, i) => {
      drawText(page, line, fonts.regular, 12, MARGIN + LABEL_COLUMN, fromTop(y + 22 + i * 16), INK);
    });
    y += rowHeight;
    page.drawLine({
      start: { x: MARGIN, y: fromTop(y) },
      end: { x: width - MARGIN, y: fromTop(y) },
      thickness: 0.75,
      color: RULE,
    });
  }

  // — Where to find us, and that day's opening hours.
  y += 34;
  drawText(page, "THE RESTAURANT", fonts.bold, 8.5, MARGIN, fromTop(y), OXBLOOD, 2);
  y += 22;
  const columnX = MARGIN + contentWidth / 2;
  const dayHours = hoursForDate(details.date);
  const left = [siteInfo.name, contact.addressLine1, `${contact.addressLine2} ${contact.postcode}`];
  const right = [
    `Phone ${contact.phones.join("  ·  ")}`,
    contact.email,
    dayHours ? `Open ${dayHours.day}: ${dayHours.times}` : "",
  ].filter(Boolean);
  left.forEach((line, i) =>
    drawText(page, line, i === 0 ? fonts.bold : fonts.regular, 11, MARGIN, fromTop(y + i * 16), INK)
  );
  right.forEach((line, i) => drawText(page, line, fonts.regular, 11, columnX, fromTop(y + i * 16), INK));

  // — Footer: when this was sent, and where it came from.
  const footerY = height - MARGIN + 8;
  page.drawLine({
    start: { x: MARGIN, y: fromTop(footerY - 18) },
    end: { x: width - MARGIN, y: fromTop(footerY - 18) },
    thickness: 0.75,
    color: RULE,
  });
  drawCentred(
    page,
    `Request sent ${formatSentAt(details.requestedAt)}  ·  ${siteInfo.url.replace(/^https?:\/\//, "")}`,
    fonts.regular,
    8.5,
    fromTop(footerY),
    MUTED
  );

  return pdf.save();
}

/** "30 September 2026 at 4.02pm", in restaurant time and the site's style. */
function formatSentAt(ms: number): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: RESTAURANT_TIME_ZONE,
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(ms))
      .map((part) => [part.type, part.value])
  );
  return `${parts.day} ${parts.month} ${parts.year} at ${formatSlot(`${parts.hour}:${parts.minute}`)}`;
}

/** Path data from the published wordmark, so the PDF uses the real logo. */
async function loadLogoPaths(): Promise<string[]> {
  try {
    const res = await fetch("/brand/logo.svg");
    if (!res.ok) return [];
    const svg = new DOMParser().parseFromString(await res.text(), "image/svg+xml");
    return [...svg.querySelectorAll("path")]
      .map((p) => p.getAttribute("d") ?? "")
      .filter(Boolean);
  } catch {
    return [];
  }
}

function drawText(
  page: PDFPage,
  text: string,
  font: PDFFont,
  size: number,
  x: number,
  y: number,
  color = INK,
  tracking = 0
) {
  const safe = encodable(text, font);
  if (!safe) return;
  if (tracking) page.pushOperators(pushGraphicsState(), setCharacterSpacing(tracking));
  page.drawText(safe, { x, y, size, font, color });
  if (tracking) page.pushOperators(setCharacterSpacing(0), popGraphicsState());
}

function drawCentred(
  page: PDFPage,
  text: string,
  font: PDFFont,
  size: number,
  y: number,
  color = INK,
  tracking = 0
) {
  const safe = encodable(text, font);
  const textWidth = font.widthOfTextAtSize(safe, size) + tracking * Math.max(0, safe.length - 1);
  drawText(page, safe, font, size, (page.getWidth() - textWidth) / 2, y, color, tracking);
}

/** Word-wrap to a width; very long words (emails, links) break mid-word. */
function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const fits = (s: string) => font.widthOfTextAtSize(s, size) <= maxWidth;
  const lines: string[] = [];
  // Split before filtering: the fonts can't encode "\n", so it would be dropped.
  for (const paragraph of text.split(/\r?\n/).map((part) => encodable(part, font))) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const candidate = line ? `${line} ${word}` : word;
      if (fits(candidate)) {
        line = candidate;
        continue;
      }
      if (line) lines.push(line);
      line = word;
      while (!fits(line)) {
        let cut = line.length - 1;
        while (cut > 1 && !fits(line.slice(0, cut))) cut--;
        lines.push(line.slice(0, cut));
        line = line.slice(cut);
      }
    }
    lines.push(line);
  }
  return lines.length ? lines : [""];
}

/**
 * The built-in PDF fonts only cover Western European characters. Accents
 * are kept where the font has them, stripped where it doesn't, and anything
 * else (other scripts, emoji) is dropped rather than failing the download.
 */
function encodable(text: string, font: PDFFont): string {
  let out = "";
  for (const char of text) {
    if (canEncode(char, font)) {
      out += char;
      continue;
    }
    const base = char.normalize("NFKD").replace(/[̀-ͯ]/g, "");
    if (base && base !== char && canEncode(base, font)) out += base;
  }
  return out.trim();
}

const encodeCache = new WeakMap<PDFFont, Map<string, boolean>>();

function canEncode(char: string, font: PDFFont): boolean {
  let cache = encodeCache.get(font);
  if (!cache) encodeCache.set(font, (cache = new Map()));
  let ok = cache.get(char);
  if (ok === undefined) {
    try {
      font.encodeText(char);
      ok = true;
    } catch {
      ok = false;
    }
    cache.set(char, ok);
  }
  return ok;
}
