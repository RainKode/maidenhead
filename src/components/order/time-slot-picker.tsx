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
    <label className="flex flex-col gap-1.5">
      <span className="caps-track-tight text-[10px] text-ink/60">Time</span>
      <select
        name={name}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 appearance-none border-0 border-b border-ink/25 bg-transparent px-0 text-[15px] text-ink outline-none focus:border-oxblood"
      >
        <option value="">Choose...</option>
        {orderTimeSlots.map((slot) => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </select>
    </label>
  );
}