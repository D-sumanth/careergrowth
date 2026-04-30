export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">{eyebrow}</p>
      <h2 className="font-serif text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.45rem] sm:leading-tight">{title}</h2>
      <p className="text-base leading-7 text-slate-600">{description}</p>
    </div>
  );
}
