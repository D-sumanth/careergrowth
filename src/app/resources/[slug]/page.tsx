import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublicPostBySlug } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl space-y-6 px-5 py-16 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{post.topic}</p>
        <h1 className="font-serif text-5xl font-semibold tracking-tight text-slate-950">{post.title}</h1>
        <p className="text-sm text-slate-500">{formatDate(post.publishedAt ?? post.createdAt)}</p>
        <article className="whitespace-pre-wrap text-base leading-8 text-slate-700">{post.content}</article>
      </main>
      <SiteFooter />
    </>
  );
}
