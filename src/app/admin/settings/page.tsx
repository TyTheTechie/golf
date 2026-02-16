import { getEventAccessCode } from "@/lib/access-code";
import EventAccessCodeForm from "./EventAccessCodeForm";

export default async function AdminSettingsPage() {
  const currentCode = await getEventAccessCode();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      <div className="bg-card-bg border border-card-border rounded-xl p-6 max-w-lg">
        <h2 className="text-lg font-semibold text-foreground mb-1">Event Access Code</h2>
        <p className="text-sm text-muted mb-4">
          This code is required for users to create accounts and register. Share it in event invitations.
        </p>
        <EventAccessCodeForm currentCode={currentCode ?? ""} />
      </div>
    </div>
  );
}
