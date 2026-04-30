import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex rounded-md bg-white/85 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600", className)}>
      {children}
    </span>
  );
}
