import { Card } from "@/components/ui/card";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { requireSession } from "@/lib/auth/session";
import { getDashboardOverview } from "@/lib/dashboard";
import { formatDateTime } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await requireSession(["STUDENT", "CONSULTANT", "ADMIN"]);
  const overview = await getDashboardOverview(session.userId);
  const stats = [
    ["Upcoming bookings", String(overview.upcomingBookings.length)],
    ["Past bookings", String(overview.pastBookings.length)],
    ["Uploaded documents", String(overview.documents.length)],
    ["Notifications", String(overview.notifications.length)],
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <Card key={label} className="p-6">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 font-serif text-4xl text-slate-950">{value}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {overview.upcomingBookings.length ? (
          <Card className="p-6">
            <h2 className="font-semibold text-slate-950">Upcoming bookings</h2>
            <div className="mt-4 space-y-4">
              {overview.upcomingBookings.map((booking) => (
                <div key={booking.id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-950">{booking.service?.title ?? "Booked session"}</p>
                  <p className="mt-1 text-sm text-slate-600">{formatDateTime(booking.startsAt, booking.timezone)}</p>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <DashboardEmptyState
            title="No upcoming bookings yet"
            description="Once you book a session or workshop, it will appear here with timing and status details."
          />
        )}

        {overview.documents.length ? (
          <Card className="p-6">
            <h2 className="font-semibold text-slate-950">Recent documents</h2>
            <div className="mt-4 space-y-4">
              {overview.documents.map((document) => (
                <div key={document.id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-950">{document.fileName}</p>
                  <p className="mt-1 text-sm text-slate-600">{document.mimeType}</p>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <DashboardEmptyState
            title="No documents uploaded yet"
            description="Upload your CV or supporting files in the Documents area so they are ready for reviews and coaching sessions."
          />
        )}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {overview.notifications.length ? (
          <Card className="p-6">
            <h2 className="font-semibold text-slate-950">Recent activity</h2>
            <div className="mt-4 space-y-4">
              {overview.notifications.map((notification) => (
                <div key={notification.id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-950">{notification.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{notification.body}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-400">{formatDateTime(notification.createdAt)}</p>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <DashboardEmptyState
            title="No recent activity yet"
            description="Notifications about bookings, reviews, and account updates will appear here once your dashboard activity starts."
          />
        )}

        {overview.reviewRequests.length ? (
          <Card className="p-6">
            <h2 className="font-semibold text-slate-950">Resume review progress</h2>
            <div className="mt-4 space-y-4">
              {overview.reviewRequests.map((review) => (
                <div key={review.id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-950">{review.jobTarget}</p>
                  <p className="mt-1 text-sm text-slate-600">{review.currentChallenge}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-400">{review.status.replaceAll("_", " ")}</p>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <DashboardEmptyState
            title="No review requests yet"
            description="When you submit a CV or LinkedIn review request, its status and turnaround updates will live here."
          />
        )}
      </div>
    </div>
  );
}
