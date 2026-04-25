import { Card } from "@/components/ui/card";

export function AdminMetricGrid({
  items,
}: {
  items: Array<{ label: string; value: string; hint?: string }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="p-5">
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-2 font-serif text-3xl text-slate-950">{item.value}</p>
          {item.hint ? <p className="mt-2 text-sm leading-6 text-slate-500">{item.hint}</p> : null}
        </Card>
      ))}
    </div>
  );
}
