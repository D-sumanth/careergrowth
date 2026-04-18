import { jsonOk } from "@/lib/http";
import { faqs } from "@/lib/data/site-content";

export async function GET() {
  return jsonOk({ items: faqs });
}
