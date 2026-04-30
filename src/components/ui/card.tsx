import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200/90 bg-white shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
