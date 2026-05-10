"use client";

type Props = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

function buildSlots(startHour: number, startMinute: number, endHour: number, endMinute: number): string[] {
  const slots: string[] = [];
  const current = new Date(2000, 0, 1, startHour, startMinute);
  const end = new Date(2000, 0, 1, endHour, endMinute);

  while (current <= end) {
    slots.push(
      `${String(current.getHours()).padStart(2, "0")}:${String(current.getMinutes()).padStart(2, "0")}`
    );
    current.setMinutes(current.getMinutes() + 15);
  }

  return slots;
}

export const orderTimeSlots = [
  ...buildSlots(12, 0, 14, 0),
  ...buildSlots(17, 30, 22, 30),
];

export function TimeSlotPicker({ name, value, onChange, required }: Props) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="caps-track-tight text-[10px] font-bold text-ink uppercase tracking-[0.08em]">
        Time{required ? " *" : ""}
      </legend>
      <input type="hidden" name={name} value={value} />
      <div className="grid grid-cols-4 gap-1.5 mt-1">
        {orderTimeSlots.map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => onChange(slot)}
            aria-pressed={value === slot}
            className={
              value === slot
                ? "h-8 border-[2px] border-ink bg-ink text-background text-[11px] font-bold transition-colors"
                : "h-8 border-[2px] border-ink/40 text-ink/70 text-[11px] hover:border-ink hover:text-ink transition-colors"
            }
          >
            {slot}
          </button>
        ))}
      </div>
    </fieldset>
  );
}