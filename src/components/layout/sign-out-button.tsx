"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    await fetch("/api/auth/sign-out", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <Button type="button" variant="ghost" className={className} onClick={handleSignOut} disabled={pending}>
      {pending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
