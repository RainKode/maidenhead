import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Page title + optional action area for admin screens. */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-[3px] border-ink pb-5">
      <div>
        <h1 className="font-display text-[28px] leading-tight text-ink">{title}</h1>
        {description ? <p className="mt-1 text-[14px] text-ink/70">{description}</p> : null}
      </div>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("brutal-card-sm bg-background p-5", className)}>{children}</div>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="brutal-card-sm bg-background px-6 py-14 text-center text-[15px] text-ink/60">
      {children}
    </div>
  );
}

const fieldClasses =
  "w-full bg-background border-[2px] border-ink px-3 h-10 text-[15px] text-ink focus:outline-none focus:border-saffron";

/** Labelled text input. */
export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required,
  step,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  placeholder?: string;
  required?: boolean;
  step?: string;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="caps-track-tight text-[10px] text-ink/60">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        className={fieldClasses}
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        step={step}
      />
      {hint ? <span className="text-[11px] text-ink/50">{hint}</span> : null}
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  placeholder,
  rows = 4,
  required,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="caps-track-tight text-[10px] text-ink/60">
        {label}
        {required ? " *" : ""}
      </span>
      <textarea
        className="w-full resize-y border-[2px] border-ink bg-background px-3 py-2 text-[15px] text-ink focus:border-saffron focus:outline-none"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={rows}
        required={required}
      />
      {hint ? <span className="text-[11px] text-ink/50">{hint}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  options,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="caps-track-tight text-[10px] text-ink/60">
        {label}
        {required ? " *" : ""}
      </span>
      <select
        className={cn(fieldClasses, "appearance-none")}
        name={name}
        defaultValue={defaultValue}
        required={required}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const badgeTones: Record<string, string> = {
  neutral: "border-ink/40 text-ink/70",
  pending: "border-saffron-dark text-saffron-dark",
  new: "border-saffron-dark text-saffron-dark",
  confirmed: "border-oxblood text-oxblood",
  completed: "border-oxblood text-oxblood",
  preparing: "border-copper text-copper",
  declined: "border-destructive text-destructive",
  cancelled: "border-destructive text-destructive",
  published: "border-oxblood text-oxblood",
  draft: "border-ink/40 text-ink/60",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = badgeTones[status] ?? badgeTones.neutral;
  return (
    <span
      className={cn(
        "inline-block border-[2px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]",
        tone
      )}
    >
      {status}
    </span>
  );
}

/** Primary link styled like a button (for "New …" actions). */
export function ButtonLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="caps-track inline-flex h-10 items-center justify-center border-[3px] border-ink bg-saffron px-5 text-[11px] font-bold text-ink transition-colors hover:bg-saffron/90 [box-shadow:var(--shadow-brutal-sm)]"
    >
      {children}
    </Link>
  );
}
