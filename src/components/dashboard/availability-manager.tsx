"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

type ConsultantOption = {
  id: string;
  name: string;
  email: string;
};

type RuleRecord = {
  id: string;
  consultantId: string | null;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

type OverrideRecord = {
  id: string;
  consultantId: string | null;
  date: string | Date;
  startTime: string | null;
  endTime: string | null;
  isAvailable: boolean;
  reason: string | null;
};

const dayOptions = [
  [1, "Monday"],
  [2, "Tuesday"],
  [3, "Wednesday"],
  [4, "Thursday"],
  [5, "Friday"],
  [6, "Saturday"],
  [0, "Sunday"],
] as const;

function getDayLabel(dayOfWeek: number) {
  return dayOptions.find(([value]) => value === dayOfWeek)?.[1] ?? "Unknown";
}

function getDefaultDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

export function AvailabilityManager({
  role,
  consultants,
  selectedConsultantId,
  rules,
  overrides,
}: {
  role: "CONSULTANT" | "ADMIN";
  consultants: ConsultantOption[];
  selectedConsultantId: string | null;
  rules: RuleRecord[];
  overrides: OverrideRecord[];
}) {
  const router = useRouter();
  const [consultantId, setConsultantId] = useState(selectedConsultantId ?? consultants[0]?.id ?? "");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [pendingRule, setPendingRule] = useState(false);
  const [pendingOverride, setPendingOverride] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [overrideMode, setOverrideMode] = useState<"blocked" | "open">("blocked");

  const activeConsultant = useMemo(
    () => consultants.find((consultant) => consultant.id === consultantId) ?? consultants[0],
    [consultantId, consultants],
  );

  async function createRule(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPendingRule(true);
    setStatus("");
    setError("");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "rule",
        consultantId,
        dayOfWeek: Number(formData.get("dayOfWeek")),
        startTime: formData.get("startTime"),
        endTime: formData.get("endTime"),
      }),
    });
    const result = await response.json();
    setPendingRule(false);

    if (response.ok) {
      setStatus(result.message ?? "Availability saved.");
      event.currentTarget.reset();
      router.refresh();
    } else {
      setError(result.message ?? "Unable to save availability.");
    }
  }

  async function createOverride(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPendingOverride(true);
    setStatus("");
    setError("");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "override",
        consultantId,
        date: formData.get("date"),
        startTime: overrideMode === "open" ? formData.get("startTime") : "",
        endTime: overrideMode === "open" ? formData.get("endTime") : "",
        isAvailable: overrideMode === "open",
        reason: formData.get("reason"),
      }),
    });
    const result = await response.json();
    setPendingOverride(false);

    if (response.ok) {
      setStatus(result.message ?? "Override saved.");
      event.currentTarget.reset();
      router.refresh();
    } else {
      setError(result.message ?? "Unable to save override.");
    }
  }

  async function removeEntry(id: string, kind: "rule" | "override") {
    setDeletingId(id);
    setStatus("");
    setError("");

    const response = await fetch(`/api/availability/${id}?kind=${kind}`, {
      method: "DELETE",
    });
    const result = await response.json();
    setDeletingId("");

    if (response.ok) {
      setStatus(result.message ?? "Availability entry removed.");
      router.refresh();
    } else {
      setError(result.message ?? "Unable to remove entry.");
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="font-semibold text-slate-950">Availability manager</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          Define the recurring weekly hours that should be bookable, then use date overrides to block holidays or open one-off exceptions. Once recurring rules exist, the booking flow follows those rules instead of the default fallback schedule.
        </p>
        {role === "ADMIN" && activeConsultant ? (
          <label className="mt-5 block space-y-2 text-sm font-medium text-slate-700">
            <span>Managing consultant</span>
            <select
              value={consultantId}
              onChange={(event) => setConsultantId(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-950"
            >
              {consultants.map((consultant) => (
                <option key={consultant.id} value={consultant.id}>
                  {consultant.name} ({consultant.email})
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {status ? <p className="mt-4 text-sm text-emerald-700">{status}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <form onSubmit={createRule} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-950">Add recurring weekly hours</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-2 text-sm text-slate-700">
              <span>Day</span>
              <select name="dayOfWeek" defaultValue="1" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-950">
                {dayOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span>Start</span>
              <input type="time" name="startTime" defaultValue="10:00" required className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-950" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span>End</span>
              <input type="time" name="endTime" defaultValue="17:00" required className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-950" />
            </label>
          </div>
          <Button type="submit" disabled={pendingRule || !consultantId}>
            {pendingRule ? "Saving..." : "Add weekly window"}
          </Button>
        </form>

        <form onSubmit={createOverride} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-950">Add date override</h3>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setOverrideMode("blocked")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${overrideMode === "blocked" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}
            >
              Block a date
            </button>
            <button
              type="button"
              onClick={() => setOverrideMode("open")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${overrideMode === "open" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}
            >
              Open an extra slot window
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-2 text-sm text-slate-700">
              <span>Date</span>
              <input type="date" name="date" min={new Date().toISOString().slice(0, 10)} defaultValue={getDefaultDate()} required className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-950" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span>Start</span>
              <input type="time" name="startTime" disabled={overrideMode === "blocked"} defaultValue="10:00" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-950 disabled:bg-slate-100" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span>End</span>
              <input type="time" name="endTime" disabled={overrideMode === "blocked"} defaultValue="12:00" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-950 disabled:bg-slate-100" />
            </label>
          </div>
          <label className="block space-y-2 text-sm text-slate-700">
            <span>Reason</span>
            <input name="reason" placeholder={overrideMode === "blocked" ? "Holiday, travel, unavailable day" : "Special workshop week, extra coaching hours"} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-950" />
          </label>
          <Button type="submit" disabled={pendingOverride || !consultantId}>
            {pendingOverride ? "Saving..." : "Save override"}
          </Button>
        </form>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold text-slate-950">Recurring weekly hours</h3>
          <div className="mt-4 space-y-3">
            {rules.length ? (
              rules.map((rule) => (
                <div key={rule.id} className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-950">{getDayLabel(rule.dayOfWeek)}</p>
                    <p className="text-sm text-slate-600">
                      {rule.startTime} to {rule.endTime} UK time
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEntry(rule.id, "rule")}
                    disabled={deletingId === rule.id}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
                  >
                    {deletingId === rule.id ? "Removing..." : "Remove"}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-slate-600">
                No recurring rules saved yet. The booking flow will keep using the default schedule until you add your own weekly windows.
              </p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-slate-950">Upcoming overrides</h3>
          <div className="mt-4 space-y-3">
            {overrides.length ? (
              overrides.map((override) => (
                <div key={override.id} className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-950">{formatDate(override.date)}</p>
                    <p className="text-sm text-slate-600">
                      {override.isAvailable
                        ? `Open ${override.startTime ?? ""} to ${override.endTime ?? ""} UK time`
                        : "Blocked for bookings"}
                    </p>
                    {override.reason ? <p className="mt-1 text-sm text-slate-500">{override.reason}</p> : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEntry(override.id, "override")}
                    disabled={deletingId === override.id}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
                  >
                    {deletingId === override.id ? "Removing..." : "Remove"}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-slate-600">No upcoming overrides yet. Add one when you need to block a date or open extra hours.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
