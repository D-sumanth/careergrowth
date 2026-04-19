import { Card } from "@/components/ui/card";

export function AdminMetricGrid({
  items,
}: {
  items: Array<{ label: string; value: string; hint?: string }>;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="p-6">
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-2 font-serif text-4xl text-slate-950">{item.value}</p>
          {item.hint ? <p className="mt-3 text-sm text-slate-500">{item.hint}</p> : null}
        </Card>
      ))}
    </div>
  );
}
