import { ArrowRight, CalendarDays, FileText, GraduationCap, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeadForm } from "@/components/forms/lead-form";
import { blogPosts, faqs, services, siteConfig, testimonials, workshops } from "@/lib/data/site-content";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function Home() {
  const featuredServices = services.slice(0, 4);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-8">
              <Badge className="bg-amber-100 text-amber-900">{siteConfig.heroBadge}</Badge>
              <div className="space-y-6">
                <h1 className="max-w-4xl font-serif text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  {siteConfig.heroTitle}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  {siteConfig.heroDescription}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/services">Book a Session</ButtonLink>
                <ButtonLink href="/contact" variant="secondary">
                  Ask a Question
                </ButtonLink>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["100+ sessions", "Built around practical support for CVs, interviews, and career strategy"],
                  ["International-student focus", "Guidance shaped by the real pressure of sponsorship, rejections, and UK hiring cycles"],
                  ["Strategy before noise", "Advice designed to replace confusion with direction and confidence"],
                ].map(([title, copy]) => (
                  <Card key={title} className="p-5">
                    <p className="font-semibold text-slate-950">{title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{copy}</p>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="overflow-hidden border-0 bg-slate-950 p-5 text-white shadow-xl shadow-amber-100 sm:p-6">
              <div className="rounded-[2rem] bg-gradient-to-br from-amber-200 via-orange-100 to-white p-1">
                <div className="rounded-[1.8rem] bg-slate-950 p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-amber-200">Consultant spotlight</p>
                  <h2 className="mt-3 font-serif text-3xl">{siteConfig.consultantName}</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {siteConfig.credibility}
                  </p>
                  <div className="mt-6 grid gap-3">
                    {[
                      { icon: GraduationCap, label: "UK job-search guidance for international students" },
                      { icon: FileText, label: "CV positioning, application strategy, and profile support" },
                      { icon: CalendarDays, label: "Interview preparation, workshops, and structured support" },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                        <Icon className="h-4 w-4 text-amber-200" />
                        <span className="text-sm">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <SectionHeading
            eyebrow="Services"
            title="Support that meets students where they are"
            description="The public profile and posts consistently centre on practical guidance for CVs, interviews, strategy, sponsorship awareness, and navigating the UK job market with more confidence."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featuredServices.map((service) => (
              <Card key={service.slug} className={`bg-gradient-to-br ${service.accent} p-6`}>
                <h3 className="font-serif text-2xl text-slate-950">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{service.description}</p>
                <p className="mt-4 text-sm font-semibold text-slate-900">{service.duration}</p>
                <p className="mt-1 text-sm text-slate-700">{formatCurrency(service.pricePence)}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <SectionHeading
            eyebrow="How it works"
            title="A calmer, clearer booking flow"
            description="The experience is designed to reduce confusion. Students should be able to understand the offer quickly, book support with minimal friction, and leave with clearer next steps."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["Choose the right support", "Find the session, review, workshop, or structured support option that fits your stage of the UK job search."],
              ["Book with clarity", "Reserve support without guessing what is included, when it happens, or who it is for."],
              ["Receive practical guidance", "Walk away with clearer strategy on CVs, interviews, applications, or sponsorship-aware job-search decisions."],
            ].map(([title, copy], index) => (
              <Card key={title} className="p-6">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-900">{index + 1}</div>
                <h3 className="font-semibold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{copy}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-6">
              <SectionHeading
                eyebrow="Success stories"
                title="Students trust practical guidance that respects their reality"
                description="The public LinkedIn presence is strongest when it is honest, practical, and grounded in the real struggles of international students. The site now mirrors that tone."
              />
              <div className="grid gap-4">
                {testimonials.map((item) => (
                  <Card key={item.name} className="p-6">
                    <div className="flex items-center gap-2 text-amber-600">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Sparkles key={index} className="h-4 w-4" />
                      ))}
                    </div>
                    <p className="mt-4 text-base leading-8 text-slate-700">&ldquo;{item.quote}&rdquo;</p>
                    <p className="mt-4 font-semibold text-slate-950">{item.name}</p>
                    <p className="text-sm text-slate-500">
                      {item.role}, {item.university}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Card className="bg-slate-950 p-6 text-white sm:p-8">
                <h3 className="font-serif text-3xl">Upcoming workshops</h3>
                <div className="mt-6 space-y-4">
                  {workshops.slice(0, 2).map((workshop) => (
                    <div key={workshop.slug} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm uppercase tracking-[0.16em] text-amber-200">{workshop.status}</p>
                      <p className="mt-2 font-semibold">{workshop.title}</p>
                      <p className="mt-2 text-sm text-slate-300">{formatDateTime(workshop.startsAt)}</p>
                      <p className="mt-1 text-sm text-slate-300">{formatCurrency(workshop.pricePence)}</p>
                    </div>
                  ))}
                </div>
                <ButtonLink href="/workshops" variant="secondary" className="mt-6">
                  Join Workshop
                </ButtonLink>
              </Card>

              <Card className="p-6 sm:p-8">
                <h3 className="font-serif text-3xl text-slate-950">Resume review and coaching</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Need help after repeated rejections, confusing sponsorship questions, or an upcoming interview? The site now frames that support more directly and more honestly.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink href="/services">Book a Session</ButtonLink>
                  <ButtonLink href="/contact" variant="secondary">
                    Ask a Question
                  </ButtonLink>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <SectionHeading
            eyebrow="Resources"
            title="Practical guidance students can use between sessions"
            description="The resource topics now reflect the kind of public content Aditi shares: common job-search mistakes, sponsorship-aware decisions, and practical UK job-search resources."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {blogPosts.map((post) => (
              <Card key={post.slug} className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{post.topic}</p>
                <h3 className="mt-3 font-serif text-2xl text-slate-950">{post.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
                <a href={`/resources/${post.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                  Read article <ArrowRight className="h-4 w-4" />
                </a>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <SectionHeading
                eyebrow="FAQ"
                title="Questions students commonly ask before booking"
                description="These FAQs are aligned more closely with the issues that come through in Aditi's public posts: confusion, rejections, timing, and sponsorship-aware decision-making."
              />
              <div className="mt-8 space-y-4">
                {faqs.map((faq) => (
                  <Card key={faq.question} className="p-6">
                    <h3 className="font-semibold text-slate-950">{faq.question}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <SectionHeading
                eyebrow="Newsletter"
                title="Stay close to useful advice"
                description="Collect email plus consent, store subscriber status in the database, and plug in your preferred email provider later."
              />
              <div className="mt-8">
                <LeadForm
                  endpoint="/api/newsletter"
                  submitLabel="Join the newsletter"
                  fields={[
                    { name: "email", label: "Email address", type: "email", required: true, placeholder: "you@example.com" },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
