import { Card } from "@/components/ui/card";

export function DashboardEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="border-dashed p-5 sm:p-6">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
    </Card>
  );
}
