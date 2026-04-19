import { PolicyLayout } from "@/components/marketing/policy-layout";

export default function RefundCancellationPolicyPage() {
  return (
    <PolicyLayout
      title="Refund and Cancellation Policy"
      intro="This draft policy sets a practical baseline for cancellations, rescheduling, and workshop payments. It should be reviewed before launch and adjusted to match the final business model."
    >
      <section>
        <h2 className="font-semibold text-slate-950">One-to-one sessions</h2>
        <p>
          Sessions may generally be rescheduled if enough notice is given. A practical starting rule for launch is at least 24 hours&apos; notice before the scheduled start time.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-slate-950">Late cancellations</h2>
        <p>
          Where insufficient notice is given, the session fee may be non-refundable or only partially refundable, especially if time has already been reserved exclusively for the booking.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-slate-950">Workshops and digital resources</h2>
        <p>
          Workshop registrations may be non-refundable once the event is close to delivery or replay access has been made available. Any exceptions should be stated clearly on the product page.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-slate-950">Consultant-initiated changes</h2>
        <p>
          If a session or workshop needs to be moved by the consultant, users should be offered a reasonable reschedule option or refund where appropriate.
        </p>
      </section>
    </PolicyLayout>
  );
}
