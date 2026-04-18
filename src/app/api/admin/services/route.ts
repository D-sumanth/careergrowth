import { jsonOk } from "@/lib/http";
import { services } from "@/lib/data/site-content";

export async function GET() {
  return jsonOk({ items: services });
}
