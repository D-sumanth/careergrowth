import { clearSessionCookie } from "@/lib/auth/session";
import { jsonOk } from "@/lib/http";

export async function POST() {
  await clearSessionCookie();
  return jsonOk({ message: "Signed out." });
}
