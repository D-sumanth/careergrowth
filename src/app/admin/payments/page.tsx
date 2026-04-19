import { AdminMetricGrid } from "@/components/admin/admin-metric-grid";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { Badge } from "@/components/ui/badge";
import { requireSession } from "@/lib/auth/session";
import { getAdminPaymentsData } from "@/lib/admin";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function AdminPaymentsPage() {
  await requireSession(["ADMIN"]);
  const data = await getAdminPaymentsData();

  return (
    <DashboardShell title="Payments" description="Review recorded payments, refund signals, and the current revenue picture." admin role="ADMIN">
      <AdminMetricGrid
        items={[
          { label: "Visible payments", value: String(data.payments.length) },
          { label: "Revenue", value: formatCurrency(data.revenuePence) },
        ]}
      />
      <AdminSectionCard title="Payment ledger" description="Current payments table from the application database.">
        {data.payments.length ? (
          <div className="space-y-4">
            {data.payments.map((payment) => (
              <div key={payment.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-950">{payment.user?.name ?? "Unknown user"}</p>
                      <Badge>{payment.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {payment.booking?.service?.title ?? "General payment"} - {formatCurrency(payment.amountPence)}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">{formatDateTime(payment.createdAt)}</p>
                  </div>
                  <div className="text-sm text-slate-600">
                    <p>{payment.currency.toUpperCase()}</p>
                    <p>{payment.discountCode ?? "No discount"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DashboardEmptyState title="No payments yet" description="This section will show live payment records once Stripe checkout and webhook sync are fully active." />
        )}
      </AdminSectionCard>
    </DashboardShell>
  );
}
