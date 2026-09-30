"""
Generate every brand asset from the master vector logo.

Source:  Logo/Maidenhead Spice Logo_.svg  (Illustrator export, no background)

Outputs:
  public/brand/logo.svg            full wordmark, transparent, ink
  public/brand/logo-light.svg      full wordmark, transparent, cream (dark backgrounds)
  public/brand/logo-light.png      1600px-wide raster of the light wordmark
  public/brand/monogram.svg        the script "M" on its own, transparent
  public/brand/icon-192.png        web manifest icons
  public/brand/icon-512.png
  public/brand/icon-maskable-512.png
  src/app/icon.svg                 browser-tab icon (scalable)
  src/app/favicon.ico              16 / 32 / 48 px
  src/app/apple-icon.png           180 px iOS home-screen icon
  src/app/opengraph-image.jpg      1200 x 630 link-preview card

Run from the repo root:
  pip install playwright pillow && playwright install chromium
  python scripts/generate-brand-assets.py
"""

from __future__ import annotations

import base64
import io
import re
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "Logo" / "Maidenhead Spice Logo_.svg"
BRAND = ROOT / "public" / "brand"
APP = ROOT / "src" / "app"
OG_PHOTO = ROOT / "public" / "images" / "ambience" / "IMG-20251030-WA0018.jpg"

INK = "#050315"
CREAM = "#fbfbfe"
SAFFRON = "#fba600"

LOGO_VIEWBOX = "0 0 838.24 150.3"
# "Maidenhead" is a single connected outline, so the M is isolated with a
# clip polygon that stops just before the stroke flows into the "a".
M_CLIP = "0,0 240,0 240,57 166,57 150,78 141,97 138,120 0,120"


def logo_paths() -> list[str]:
    svg = SOURCE.read_text(encoding="utf-8")
    return [re.sub(r"\s+", " ", d).strip() for d in re.findall(r'<path d="([^"]+)"', svg)]


PATHS = logo_paths()
MAIDENHEAD = PATHS[1]


def wordmark_svg(fill: str) -> str:
    body = "".join(f'<path d="{d}"/>' for d in PATHS)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{LOGO_VIEWBOX}" '
        f'role="img" aria-label="Maidenhead Spice"><g fill="{fill}">{body}</g></svg>\n'
    )


def m_bbox(page) -> tuple[float, float, float, float]:
    """Measure the clipped M in SVG units by rasterising it at 10x."""
    scale = 10
    html = (
        "<html><body style='margin:0;background:#fff'>"
        f"<svg viewBox='0 0 260 130' width='{260 * scale}' height='{130 * scale}'>"
        f"<defs><clipPath id='c'><polygon points='{M_CLIP}'/></clipPath></defs>"
        f"<path d='{MAIDENHEAD}' fill='#000' clip-path='url(#c)'/></svg></body></html>"
    )
    page.set_viewport_size({"width": 260 * scale, "height": 130 * scale})
    page.set_content(html)
    png = page.screenshot(type="png")
    img = Image.open(io.BytesIO(png)).convert("L").point(lambda v: 255 if v < 128 else 0)
    left, top, right, bottom = img.getbbox()
    return left / scale, top / scale, (right - left) / scale, (bottom - top) / scale


def monogram_svg(box, *, tile: str | None, fill: str, coverage: float, embolden: float = 0) -> str:
    """The M centred in a square. `coverage` is the M's width as a share of the square."""
    x, y, w, h = box
    side = w / coverage
    vx = x - (side - w) / 2
    vy = y - (side - h) / 2
    bg = f'<rect x="{vx:.2f}" y="{vy:.2f}" width="{side:.2f}" height="{side:.2f}" fill="{tile}"/>' if tile else ""
    stroke = f' stroke="{fill}" stroke-width="{embolden}" stroke-linejoin="round"' if embolden else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vx:.2f} {vy:.2f} {side:.2f} {side:.2f}">'
        f'<defs><clipPath id="m"><polygon points="{M_CLIP}"/></clipPath></defs>{bg}'
        f'<path d="{MAIDENHEAD}" fill="{fill}"{stroke} clip-path="url(#m)"/></svg>\n'
    )


def render_svg(page, svg: str, size: int) -> Image.Image:
    sized = svg.replace("<svg ", f'<svg width="{size}" height="{size}" ', 1)
    page.set_viewport_size({"width": size, "height": size})
    page.set_content(f"<html><body style='margin:0;background:transparent'>{sized}</body></html>")
    png = page.screenshot(type="png", omit_background=True, clip={"x": 0, "y": 0, "width": size, "height": size})
    return Image.open(io.BytesIO(png)).convert("RGBA")


