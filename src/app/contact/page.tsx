import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LeadForm } from "@/components/forms/lead-form";
import { siteConfig } from "@/lib/data/site-content";

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Contact</p>
          <h1 className="font-serif text-5xl font-semibold tracking-tight text-slate-950">Ask a question, request support, or enquire about workshops.</h1>
          <p className="text-base leading-8 text-slate-600">{siteConfig.email}</p>
          <p className="text-base leading-8 text-slate-600">{siteConfig.phone}</p>
          <a href={siteConfig.whatsapp} className="text-sm font-semibold text-slate-950">
            WhatsApp enquiry
          </a>
        </div>
        <LeadForm
          endpoint="/api/contact"
          submitLabel="Send inquiry"
          fields={[
            { name: "name", label: "Full name", required: true },
            { name: "email", label: "Email address", type: "email", required: true },
            { name: "mobileNumber", label: "Mobile number" },
            { name: "category", label: "Inquiry category", type: "select", required: true },
            { name: "subject", label: "Subject", required: true },
            { name: "message", label: "Message", type: "textarea", required: true, placeholder: "Tell us what support you need." },
          ]}
        />
      </main>
      <SiteFooter />
    </>
  );
}
