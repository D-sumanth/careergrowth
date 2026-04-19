import { SettingsForm } from "@/components/dashboard/settings-form";
import { Card } from "@/components/ui/card";
import { requireSession } from "@/lib/auth/session";
import { getCurrentUserAccount } from "@/lib/account";

export default async function DashboardSettingsPage() {
  const session = await requireSession(["STUDENT", "CONSULTANT", "ADMIN"]);
  const account = await getCurrentUserAccount(session.userId);
  if (!account) return null;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="font-semibold text-slate-950">Profile settings</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          Update the profile details that help with coaching, bookings, and keeping your account information current.
        </p>
      </Card>
      <SettingsForm account={account} />
    </div>
  );
}
