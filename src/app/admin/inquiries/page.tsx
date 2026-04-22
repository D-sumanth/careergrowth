import { AdminMetricGrid } from "@/components/admin/admin-metric-grid";
import { InquiriesManager } from "@/components/admin/inquiries-manager";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { requireSession } from "@/lib/auth/session";
import { getAdminInquiriesData } from "@/lib/admin";

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
          <InquiriesManager items={data.inquiries} />
        ) : (
          <DashboardEmptyState title="No inquiries yet" description="General inquiries, resume review requests, and consultation leads will appear here." />
        )}
      </AdminSectionCard>
    </DashboardShell>
  );
}
