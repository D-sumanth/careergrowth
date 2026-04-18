import { ArrowRight, CalendarDays, FileText, GraduationCap, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeadForm } from "@/components/forms/lead-form";
import { blogPosts, faqs, services, testimonials, workshops } from "@/lib/data/site-content";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function Home() {
  const featuredServices = services.slice(0, 4);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-8">
              <Badge className="bg-amber-100 text-amber-900">Helping students in the UK build confident careers</Badge>
              <div className="space-y-6">
                <h1 className="max-w-4xl font-serif text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                  Career guidance, CV reviews, interview prep, and workshops that help you stand out.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  Personalised support for international students and graduates navigating the UK job market, improving their profiles, and booking expert help with clarity.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/services">Book a Session</ButtonLink>
                <ButtonLink href="/contact" variant="secondary">
                  Get CV Reviewed
                </ButtonLink>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["1:1 coaching", "Focused sessions that turn uncertainty into a plan"],
                  ["UK market insight", "Advice rooted in recruiter expectations and graduate hiring cycles"],
                  ["Warm accountability", "Supportive guidance without vague motivational fluff"],
                ].map(([title, copy]) => (
                  <Card key={title} className="p-5">
                    <p className="font-semibold text-slate-950">{title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{copy}</p>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="overflow-hidden border-0 bg-slate-950 p-6 text-white shadow-xl shadow-amber-100">
              <div className="rounded-[2rem] bg-gradient-to-br from-amber-200 via-orange-100 to-white p-1">
                <div className="rounded-[1.8rem] bg-slate-950 p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-amber-200">Consultant spotlight</p>
                  <h2 className="mt-3 font-serif text-3xl">Priya Shah</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    Trusted by ambitious students who want realistic strategies, better profiles, and coaching that respects both their strengths and their circumstances.
                  </p>
                  <div className="mt-6 grid gap-3">
                    {[
                      { icon: GraduationCap, label: "Graduate roles and application strategy" },
                      { icon: FileText, label: "CV, resume, and LinkedIn positioning" },
                      { icon: CalendarDays, label: "Interview preparation and workshop delivery" },
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

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <SectionHeading
            eyebrow="Services"
            title="Support that meets students where they are"
            description="From single-session clarity to bundled support, the service mix is designed for students who need practical outcomes rather than generic career advice."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="A calmer, clearer booking flow"
            description="The experience is designed to reduce confusion. Students can see services, choose a slot, pay securely, upload documents where needed, and receive confirmation with the next steps."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["Choose the right support", "Compare services, workshop options, and bundles with transparent pricing."],
              ["Book and pay securely", "Reserve a slot, confirm timing in the UK timezone, and complete payment before the session is finalised."],
              ["Receive focused support", "Get a clear action plan, written feedback, reminders, and follow-up communications."],
            ].map(([title, copy], index) => (
              <Card key={title} className="p-6">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-900">{index + 1}</div>
                <h3 className="font-semibold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{copy}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-6">
              <SectionHeading
                eyebrow="Success stories"
                title="Students trust practical guidance that respects their reality"
                description="Testimonials are woven through the site to build credibility without feeling over-produced or sales-heavy."
              />
              <div className="grid gap-4">
                {testimonials.map((item) => (
                  <Card key={item.name} className="p-6">
                    <div className="flex items-center gap-2 text-amber-600">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Sparkles key={index} className="h-4 w-4" />
                      ))}
                    </div>
                    <p className="mt-4 text-base leading-8 text-slate-700">“{item.quote}”</p>
                    <p className="mt-4 font-semibold text-slate-950">{item.name}</p>
                    <p className="text-sm text-slate-500">
                      {item.role}, {item.university}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Card className="bg-slate-950 p-8 text-white">
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

              <Card className="p-8">
                <h3 className="font-serif text-3xl text-slate-950">Resume review and coaching</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Need personalised feedback before an application deadline? Students can request a CV review or book one-to-one coaching with minimal friction.
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

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <SectionHeading
            eyebrow="Resources"
            title="Practical guidance students can use between sessions"
            description="The resources hub is structured for SEO-friendly content, admin-managed publishing, and future downloadable materials or course modules."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
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

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <SectionHeading
                eyebrow="FAQ"
                title="Questions students commonly ask before booking"
                description="These sections are content-managed in the admin console and ready for future expansion as the business grows."
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
