import { AuthFlowError } from "@/lib/auth/errors";

export function assertAllowedAuthOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return;

  const requestOrigin = new URL(request.url).origin;
  if (origin !== requestOrigin) {
    throw new AuthFlowError("UNEXPECTED_ERROR", 403);
  }
}
