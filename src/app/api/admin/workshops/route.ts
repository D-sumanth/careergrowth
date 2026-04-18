import { jsonOk } from "@/lib/http";
import { workshops } from "@/lib/data/site-content";

export async function GET() {
  return jsonOk({ items: workshops });
}
