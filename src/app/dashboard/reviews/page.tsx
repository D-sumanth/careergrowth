import { Card } from "@/components/ui/card";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { requireSession } from "@/lib/auth/session";
import { getDashboardOverview } from "@/lib/dashboard";
import { formatDateTime } from "@/lib/utils";

export default async function DashboardReviewsPage() {
  const session = await requireSession(["STUDENT", "CONSULTANT", "ADMIN"]);
  const overview = await getDashboardOverview(session.userId);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="font-semibold text-slate-950">Resume reviews</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Track each review request, see its current status, and keep an eye on delivery updates from coaching support.
        </p>
      </Card>
      {overview.reviewRequests.length ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {overview.reviewRequests.map((review) => (
            <Card key={review.id} className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">{review.status.replaceAll("_", " ")}</p>
              <h3 className="mt-3 font-serif text-2xl text-slate-950">{review.jobTarget}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{review.currentChallenge}</p>
              {review.deadline ? <p className="mt-4 text-sm text-slate-500">Deadline: {formatDateTime(review.deadline)}</p> : null}
              {review.deliverySummary ? <p className="mt-4 text-sm leading-7 text-slate-600">{review.deliverySummary}</p> : null}
            </Card>
          ))}
        </div>
      ) : (
        <DashboardEmptyState
          title="No review requests in progress"
          description="Your submitted CV or LinkedIn review requests will show up here with progress updates once they have been created."
        />
      )}
    </div>
  );
}
