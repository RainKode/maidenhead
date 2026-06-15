import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="brutal-card w-full max-w-md p-8">
        <p className="caps-track text-[12px] text-oxblood">Maidenhead Spice</p>
        <h1 className="mt-2 font-display text-[28px] text-ink">Admin sign in</h1>
        <p className="mt-2 text-[14px] text-ink/70">
          Manage the menu, reservations, orders and content.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
