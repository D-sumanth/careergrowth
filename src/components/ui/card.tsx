import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("rounded-[1.5rem] border border-slate-200/90 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]", className)}>{children}</div>;
}
