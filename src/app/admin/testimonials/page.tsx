import { TestimonialsManager } from "@/components/admin/testimonials-manager";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireSession } from "@/lib/auth/session";
import { getManagedTestimonials } from "@/lib/content";

export default async function AdminTestimonialsPage() {
  await requireSession(["ADMIN"]);
  const items = await getManagedTestimonials();

  return (
    <DashboardShell
      title="Testimonials management"
      description="Add, edit, and remove testimonials that appear on the public marketing pages."
      admin
      role="ADMIN"
    >
      <TestimonialsManager items={items} />
    </DashboardShell>
  );
}
