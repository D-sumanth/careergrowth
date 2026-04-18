import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { blogPosts } from "@/lib/data/site-content";
import { formatDate } from "@/lib/utils";

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((entry) => entry.slug === slug);
  if (!post) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl space-y-6 px-5 py-16 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{post.topic}</p>
        <h1 className="font-serif text-5xl font-semibold tracking-tight text-slate-950">{post.title}</h1>
        <p className="text-sm text-slate-500">{formatDate(post.publishedAt)}</p>
        <article className="text-base leading-8 text-slate-700">{post.content}</article>
      </main>
      <SiteFooter />
    </>
  );
}
