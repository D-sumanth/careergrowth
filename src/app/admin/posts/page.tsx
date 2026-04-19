import { PostsManager } from "@/components/admin/posts-manager";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireSession } from "@/lib/auth/session";
import { getManagedPosts } from "@/lib/content";

export default async function AdminPostsPage() {
  await requireSession(["ADMIN"]);
  const items = await getManagedPosts();

  return (
    <DashboardShell
      title="Posts management"
      description="Create, edit, publish, and unpublish resources so the public site updates without a redeploy."
      admin
      role="ADMIN"
    >
      <PostsManager items={items} />
    </DashboardShell>
  );
}
