import { AdminMetricGrid } from "@/components/admin/admin-metric-grid";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { Badge } from "@/components/ui/badge";
import { requireSession } from "@/lib/auth/session";
import { getAdminReviewsData } from "@/lib/admin";
import { formatDateTime } from "@/lib/utils";

export default async function AdminReviewsPage() {
  await requireSession(["ADMIN"]);
  const data = await getAdminReviewsData();

  return (
    <DashboardShell title="Reviews" description="Track the resume and LinkedIn review queue with current status, documents, and ownership." admin role="ADMIN">
      <AdminMetricGrid
        items={[
          { label: "Visible reviews", value: String(data.reviews.length) },
          { label: "Pending", value: String(data.pendingCount) },
        ]}
      />
      <AdminSectionCard title="Review queue" description="Most recent resume review requests in the system.">
        {data.reviews.length ? (
          <div className="space-y-4">
            {data.reviews.map((review) => (
              <div key={review.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-950">{review.jobTarget}</p>
                      <Badge>{review.status.replaceAll("_", " ")}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {review.requester?.name ?? "Unknown requester"}
                      {review.assignedTo ? ` - Assigned to ${review.assignedTo.name}` : ""}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{review.currentChallenge}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      {review.documents.length} documents - {formatDateTime(review.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DashboardEmptyState title="No review requests yet" description="Resume and LinkedIn review requests will appear here once students start submitting them." />
        )}
      </AdminSectionCard>
    </DashboardShell>
  );
}
