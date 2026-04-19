"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";

type BookingFormProps = {
  service: {
    slug: string;
    title: string;
    description: string;
    durationMinutes: number;
    pricePence: number;
  };
};

type AvailabilityResponse = {
  timezone: string;
  slots: string[];
};

function getDefaultDateValue() {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  return today.toISOString().slice(0, 10);
}

export function BookingForm({ service }: BookingFormProps) {
  const router = useRouter();
  const timezone =
    typeof window === "undefined" ? "Europe/London" : Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/London";
  const [selectedDate, setSelectedDate] = useState(getDefaultDateValue);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAvailability() {
      setLoadingSlots(true);
      setError("");
      setStatus("");
      setSelectedSlot("");

      const search = new URLSearchParams({
        serviceSlug: service.slug,
        date: selectedDate,
        timezone,
      });

      const response = await fetch(`/api/bookings/availability?${search.toString()}`);
      const result = (await response.json()) as AvailabilityResponse & { message?: string };

      if (!active) return;

      if (response.ok) {
        setSlots(result.slots);
      } else {
        setSlots([]);
        setError(result.message ?? "Unable to load availability right now.");
      }

      setLoadingSlots(false);
    }

    loadAvailability();
    return () => {
      active = false;
    };
  }, [selectedDate, service.slug, timezone]);

  const selectedSlotLabel = useMemo(
    () => (selectedSlot ? formatDateTime(selectedSlot, timezone) : ""),
    [selectedSlot, timezone],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedSlot) {
      setError("Please choose a time slot before confirming your booking.");
      return;
    }

    setSubmitting(true);
    setError("");
    setStatus("");

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceSlug: service.slug,
        startsAt: selectedSlot,
        timezone,
        notes,
      }),
    });

    const result = await response.json();
    setSubmitting(false);

    if (response.ok) {
      setStatus(result.message ?? "Booking confirmed.");
      router.push(result.redirectTo ?? "/dashboard/bookings");
      router.refresh();
      return;
    }

    setError(result.message ?? "Unable to create the booking.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <h2 className="font-serif text-3xl text-slate-950">Choose your session time</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{service.description}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="rounded-full bg-slate-100 px-4 py-2">{service.durationMinutes} minutes</span>
          <span className="rounded-full bg-slate-100 px-4 py-2">{formatCurrency(service.pricePence)}</span>
          <span className="rounded-full bg-slate-100 px-4 py-2">Timezone shown: {timezone}</span>
        </div>
      </div>

      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Select a date</span>
        <input
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          min={new Date().toISOString().slice(0, 10)}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-950"
        />
      </label>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-700">Available times</p>
          {loadingSlots ? <p className="text-sm text-slate-500">Loading slots...</p> : null}
        </div>
        {slots.length ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {slots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  selectedSlot === slot
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                }`}
              >
                {formatDateTime(slot, timezone)}
              </button>
            ))}
          </div>
        ) : loadingSlots ? null : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-7 text-slate-600">
            No available times were found for this day. Try another date or choose a different service.
          </div>
        )}
      </div>

      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Notes for this session</span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Share the role family, application challenge, or interview stage you want support with."
          className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-950"
        />
      </label>

      {selectedSlotLabel ? (
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Selected slot: {selectedSlotLabel}</div>
      ) : null}
      {status ? <p className="text-sm text-emerald-700">{status}</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <Button type="submit" disabled={submitting || !selectedSlot}>
        {submitting ? "Confirming..." : "Confirm booking"}
      </Button>
    </form>
  );
}
