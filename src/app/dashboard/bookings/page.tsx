import { Card } from "@/components/ui/card";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { requireSession } from "@/lib/auth/session";
import { getDashboardOverview } from "@/lib/dashboard";
import { formatDateTime } from "@/lib/utils";

export default async function DashboardBookingsPage() {
  const session = await requireSession(["STUDENT", "CONSULTANT", "ADMIN"]);
  const overview = await getDashboardOverview(session.userId);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="font-semibold text-slate-950">Bookings</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          Keep track of upcoming sessions, completed guidance calls, and your recent booking history in one place.
        </p>
      </Card>
      {overview.upcomingBookings.length || overview.pastBookings.length ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="font-semibold text-slate-950">Upcoming bookings</h2>
            <div className="mt-4 space-y-4">
              {overview.upcomingBookings.length ? (
                overview.upcomingBookings.map((booking) => (
                  <div key={booking.id} className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-medium text-slate-950">{booking.service?.title ?? "Booked session"}</p>
                    <p className="mt-1 text-sm text-slate-600">{formatDateTime(booking.startsAt, booking.timezone)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-600">No upcoming bookings.</p>
              )}
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="font-semibold text-slate-950">Past bookings</h2>
            <div className="mt-4 space-y-4">
              {overview.pastBookings.length ? (
                overview.pastBookings.map((booking) => (
                  <div key={booking.id} className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-medium text-slate-950">{booking.service?.title ?? "Completed session"}</p>
                    <p className="mt-1 text-sm text-slate-600">{formatDateTime(booking.startsAt, booking.timezone)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-600">No past bookings yet.</p>
              )}
            </div>
          </Card>
        </div>
      ) : (
        <DashboardEmptyState
          title="No bookings yet"
          description="Once a session is booked, confirmed, or completed, it will appear here with timing and history details."
        />
      )}
    </div>
  );
}