def render_og(page, light_logo: str) -> Image.Image:
    photo = base64.b64encode(OG_PHOTO.read_bytes()).decode()
    html = f"""<!doctype html><html><head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400&family=Merienda:wght@400;700&display=block" rel="stylesheet">
<style>
  * {{ box-sizing: border-box; margin: 0; }}
  body {{ width: 1200px; height: 630px; background: {INK}; font-family: Lato, sans-serif; }}
  .card {{ display: grid; grid-template-columns: 680px 1fr; height: 630px; }}
  .left {{ padding: 0 64px; display: flex; flex-direction: column; justify-content: center; color: {CREAM}; }}
  .eyebrow {{ font-size: 20px; font-weight: 700; letter-spacing: .28em; text-transform: uppercase; color: {SAFFRON}; }}
  .logo {{ margin-top: 30px; width: 552px; }}
  .logo svg {{ display: block; width: 100%; height: auto; }}
  .rule {{ margin-top: 34px; width: 96px; height: 6px; background: {SAFFRON}; }}
  .tag {{ margin-top: 28px; font-family: Merienda, cursive; font-size: 34px; line-height: 1.25; }}
  .meta {{ margin-top: 26px; font-size: 21px; letter-spacing: .06em; color: rgba(251,251,254,.72); }}
  .right {{ position: relative; border-left: 8px solid {SAFFRON}; background: url(data:image/jpeg;base64,{photo}) center / cover; }}
</style></head><body>
<div class="card">
  <div class="left">
    <p class="eyebrow">Indian Restaurant &middot; Maidenhead</p>
    <div class="logo">{light_logo}</div>
    <div class="rule"></div>
    <p class="tag">From our Kitchen to your table</p>
    <p class="meta">117 Bridge Road &middot; 01628 670670 &middot; Open 7 days</p>
  </div>
  <div class="right"></div>
</div></body></html>"""
    page.set_viewport_size({"width": 1200, "height": 630})
    page.set_content(html, wait_until="networkidle")
    page.evaluate("document.fonts.ready")
    png = page.screenshot(type="png")
    return Image.open(io.BytesIO(png)).convert("RGB")


def main() -> None:
    BRAND.mkdir(parents=True, exist_ok=True)

    light_logo = wordmark_svg(CREAM)
    (BRAND / "logo.svg").write_text(wordmark_svg(INK), encoding="utf-8")
    (BRAND / "logo-light.svg").write_text(light_logo, encoding="utf-8")

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        box = m_bbox(page)
        print("M bbox (svg units):", tuple(round(v, 2) for v in box))

        (BRAND / "monogram.svg").write_text(
            monogram_svg(box, tile=None, fill=INK, coverage=1), encoding="utf-8"
        )

        # Browser tab: generous size, lightly emboldened so hairlines survive at 16px.
        tab_icon = monogram_svg(box, tile=INK, fill=CREAM, coverage=0.9, embolden=2.2)
        (APP / "icon.svg").write_text(tab_icon, encoding="utf-8")

        ico_frames = [render_svg(page, monogram_svg(box, tile=INK, fill=CREAM, coverage=0.92, embolden=e), s)
                      for s, e in ((48, 2.6), (32, 3.2), (16, 4.4))]
        ico_frames[0].save(APP / "favicon.ico", format="ICO", sizes=[(48, 48), (32, 32), (16, 16)],
                           append_images=ico_frames[1:])

        # Home-screen icons: iOS and Android crop the corners, so leave room.
        render_svg(page, monogram_svg(box, tile=INK, fill=CREAM, coverage=0.8, embolden=0.8), 180) \
            .convert("RGB").save(APP / "apple-icon.png", optimize=True)
        for size in (192, 512):
            render_svg(page, monogram_svg(box, tile=INK, fill=CREAM, coverage=0.8, embolden=0.6), size) \
                .convert("RGB").save(BRAND / f"icon-{size}.png", optimize=True)
        render_svg(page, monogram_svg(box, tile=INK, fill=CREAM, coverage=0.62, embolden=0.6), 512) \
            .convert("RGB").save(BRAND / "icon-maskable-512.png", optimize=True)

        # Transparent light wordmark raster (for email signatures, socials, etc.).
        page.set_viewport_size({"width": 1600, "height": 287})
        page.set_content(
            "<html><body style='margin:0;background:transparent'>"
            + light_logo.replace("<svg ", '<svg width="1600" height="287" ', 1)
            + "</body></html>"
        )
        page.screenshot(path=str(BRAND / "logo-light.png"), omit_background=True,
                        clip={"x": 0, "y": 0, "width": 1600, "height": 287})

        og = render_og(page, light_logo)
        og.save(APP / "opengraph-image.jpg", quality=86, optimize=True, progressive=True)

        browser.close()

    print("Brand assets written.")


if __name__ == "__main__":
    main()
