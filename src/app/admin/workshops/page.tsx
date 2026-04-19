import { AdminMetricGrid } from "@/components/admin/admin-metric-grid";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { Badge } from "@/components/ui/badge";
import { requireSession } from "@/lib/auth/session";
import { getAdminWorkshopsData, getWorkshopStatusLabel } from "@/lib/admin";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function AdminWorkshopsPage() {
  await requireSession(["ADMIN"]);
  const data = await getAdminWorkshopsData();

  return (
    <DashboardShell title="Workshops" description="Monitor upcoming workshops, registration demand, and replay-ready sessions." admin role="ADMIN">
      <AdminMetricGrid
        items={[
          { label: "Workshops", value: String(data.workshops.length) },
          { label: "Published", value: String(data.workshops.filter((workshop) => workshop.status === "PUBLISHED").length) },
        ]}
      />
      <AdminSectionCard title="Workshop list" description="Workshops currently available in the database.">
        {data.workshops.length ? (
          <div className="space-y-4">
            {data.workshops.map((workshop) => (
              <div key={workshop.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-950">{workshop.title}</p>
                      <Badge>{getWorkshopStatusLabel(workshop.status)}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{workshop.description}</p>
                    <p className="mt-2 text-sm text-slate-500">{formatDateTime(workshop.startsAt, workshop.timezone)}</p>
                  </div>
                  <div className="text-sm text-slate-600">
                    <p>{formatCurrency(workshop.pricePence)}</p>
                    <p>
                      {workshop._count.registrations}/{workshop.seatLimit} seats
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DashboardEmptyState title="No workshops found" description="Published and draft workshops will appear here once they exist in the current database." />
        )}
      </AdminSectionCard>
    </DashboardShell>
  );
}
