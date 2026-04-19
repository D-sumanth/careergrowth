import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireSession } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireSession(["STUDENT", "CONSULTANT", "ADMIN"]);
  const firstName = session.name.split(" ")[0];

  return (
    <DashboardShell
      title={`Welcome back, ${firstName}`}
      description="This is your home for bookings, uploaded CVs, review progress, and account details."
    >
      {children}
    </DashboardShell>
  );
}
