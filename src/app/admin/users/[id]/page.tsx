import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminMetricGrid } from "@/components/admin/admin-metric-grid";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { Badge } from "@/components/ui/badge";
import { requireSession } from "@/lib/auth/session";
import { getAdminUserDetail, getRoleLabel } from "@/lib/admin";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSession(["ADMIN"]);
  const { id } = await params;
  const data = await getAdminUserDetail(id);

  if (!data) {
    notFound();
  }

  const { user, timeline } = data;

  return (
    <DashboardShell
      title={user.name}
      description="A CRM-style profile view of one user, including acquisition details, history, bookings, payments, and uploaded documents."
      admin
      role="ADMIN"
    >
      <AdminMetricGrid
        items={[
          { label: "Bookings", value: String(user._count.bookings) },
          { label: "Payments", value: String(user._count.payments) },
          { label: "Inquiries", value: String(user._count.inquiries) },
          { label: "Documents", value: String(user._count.uploadedDocuments) },
        ]}
      />

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <AdminSectionCard title="Profile summary" description="Core account and acquisition details.">
            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{getRoleLabel(user.role)}</Badge>
                <Badge className={user.isActive ? "text-emerald-700" : "text-rose-700"}>{user.isActive ? "Active" : "Inactive"}</Badge>
                {user.acquisitionSource ? <Badge className="bg-white text-slate-700">{user.acquisitionSource}</Badge> : null}
                {user.acquisitionMedium ? <Badge className="bg-white text-slate-700">{user.acquisitionMedium}</Badge> : null}
              </div>
              <div>
                <p className="font-medium text-slate-950">Email</p>
                <p className="mt-1">{user.email}</p>
              </div>
              <div>
                <p className="font-medium text-slate-950">Joined</p>
                <p className="mt-1">{formatDateTime(user.createdAt)}</p>
              </div>
              <div>
                <p className="font-medium text-slate-950">Campaign</p>
                <p className="mt-1">{user.acquisitionCampaign ?? "No campaign captured"}</p>
              </div>
              <div>
                <p className="font-medium text-slate-950">Referrer</p>
                <p className="mt-1 break-all">{user.acquisitionReferrer ?? "No referrer captured"}</p>
              </div>
            </div>
          </AdminSectionCard>

          <AdminSectionCard title="Career profile" description="Information the user has saved in their dashboard profile.">
            <div className="space-y-3 text-sm text-slate-700">
              <p><span className="font-medium text-slate-950">University:</span> {user.profile?.university ?? "Not provided"}</p>
              <p><span className="font-medium text-slate-950">Degree:</span> {user.profile?.degree ?? "Not provided"}</p>
              <p><span className="font-medium text-slate-950">Career target:</span> {user.profile?.careerTarget ?? "Not provided"}</p>
              <p><span className="font-medium text-slate-950">Visa status:</span> {user.profile?.visaStatus ?? "Not provided"}</p>
              <p><span className="font-medium text-slate-950">Timezone:</span> {user.profile?.timezone ?? "Europe/London"}</p>
            </div>
          </AdminSectionCard>
        </div>

        <AdminSectionCard title="Activity timeline" description="Latest user interactions across inquiries, bookings, payments, reviews, and documents.">
          {timeline.length ? (
            <div className="space-y-4">
              {timeline.slice(0, 20).map((entry) => (
                <div key={entry.id} className="rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-950">{entry.label}</p>
                    <Badge>{entry.type}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{entry.detail}</p>
                  <p className="mt-2 text-xs text-slate-500">{formatDateTime(entry.createdAt)}</p>
                </div>
              ))}
            </div>
          ) : (
            <DashboardEmptyState title="No activity yet" description="This user has not generated any bookings, inquiries, review requests, or uploaded documents yet." />
          )}
        </AdminSectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <AdminSectionCard title="Recent bookings" description="Latest session activity for this user.">
          {user.bookings.length ? (
            <div className="space-y-3">
              {user.bookings.map((booking) => (
                <div key={booking.id} className="rounded-lg bg-slate-50 p-4">
                  <p className="font-medium text-slate-950">{booking.service?.title ?? "Session booking"}</p>
                  <p className="mt-1 text-sm text-slate-600">{booking.status} - {booking.paymentStatus}</p>
                  <p className="mt-2 text-xs text-slate-500">{formatDateTime(booking.startsAt, booking.timezone)}</p>
                </div>
              ))}
            </div>
          ) : (
            <DashboardEmptyState title="No bookings" description="Bookings will appear here once this user schedules support." />
          )}
        </AdminSectionCard>

        <AdminSectionCard title="Recent payments" description="Most recent payment records tied to this user.">
          {user.payments.length ? (
            <div className="space-y-3">
              {user.payments.map((payment) => (
                <div key={payment.id} className="rounded-lg bg-slate-50 p-4">
                  <p className="font-medium text-slate-950">{payment.booking?.service?.title ?? "Payment"}</p>
                  <p className="mt-1 text-sm text-slate-600">{payment.status} - {formatCurrency(payment.amountPence)}</p>
                  <p className="mt-2 text-xs text-slate-500">{formatDateTime(payment.createdAt)}</p>
                </div>
              ))}
            </div>
          ) : (
            <DashboardEmptyState title="No payments" description="Payment records will appear here once this user completes checkout." />
          )}
        </AdminSectionCard>

        <AdminSectionCard title="Recent inquiries & reviews" description="Recent support requests from this user.">
          {user.inquiries.length || user.reviewRequests.length ? (
            <div className="space-y-3">
              {user.inquiries.map((inquiry) => (
                <div key={inquiry.id} className="rounded-lg bg-slate-50 p-4">
                  <p className="font-medium text-slate-950">{inquiry.subject}</p>
                  <p className="mt-1 text-sm text-slate-600">{inquiry.status}</p>
                  <p className="mt-2 text-xs text-slate-500">{formatDateTime(inquiry.createdAt)}</p>
                </div>
              ))}
              {user.reviewRequests.map((review) => (
                <div key={review.id} className="rounded-lg bg-slate-50 p-4">
                  <p className="font-medium text-slate-950">{review.jobTarget}</p>
                  <p className="mt-1 text-sm text-slate-600">{review.status} - {review.documents.length} documents</p>
                  <p className="mt-2 text-xs text-slate-500">{formatDateTime(review.createdAt)}</p>
                </div>
              ))}
            </div>
          ) : (
            <DashboardEmptyState title="No support requests" description="Inquiries and review requests will appear here if this user reaches out or submits documents." />
          )}
        </AdminSectionCard>
      </div>

      <div>
        <Link href="/admin/users" className="text-sm font-semibold text-slate-950 underline underline-offset-4">
          Back to users
        </Link>
      </div>
    </DashboardShell>
  );
}

