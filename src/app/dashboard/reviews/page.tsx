import { Card } from "@/components/ui/card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireSession } from "@/lib/auth/session";

export default async function DashboardReviewsPage() {
  await requireSession(["STUDENT", "CONSULTANT", "ADMIN"]);

  return (
    <DashboardShell title="Resume reviews">
      <Card className="p-6">
        <p className="text-sm leading-7 text-slate-600">Students can track review request statuses, turnaround times, reviewer notes, and document delivery updates here.</p>
      </Card>
    </DashboardShell>
  );
}
