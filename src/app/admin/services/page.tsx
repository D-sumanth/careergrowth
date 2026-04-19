import { AdminMetricGrid } from "@/components/admin/admin-metric-grid";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { Badge } from "@/components/ui/badge";
import { requireSession } from "@/lib/auth/session";
import { getAdminServicesData } from "@/lib/admin";
import { formatCurrency } from "@/lib/utils";

export default async function AdminServicesPage() {
  await requireSession(["ADMIN"]);
  const data = await getAdminServicesData();

  return (
    <DashboardShell title="Services" description="See the active service catalog, pricing, durations, and booking demand in one place." admin role="ADMIN">
      <AdminMetricGrid
        items={[
          { label: "Services", value: String(data.services.length) },
          { label: "Active", value: String(data.services.filter((service) => service.isActive).length) },
          { label: "Featured", value: String(data.services.filter((service) => service.isFeatured).length) },
        ]}
      />
      <AdminSectionCard title="Service catalog" description="Live services currently stored in the database.">
        {data.services.length ? (
          <div className="space-y-4">
            {data.services.map((service) => (
              <div key={service.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-950">{service.title}</p>
                      {service.isFeatured ? <Badge>Featured</Badge> : null}
                      <Badge className={service.isActive ? "text-emerald-700" : "text-rose-700"}>{service.isActive ? "Active" : "Inactive"}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{service.shortDescription}</p>
                  </div>
                  <div className="text-sm text-slate-600">
                    <p>{formatCurrency(service.pricePence)}</p>
                    <p>{service.durationMinutes} minutes</p>
                    <p>{service._count.bookings} bookings</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DashboardEmptyState title="No services found" description="Seeded or admin-created services will appear here once the current database has service records." />
        )}
      </AdminSectionCard>
    </DashboardShell>
  );
}
