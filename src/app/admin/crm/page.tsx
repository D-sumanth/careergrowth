import { AdminMetricGrid } from "@/components/admin/admin-metric-grid";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { Badge } from "@/components/ui/badge";
import { requireSession } from "@/lib/auth/session";
import { getAdminCrmData } from "@/lib/admin";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";

export default async function AdminCrmPage() {
  await requireSession(["ADMIN"]);
  const data = await getAdminCrmData();

  return (
    <DashboardShell
      title="CRM"
      description="Track where leads came from, what needs a follow-up, and how new users are entering the platform."
      admin
      role="ADMIN"
    >
      <AdminMetricGrid
        items={[
          { label: "Open inquiries", value: String(data.openInquiries) },
          { label: "Due follow-ups", value: String(data.dueFollowUps) },
          { label: "Recent leads", value: String(data.recentInquiries.length) },
          { label: "Recent sign-ups", value: String(data.recentUsers.length) },
        ]}
      />

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminSectionCard title="Recent leads" description="Newest inquiries with source attribution and follow-up context.">
          {data.recentInquiries.length ? (
            <div className="space-y-4">
              {data.recentInquiries.slice(0, 8).map((item) => (
                <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-slate-950">{item.subject}</p>
                    <Badge>{item.status}</Badge>
                    <Badge className="bg-white text-slate-700">{item.source ?? "unknown source"}</Badge>
                    {item.category ? <Badge className="bg-white text-slate-700">{item.category.replaceAll("_", " ")}</Badge> : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {item.name} - {item.email}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.message}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                    <span>{formatDateTime(item.createdAt)}</span>
                    {item.assignedTo ? <span>Owner: {item.assignedTo}</span> : null}
                    {item.followUpAt ? <span>Follow-up: {formatDateTime(item.followUpAt)}</span> : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <DashboardEmptyState
              title="No leads yet"
              description="When contact form inquiries start coming in, they will appear here with their source and follow-up status."
            />
          )}
        </AdminSectionCard>

        <div className="space-y-5">
          <AdminSectionCard title="CRM actions" description="Jump into the main admin areas used for lead follow-up and relationship management.">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Open inquiry queue", href: "/admin/inquiries" },
                { label: "Browse user profiles", href: "/admin/users" },
                { label: "Review attribution", href: "/admin/analytics" },
                { label: "Check bookings", href: "/admin/bookings" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </AdminSectionCard>

          <AdminSectionCard title="Top lead sources" description="First-touch channels from recent sign-ups and inquiries.">
            {data.sourceBreakdown.length ? (
              <div className="space-y-3">
                {data.sourceBreakdown.map((item) => (
                  <div key={item.source} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium capitalize text-slate-950">{item.source}</p>
                      <span className="text-sm font-semibold text-slate-700">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <DashboardEmptyState
                title="No source data yet"
                description="Once sign-ups and inquiries come through tracked links or referrals, source insights will show here."
              />
            )}
          </AdminSectionCard>

          <AdminSectionCard title="Recent sign-ups" description="New users with acquisition context.">
            {data.recentUsers.length ? (
              <div className="space-y-3">
                {data.recentUsers.slice(0, 8).map((user) => (
                  <div key={user.id} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-950">{user.name}</p>
                        <p className="mt-1 text-sm text-slate-600">{user.email}</p>
                      </div>
                      <Badge>{user.role}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-white px-3 py-1">{user.acquisitionSource ?? "unknown source"}</span>
                      {user.acquisitionMedium ? <span className="rounded-full bg-white px-3 py-1">{user.acquisitionMedium}</span> : null}
                      {user.acquisitionCampaign ? <span className="rounded-full bg-white px-3 py-1">Campaign: {user.acquisitionCampaign}</span> : null}
                    </div>
                    <div className="mt-3">
                      <Link href={`/admin/users/${user.id}`} className="text-sm font-semibold text-slate-950 underline underline-offset-4">
                        Open CRM profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <DashboardEmptyState
                title="No recent sign-ups"
                description="New user registrations will appear here with acquisition source and campaign information."
              />
            )}
          </AdminSectionCard>
        </div>
      </div>
    </DashboardShell>
  );
}
