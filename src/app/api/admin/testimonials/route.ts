import { jsonOk } from "@/lib/http";
import { testimonials } from "@/lib/data/site-content";

export async function GET() {
  return jsonOk({ items: testimonials });
}
