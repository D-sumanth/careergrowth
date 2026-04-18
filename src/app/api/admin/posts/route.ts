import { jsonOk } from "@/lib/http";
import { blogPosts } from "@/lib/data/site-content";

export async function GET() {
  return jsonOk({ items: blogPosts });
}
