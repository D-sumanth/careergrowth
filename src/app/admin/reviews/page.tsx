import { AdminMetricGrid } from "@/components/admin/admin-metric-grid";
import { ReviewsManager } from "@/components/admin/reviews-manager";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { requireSession } from "@/lib/auth/session";
import { getAdminReviewsData } from "@/lib/admin";

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
          <ReviewsManager
            items={data.reviews.map((review) => ({
              id: review.id,
              jobTarget: review.jobTarget,
              currentChallenge: review.currentChallenge,
              status: review.status,
              assignedToId: review.assignedToId,
              notes: review.notes,
              deliverySummary: review.deliverySummary,
              turnaroundHours: review.turnaroundHours,
              requesterName: review.requester?.name ?? "Unknown requester",
              documents: review.documents.map((document) => ({
                id: document.id,
                fileName: document.fileName,
                visibility: document.visibility,
                createdAt: document.createdAt,
              })),
            }))}
            assignees={data.assignees}
          />
        ) : (
          <DashboardEmptyState title="No review requests yet" description="Resume and LinkedIn review requests will appear here once students start submitting them." />
        )}
      </AdminSectionCard>
    </DashboardShell>
  );
}
