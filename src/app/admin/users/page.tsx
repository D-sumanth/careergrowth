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
      <AdminMetricGrid items={[{ label: "Visible users", value: String(data.totalUsers) }]} />
      <AdminSectionCard title="User directory" description="Latest users in the database with their current activity footprint.">
        {data.users.length ? (
          <div className="space-y-4">
            {data.users.map((user) => (
              <div key={user.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-950">{user.name}</p>
                      <Badge>{getRoleLabel(user.role)}</Badge>
                      <Badge className={user.isActive ? "text-emerald-700" : "text-rose-700"}>{user.isActive ? "Active" : "Inactive"}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{user.email}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      Joined {formatDateTime(user.createdAt)} - {user._count.bookings} bookings - {user._count.uploadedDocuments} documents
                    </p>
                  </div>
                  <div className="text-sm text-slate-600">
                    <p>{user.profile?.university ?? "No university saved"}</p>
                    <p>{user.profile?.careerTarget ?? "No career target saved"}</p>
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
