import type { ComponentProps } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
        variant === "primary" && "bg-slate-950 text-white shadow-sm shadow-slate-950/10 hover:bg-slate-800 focus-visible:ring-slate-950",
        variant === "secondary" && "border border-slate-200 bg-white text-slate-900 shadow-sm hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-300",
        variant === "ghost" && "text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-slate-300",
        className,
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-10 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition",
        variant === "primary" && "bg-slate-950 text-white shadow-sm shadow-slate-950/10 hover:bg-slate-800",
        variant === "secondary" && "border border-slate-200 bg-white text-slate-900 shadow-sm hover:border-slate-300 hover:bg-slate-50",
        variant === "ghost" && "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
        className,
      )}
    >
      {children}
    </Link>
  );
}
