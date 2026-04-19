import { AdminMetricGrid } from "@/components/admin/admin-metric-grid";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { Badge } from "@/components/ui/badge";
import { requireSession } from "@/lib/auth/session";
import { getAdminContentData } from "@/lib/admin";
import { formatDateTime } from "@/lib/utils";

export default async function AdminContentPage() {
  await requireSession(["ADMIN"]);
  const data = await getAdminContentData();

  return (
    <DashboardShell title="Content" description="Review blog posts, FAQs, testimonials, and saved site settings from the current database." admin role="ADMIN">
      <AdminMetricGrid
        items={[
          { label: "Posts", value: String(data.posts.length) },
          { label: "FAQs", value: String(data.faqs.length) },
          { label: "Testimonials", value: String(data.testimonials.length) },
          { label: "Site settings", value: String(data.siteSettings.length) },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <AdminSectionCard title="Recent posts">
          {data.posts.length ? (
            <div className="space-y-4">
              {data.posts.map((post) => (
                <div key={post.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-slate-950">{post.title}</p>
                    <Badge>{post.published ? "Published" : "Draft"}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
                  <p className="mt-2 text-sm text-slate-500">{formatDateTime(post.updatedAt)}</p>
                </div>
              ))}
            </div>
          ) : (
            <DashboardEmptyState title="No posts yet" description="Blog and resources content will show here when it exists in the database." />
          )}
        </AdminSectionCard>

        <AdminSectionCard title="FAQs and testimonials">
          {data.faqs.length || data.testimonials.length ? (
            <div className="space-y-4">
              {data.faqs.slice(0, 5).map((faq) => (
                <div key={faq.id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-950">{faq.question}</p>
                  <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
                </div>
              ))}
              {data.testimonials.slice(0, 5).map((testimonial) => (
                <div key={testimonial.id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-950">{testimonial.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{testimonial.headline}</p>
                </div>
              ))}
            </div>
          ) : (
            <DashboardEmptyState title="No content records yet" description="FAQs, testimonials, and settings records will appear here once populated." />
          )}
        </AdminSectionCard>
      </div>
    </DashboardShell>
  );
}
