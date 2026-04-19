import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { blogPosts } from "@/lib/data/site-content";
import { formatDate } from "@/lib/utils";

export default function ResourcesPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl space-y-8 px-5 py-16 sm:px-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Resources</p>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Practical guidance for international students navigating the UK job market.</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{post.topic}</p>
              <h2 className="mt-3 font-serif text-3xl text-slate-950">{post.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
              <p className="mt-4 text-sm text-slate-500">{formatDate(post.publishedAt)}</p>
              <a href={`/resources/${post.slug}`} className="mt-4 inline-block text-sm font-semibold text-slate-950">
                Read article
              </a>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
