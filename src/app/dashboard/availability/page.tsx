import { AvailabilityManager } from "@/components/dashboard/availability-manager";
import { Card } from "@/components/ui/card";
import { requireSession } from "@/lib/auth/session";
import { getAvailabilityManagerData } from "@/lib/availability";

export default async function DashboardAvailabilityPage() {
  const session = await requireSession(["CONSULTANT", "ADMIN"]);
  const role = session.role === "ADMIN" ? "ADMIN" : "CONSULTANT";
  const data = await getAvailabilityManagerData(session.userId, role);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="font-semibold text-slate-950">Availability</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          Set your weekly working hours and one-off blocked dates so students only see the slots you actually want to offer.
        </p>
      </Card>
      <AvailabilityManager role={role} {...data} />
    </div>
  );
}
