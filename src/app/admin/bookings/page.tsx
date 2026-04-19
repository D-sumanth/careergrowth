import { AdminMetricGrid } from "@/components/admin/admin-metric-grid";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { Badge } from "@/components/ui/badge";
import { requireSession } from "@/lib/auth/session";
import { getAdminBookingsData } from "@/lib/admin";
import { formatDateTime } from "@/lib/utils";

export default async function AdminBookingsPage() {
  await requireSession(["ADMIN"]);
  const data = await getAdminBookingsData();

  return (
    <DashboardShell title="Bookings" description="Review live session history, statuses, and upcoming scheduled calls across the platform." admin role="ADMIN">
      <AdminMetricGrid
        items={[
          { label: "Visible bookings", value: String(data.bookings.length) },
          { label: "Upcoming", value: String(data.upcomingCount) },
        ]}
      />
      <AdminSectionCard title="Booking feed" description="Most recent bookings across students, services, and consultants.">
        {data.bookings.length ? (
          <div className="space-y-4">
            {data.bookings.map((booking) => (
              <div key={booking.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-950">{booking.service?.title ?? "Booked session"}</p>
                      <Badge>{booking.status}</Badge>
                      <Badge>{booking.paymentStatus}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {booking.student.name}
                      {booking.consultant ? ` with ${booking.consultant.name}` : ""}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">{formatDateTime(booking.startsAt, booking.timezone)}</p>
                  </div>
                  <div className="text-sm text-slate-600">
                    <p>{booking.kind.replaceAll("_", " ")}</p>
                    <p>{booking.notes ?? "No booking notes"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DashboardEmptyState title="No bookings recorded" description="New calendar bookings will appear here once users start scheduling sessions." />
        )}
      </AdminSectionCard>
    </DashboardShell>
  );
}
