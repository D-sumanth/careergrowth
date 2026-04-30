import { AdminMetricGrid } from "@/components/admin/admin-metric-grid";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { requireSession } from "@/lib/auth/session";
import { getAdminAnalyticsData } from "@/lib/admin";
import { formatCurrency } from "@/lib/utils";

export default async function AdminAnalyticsPage() {
  await requireSession(["ADMIN"]);
  const data = await getAdminAnalyticsData();
  const maxSourceCount = Math.max(...data.sourceBreakdown.map((item) => item.count), 1);
  const maxMonthlyValue = Math.max(...data.monthlyFunnel.flatMap((item) => [item.inquiries, item.signUps, item.bookings]), 1);
  const maxServiceBookings = Math.max(...data.servicePerformance.map((item) => item.bookings), 1);
  const maxWorkshopRegistrations = Math.max(...data.workshopPerformance.map((item) => item.registrations), 1);

  return (
    <DashboardShell
      title="Analytics"
      description="See where users are coming from and how they move from inquiry to sign-up to booking."
      admin
      role="ADMIN"
    >
      <AdminMetricGrid
        items={[
          { label: "Tracked inquiries", value: String(data.totalInquiries) },
          { label: "Tracked sign-ups", value: String(data.totalUsers) },
          { label: "Newsletter sign-ups", value: String(data.totalSubscribers) },
          { label: "Paid bookings", value: String(data.paidBookings) },
        ]}
      />

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminSectionCard title="Top acquisition sources" description="Combined source view from sign-ups and inquiries.">
          {data.sourceBreakdown.length ? (
            <div className="space-y-4">
              {data.sourceBreakdown.map((item) => (
                <div key={item.source} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium capitalize text-slate-950">{item.source}</p>
                    <span className="text-sm text-slate-500">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-slate-950"
                      style={{ width: `${Math.max((item.count / maxSourceCount) * 100, 12)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <DashboardEmptyState
              title="No traffic data yet"
              description="As people arrive through Google, LinkedIn, referrals, and direct visits, their sources will appear here."
            />
          )}
        </AdminSectionCard>

        <AdminSectionCard title="Monthly funnel" description="A simple month-by-month view of inquiries, sign-ups, and bookings.">
          {data.monthlyFunnel.length ? (
            <div className="space-y-4">
              {data.monthlyFunnel.map((item) => (
                <div key={item.label} className="rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-950">{item.label}</p>
                    <p className="text-xs text-slate-500">Inquiry {"->"} Sign-up {"->"} Booking</p>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    {[
                      { label: "Inquiries", value: item.inquiries, tone: "bg-slate-950" },
                      { label: "Sign-ups", value: item.signUps, tone: "bg-amber-500" },
                      { label: "Bookings", value: item.bookings, tone: "bg-emerald-500" },
                    ].map((metric) => (
                      <div key={metric.label} className="space-y-2">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-slate-600">{metric.label}</span>
                          <span className="font-semibold text-slate-950">{metric.value}</span>
                        </div>
                        <div className="h-2 rounded-full bg-white">
                          <div
                            className={`h-2 rounded-full ${metric.tone}`}
                            style={{ width: `${Math.max((metric.value / maxMonthlyValue) * 100, metric.value ? 10 : 0)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <DashboardEmptyState
              title="No funnel activity yet"
              description="Once real leads and bookings start moving through the site, the funnel will show the flow over time."
            />
          )}
        </AdminSectionCard>
      </div>

      <AdminSectionCard title="Newsletter sources" description="Where newsletter subscribers are coming from.">
        {data.subscriberSources.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {data.subscriberSources.map((item) => (
              <div key={item.source} className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-medium capitalize text-slate-950">{item.source}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{item.count}</p>
              </div>
            ))}
          </div>
        ) : (
          <DashboardEmptyState
            title="No newsletter attribution yet"
            description="Subscriber source breakdown will appear here once people start joining the email list."
          />
        )}
      </AdminSectionCard>

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminSectionCard title="Service performance" description="Which services are attracting bookings, and how many of them convert into paid sessions.">
          {data.servicePerformance.length ? (
            <div className="space-y-4">
              {data.servicePerformance.map((service) => (
                <div key={service.id} className="rounded-lg bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-950">{service.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{formatCurrency(service.pricePence)}</p>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      <p>{service.bookings} bookings</p>
                      <p>{service.paidBookings} paid</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-2 rounded-full bg-white">
                      <div
                        className="h-2 rounded-full bg-slate-950"
                        style={{ width: `${Math.max((service.bookings / maxServiceBookings) * 100, service.bookings ? 10 : 0)}%` }}
                      />
                    </div>
                    <div className="h-2 rounded-full bg-white">
                      <div
                        className="h-2 rounded-full bg-emerald-500"
                        style={{ width: `${Math.max((service.paidBookings / maxServiceBookings) * 100, service.paidBookings ? 10 : 0)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <DashboardEmptyState
              title="No service performance yet"
              description="As bookings come in, you’ll see which services are driving the strongest conversion here."
            />
          )}
        </AdminSectionCard>

        <AdminSectionCard title="Workshop performance" description="Track registrations, paid seats, and waitlist pressure across workshop offers.">
          {data.workshopPerformance.length ? (
            <div className="space-y-4">
              {data.workshopPerformance.map((workshop) => (
                <div key={workshop.id} className="rounded-lg bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-950">{workshop.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{formatCurrency(workshop.pricePence)}</p>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      <p>{workshop.registrations} registrations</p>
                      <p>{workshop.paidRegistrations} paid</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-2 rounded-full bg-white">
                      <div
                        className="h-2 rounded-full bg-slate-950"
                        style={{ width: `${Math.max((workshop.registrations / maxWorkshopRegistrations) * 100, workshop.registrations ? 10 : 0)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{workshop.waitlisted} waitlisted</span>
                      <span>{workshop.paidRegistrations} paid seats</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <DashboardEmptyState
              title="No workshop performance yet"
              description="Once workshops start collecting registrations, you’ll be able to compare uptake and waitlist demand here."
            />
          )}
        </AdminSectionCard>
      </div>
    </DashboardShell>
  );
}
