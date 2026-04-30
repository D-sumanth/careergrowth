import Link from "next/link";
import { AdminMetricGrid } from "@/components/admin/admin-metric-grid";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { Badge } from "@/components/ui/badge";
import { requireSession } from "@/lib/auth/session";
import { getAdminUsersData, getRoleLabel } from "@/lib/admin";
import { formatDateTime } from "@/lib/utils";

export default async function AdminUsersPage() {
  await requireSession(["ADMIN"]);
  const data = await getAdminUsersData();

  return (
    <DashboardShell title="Users" description="Monitor accounts, roles, profile completeness, and recent user creation." admin role="ADMIN">
      <AdminMetricGrid
        items={[
          { label: "Visible users", value: String(data.totalUsers) },
          { label: "Tracked sources", value: String(data.sourceBreakdown.length) },
        ]}
      />
      <AdminSectionCard title="Acquisition sources" description="Where recent sign-ups are coming from.">
        {data.sourceBreakdown.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {data.sourceBreakdown.map((item) => (
              <div key={item.source} className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-medium capitalize text-slate-950">{item.source}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{item.count}</p>
              </div>
            ))}
          </div>
        ) : (
          <DashboardEmptyState title="No source data yet" description="Once users start signing up through different channels, their sources will show here." />
        )}
      </AdminSectionCard>
      <AdminSectionCard title="User directory" description="Latest users in the database with their current activity footprint.">
        {data.users.length ? (
          <div className="space-y-4">
            {data.users.map((user) => (
              <div key={user.id} className="rounded-lg bg-slate-50 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-950">{user.name}</p>
                      <Badge>{getRoleLabel(user.role)}</Badge>
                      <Badge className={user.isActive ? "text-emerald-700" : "text-rose-700"}>{user.isActive ? "Active" : "Inactive"}</Badge>
                      {user.acquisitionSource ? <Badge className="bg-white text-slate-700">{user.acquisitionSource}</Badge> : null}
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{user.email}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      Joined {formatDateTime(user.createdAt)} - {user._count.bookings} bookings - {user._count.uploadedDocuments} documents - {user._count.payments} payments
                    </p>
                  </div>
                  <div className="text-sm text-slate-600 lg:text-right">
                    <p>{user.profile?.university ?? "No university saved"}</p>
                    <p>{user.profile?.careerTarget ?? "No career target saved"}</p>
                    <div className="mt-3">
                      <Link href={`/admin/users/${user.id}`} className="text-sm font-semibold text-slate-950 underline underline-offset-4">
                        View CRM profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DashboardEmptyState title="No users found" description="User accounts will appear here once registration is active against the current database." />
        )}
      </AdminSectionCard>
    </DashboardShell>
  );
}
