import { EmptyState, PageHeader, StatusBadge } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";
import { getMessages } from "@/lib/data/messages";
import { toggleMessageRead } from "./actions";

function formatDate(value: string): string {
  return new Date(value).toLocaleString("en-GB", { timeZone: "Europe/London" });
}

export default async function MessagesPage() {
  const messages = await getMessages();

  return (
    <>
      <PageHeader title="Messages" description="Enquiries from the contact form." />

      {messages.length === 0 ? (
        <EmptyState>No messages yet.</EmptyState>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`brutal-card-sm p-5 ${m.read ? "bg-cream-deep" : "bg-background"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-display text-[18px] text-ink">{m.subject}</p>
                    {!m.read ? <StatusBadge status="new" /> : null}
                  </div>
                  <p className="mt-1 text-[13px] text-ink/60">
                    {m.name} ·{" "}
                    <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`} className="link-rule">
                      {m.email}
                    </a>{" "}
                    · {formatDate(m.created_at)}
                  </p>
                </div>
                <form action={toggleMessageRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="read" value={(!m.read).toString()} />
                  <SubmitButton variant="ghost" pendingLabel="…">
                    {m.read ? "Mark unread" : "Mark read"}
                  </SubmitButton>
                </form>
              </div>
              <p className="mt-3 whitespace-pre-wrap border-l-[3px] border-oxblood bg-cream px-4 py-3 text-[14px] leading-relaxed text-ink/85">
                {m.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
