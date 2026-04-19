import { PolicyLayout } from "@/components/marketing/policy-layout";

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms and Conditions"
      intro="These draft terms explain how coaching sessions, workshops, digital resources, and website use are intended to work for this website. They should be reviewed and approved before a public launch."
    >
      <section>
        <h2 className="font-semibold text-slate-950">Services</h2>
        <p>
          This website offers career coaching, CV and profile support, interview preparation, workshops, and related educational resources for students and graduates, especially international students navigating the UK job market.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-slate-950">Bookings and payments</h2>
        <p>
          A booking is only confirmed once payment has been received where payment is required in advance. Session timings, inclusions, and delivery formats are shown on the relevant service page or booking confirmation.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-slate-950">Educational support, not guaranteed outcomes</h2>
        <p>
          Coaching and review services are intended to improve clarity, preparation, and confidence. They do not guarantee interview calls, job offers, sponsorship, or a particular career outcome.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-slate-950">User responsibilities</h2>
        <p>
          Clients are responsible for providing accurate information, attending sessions on time, reviewing feedback thoughtfully, and using the website lawfully. Uploaded documents should belong to the user or be shared with proper permission.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-slate-950">Website content</h2>
        <p>
          All website copy, resources, workshop material, and branding remain protected intellectual property unless otherwise stated. Clients may not republish paid materials without permission.
        </p>
      </section>
    </PolicyLayout>
  );
}
