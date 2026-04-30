import { Card } from "@/components/ui/card";

export function AdminSectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-4 border-b border-slate-100 pb-3">
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        {description ? <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      {children}
    </Card>
  );
}
