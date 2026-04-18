import { Card } from "@/components/ui/card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireSession } from "@/lib/auth/session";

export default async function DashboardDocumentsPage() {
  await requireSession(["STUDENT", "CONSULTANT", "ADMIN"]);

  return (
    <DashboardShell title="Documents">
      <Card className="p-6">
        <p className="text-sm leading-7 text-slate-600">Uploaded CVs, cover letters, reviewed files, and private document metadata can be managed here through the secure upload flow.</p>
      </Card>
    </DashboardShell>
  );
}
