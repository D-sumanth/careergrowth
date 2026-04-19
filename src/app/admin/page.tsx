import { AdminMetricGrid } from "@/components/admin/admin-metric-grid";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { Badge } from "@/components/ui/badge";
import { requireSession } from "@/lib/auth/session";
import { getAdminOverviewData } from "@/lib/admin";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function AdminPage() {
  await requireSession(["ADMIN"]);
  const overview = await getAdminOverviewData();

  return (
    <DashboardShell
      title="Admin overview"
      description="Track business activity, recent operational changes, and the most important signals across users, bookings, content, and payments."
      admin
      role="ADMIN"
    >
      <AdminMetricGrid
        items={[
          { label: "Total users", value: String(overview.totalUsers) },
          { label: "Total bookings", value: String(overview.totalBookings) },
          { label: "Revenue", value: formatCurrency(overview.revenuePence) },
          { label: "Pending reviews", value: String(overview.pendingReviews) },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AdminSectionCard title="Upcoming sessions" description="The next scheduled sessions across the platform.">
            {overview.upcomingSessions.length ? (
              <div className="space-y-4">
                {overview.upcomingSessions.map((booking) => (
                  <div key={booking.id} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-slate-950">{booking.service?.title ?? "Booked session"}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {booking.student.name}
                          {booking.consultant ? ` with ${booking.consultant.name}` : ""}
                        </p>
                      </div>
                      <Badge>{booking.status}</Badge>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">{formatDateTime(booking.startsAt, booking.timezone)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <DashboardEmptyState
                title="No upcoming sessions yet"
                description="New bookings will appear here once students start booking live sessions."
              />
            )}
          </AdminSectionCard>
        </div>

        <AdminSectionCard title="Recent payments" description="Latest recorded payment activity in the system.">
          {overview.recentPayments.length ? (
            <div className="space-y-4">
              {overview.recentPayments.map((payment) => (
                <div key={payment.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-950">{payment.user?.name ?? "Unknown user"}</p>
                    <Badge>{payment.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {payment.booking?.service?.title ?? "General payment"} - {formatCurrency(payment.amountPence)}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">{formatDateTime(payment.createdAt)}</p>
                </div>
              ))}
            </div>
          ) : (
            <DashboardEmptyState
              title="No payments recorded"
              description="Stripe is not live yet, so payments will appear here once checkout starts writing records."
            />
          )}
        </AdminSectionCard>
      </div>

      <AdminSectionCard title="Recent inquiries" description="Newest contact and lead submissions from the website.">
        {overview.recentInquiries.length ? (
          <div className="space-y-4">
            {overview.recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-950">{inquiry.subject}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {inquiry.name} - {inquiry.email}
                    </p>
                  </div>
                  <Badge>{inquiry.status}</Badge>
                </div>
                <p className="mt-3 text-sm text-slate-600">{inquiry.message}</p>
                <p className="mt-2 text-sm text-slate-500">{formatDateTime(inquiry.createdAt)}</p>
              </div>
            ))}
          </div>
        ) : (
          <DashboardEmptyState
            title="No inquiries yet"
            description="General inquiries, review requests, and consultation leads will show up here."
          />
        )}
      </AdminSectionCard>
    </DashboardShell>
  );
}
