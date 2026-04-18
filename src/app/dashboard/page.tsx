import { Card } from "@/components/ui/card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireSession } from "@/lib/auth/session";

export default async function DashboardPage() {
  const session = await requireSession(["STUDENT", "CONSULTANT", "ADMIN"]);

  return (
    <DashboardShell title={`Welcome back, ${session.name.split(" ")[0]}`}>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Upcoming bookings", "2"],
          ["Past bookings", "6"],
          ["Uploaded documents", "3"],
          ["Notifications", "4"],
        ].map(([label, value]) => (
          <Card key={label} className="p-6">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 font-serif text-4xl text-slate-950">{value}</p>
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <h2 className="font-semibold text-slate-950">Dashboard coverage</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          The full-stack structure supports upcoming bookings, past bookings, purchased packages, uploaded CVs, payment history, notifications, profile settings, and reschedule/cancel actions.
        </p>
      </Card>
    </DashboardShell>
  );
}
