import { PolicyLayout } from "@/components/marketing/policy-layout";

export default function CookiePolicyPage() {
  return (
    <PolicyLayout
      title="Cookie Policy"
      intro="This draft cookie policy explains the likely use of necessary website cookies and, later, analytics or marketing cookies. It should be aligned with the final analytics and consent setup before launch."
    >
      <section>
        <h2 className="font-semibold text-slate-950">Necessary cookies</h2>
        <p>
          The website may use essential cookies for session handling, security, authentication, and basic website functionality. These are generally required for the site to operate properly.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-slate-950">Analytics cookies</h2>
        <p>
          If analytics tools are enabled, cookies or similar technologies may be used to understand page visits, user flows, and website performance. A consent mechanism should be added before using non-essential tracking.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-slate-950">Managing cookies</h2>
        <p>
          Users can usually control cookies through browser settings. If a cookie consent banner is added later, users should also be able to update their tracking preferences there.
        </p>
      </section>
    </PolicyLayout>
  );
}
