import { getEventAccessCode } from "@/lib/access-code";
import { prisma } from "@/lib/prisma";
import EventAccessCodeForm from "./EventAccessCodeForm";
import MaxRegistrationsForm from "./MaxRegistrationsForm";

export default async function AdminSettingsPage() {
  const currentCode = await getEventAccessCode();
  const maxRegSetting = await prisma.siteSetting.findUnique({ where: { key: "MAX_REGISTRATIONS" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      <div className="space-y-6 max-w-lg">
        <div className="bg-card-bg border border-card-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">Event Access Code</h2>
          <p className="text-sm text-muted mb-4">
            This code is required for users to create accounts and register. Share it in event invitations.
          </p>
          <EventAccessCodeForm currentCode={currentCode ?? ""} />
        </div>

        <div className="bg-card-bg border border-card-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">Max Registrations</h2>
          <p className="text-sm text-muted mb-4">
            Set the maximum number of golfer registrations. When reached, new registrations are redirected to the waitlist. Set to 0 for unlimited.
          </p>
          <MaxRegistrationsForm currentValue={maxRegSetting?.value ?? "0"} />
        </div>
      </div>
    </div>
  );
}
