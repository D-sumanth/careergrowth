import { AvailabilityManager } from "@/components/dashboard/availability-manager";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { requireSession } from "@/lib/auth/session";
import { getAvailabilityManagerData } from "@/lib/availability";

export default async function AdminAvailabilitySettingsPage() {
  const session = await requireSession(["ADMIN"]);
  const data = await getAvailabilityManagerData(session.userId, "ADMIN");

  return (
    <DashboardShell
      title="Availability settings"
      description="Manage weekly coaching hours and date-level overrides for the consultant calendar used in live bookings."
      admin
      role="ADMIN"
    >
      <Card className="p-6">
        <h2 className="font-semibold text-slate-950">Consultant scheduling controls</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          Use this page to define bookable weekly windows, block holidays, or open special extra hours without touching the database directly.
        </p>
      </Card>
      <AvailabilityManager role="ADMIN" {...data} />
    </DashboardShell>
  );
}
