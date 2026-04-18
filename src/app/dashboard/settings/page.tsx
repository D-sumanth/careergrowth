import { Card } from "@/components/ui/card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireSession } from "@/lib/auth/session";

export default async function DashboardSettingsPage() {
  await requireSession(["STUDENT", "CONSULTANT", "ADMIN"]);

  return (
    <DashboardShell title="Profile settings">
      <Card className="p-6">
        <p className="text-sm leading-7 text-slate-600">Profile fields are structured for full name, university, degree, visa status, career target, LinkedIn URL, notes, mobile number, and timezone.</p>
      </Card>
    </DashboardShell>
  );
}
