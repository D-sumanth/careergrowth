import { Card } from "@/components/ui/card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireSession } from "@/lib/auth/session";

export default async function DashboardBookingsPage() {
  await requireSession(["STUDENT", "CONSULTANT", "ADMIN"]);

  return (
    <DashboardShell title="Bookings">
      <Card className="p-6">
        <h2 className="font-semibold text-slate-950">Upcoming and past bookings</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          This area is ready for confirmed booking history, rescheduling controls, cancellation cutoffs, calendar export links, and consultant notes.
        </p>
      </Card>
    </DashboardShell>
  );
}
