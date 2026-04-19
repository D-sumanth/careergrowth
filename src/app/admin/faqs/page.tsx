import { FaqsManager } from "@/components/admin/faqs-manager";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireSession } from "@/lib/auth/session";
import { getManagedFaqs } from "@/lib/content";

export default async function AdminFaqsPage() {
  await requireSession(["ADMIN"]);
  const items = await getManagedFaqs();

  return (
    <DashboardShell
      title="FAQ management"
      description="Maintain the public FAQ section directly from the admin dashboard."
      admin
      role="ADMIN"
    >
      <FaqsManager items={items} />
    </DashboardShell>
  );
}
