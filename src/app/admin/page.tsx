import { Card } from "@/components/ui/card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireSession } from "@/lib/auth/session";

export default async function AdminPage() {
  await requireSession(["ADMIN"]);

  return (
    <DashboardShell title="Admin overview" admin>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total users", "184"],
          ["Total bookings", "132"],
          ["Revenue", "GBP 12.4k"],
          ["Pending reviews", "7"],
        ].map(([label, value]) => (
          <Card key={label} className="p-6">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 font-serif text-4xl text-slate-950">{value}</p>
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <p className="text-sm leading-7 text-slate-600">The admin console structure covers users, bookings, services, workshops, content, inquiries, reviews, payments, exports, and business settings.</p>
      </Card>
    </DashboardShell>
  );
}
