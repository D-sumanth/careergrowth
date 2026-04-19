import { PolicyLayout } from "@/components/marketing/policy-layout";

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      intro="This draft privacy policy explains how personal information may be collected and used through this website. It should be reviewed and approved before the website is used publicly."
    >
      <section>
        <h2 className="font-semibold text-slate-950">What information may be collected</h2>
        <p>
          The website may collect your name, email address, phone number, profile details, university information, career targets, uploaded CV or supporting files, booking details, payment metadata, and messages submitted through contact forms.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-slate-950">Why it is collected</h2>
        <p>
          Information is collected to respond to inquiries, provide coaching or review services, manage bookings, deliver workshops, improve user experience, maintain records, and support website operations.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-slate-950">Uploads and sensitive information</h2>
        <p>
          CVs and supporting documents may contain personal information. These files are intended to be stored privately and accessed only where needed to deliver the relevant service. Users should avoid uploading unnecessary sensitive information where possible.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-slate-950">Sharing with third parties</h2>
        <p>
          Data may be processed through trusted service providers used for hosting, payments, file storage, analytics, and email delivery. Payment card details should be handled by the payment processor, not stored directly by this website.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-slate-950">Your rights</h2>
        <p>
          Depending on applicable law, users may request access to their data, correction of inaccurate details, or deletion where appropriate. Final wording should be aligned with the website&apos;s actual launch jurisdiction and compliance approach.
        </p>
      </section>
    </PolicyLayout>
  );
}
