"use client";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

/** Submit button that shows a pending label while its form action runs. */
export function SubmitButton({
  children,
  pendingLabel = "Saving…",
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "ghost" | "danger";
  className?: string;
}) {
  const { pending } = useFormStatus();

  const base =
    "caps-track inline-flex h-10 items-center justify-center border-[3px] border-ink px-5 text-[11px] font-bold transition-colors disabled:opacity-60 [box-shadow:var(--shadow-brutal-sm)]";
  const tones = {
    primary: "bg-saffron text-ink hover:bg-saffron/90",
    ghost: "bg-background text-ink hover:bg-ink hover:text-background",
    danger: "bg-destructive text-background hover:bg-destructive/90",
  };

  return (
    <button type="submit" disabled={pending} className={cn(base, tones[variant], className)}>
      {pending ? pendingLabel : children}
    </button>
  );
}
