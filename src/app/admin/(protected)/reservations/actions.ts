"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { updateReservationStatus } from "@/lib/data/reservations";
import { renderReservationStatusEmail, sendMail } from "@/lib/mail";
import type { ReservationStatus } from "@/lib/supabase/types";

const ALLOWED: ReservationStatus[] = ["pending", "confirmed", "declined"];

export async function setReservationStatus(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as ReservationStatus;
  const notify = formData.get("notify") === "on";
  if (!id || !ALLOWED.includes(status)) return;

  const reservation = await updateReservationStatus(id, status);
  if (!reservation) return;

  // Email the customer when confirming or declining (best-effort).
  if (notify && (status === "confirmed" || status === "declined")) {
    try {
      const { subject, html, text } = renderReservationStatusEmail({
        name: reservation.name,
        date: reservation.date,
        time: reservation.time,
        party: String(reservation.party_size),
        status,
      });
      await sendMail({ to: reservation.email, subject, html, text });
    } catch (err) {
      console.error("[reservations] status email failed", err);
    }
  }

  revalidatePath("/admin/reservations");
  revalidatePath("/admin");
}
