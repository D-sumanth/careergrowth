import { AdminMetricGrid } from "@/components/admin/admin-metric-grid";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { Badge } from "@/components/ui/badge";
import { requireSession } from "@/lib/auth/session";
import { getAdminInquiriesData } from "@/lib/admin";
import { formatDateTime } from "@/lib/utils";

export default async function AdminInquiriesPage() {
  await requireSession(["ADMIN"]);
  const data = await getAdminInquiriesData();

  return (
    <DashboardShell title="Inquiries" description="Review incoming leads, track status, and see who is waiting for a response." admin role="ADMIN">
      <AdminMetricGrid
        items={[
          { label: "Visible inquiries", value: String(data.inquiries.length) },
          { label: "Open items", value: String(data.openCount) },
        ]}
      />
      <AdminSectionCard title="Inquiry queue" description="Recent contact submissions across all categories.">
        {data.inquiries.length ? (
          <div className="space-y-4">
            {data.inquiries.map((inquiry) => (
              <div key={inquiry.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-950">{inquiry.subject}</p>
                      <Badge>{inquiry.status}</Badge>
                      <Badge>{inquiry.category.replaceAll("_", " ")}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {inquiry.name} - {inquiry.email}
                    </p>
                    <p className="mt-3 text-sm text-slate-600">{inquiry.message}</p>
                  </div>
                  <p className="text-sm text-slate-500">{formatDateTime(inquiry.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DashboardEmptyState title="No inquiries yet" description="General inquiries, resume review requests, and consultation leads will appear here." />
        )}
      </AdminSectionCard>
    </DashboardShell>
  );
}
