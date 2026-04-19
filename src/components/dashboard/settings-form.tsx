"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type SettingsFormProps = {
  account: {
    name: string;
    email: string;
    profile: {
      mobileNumber: string | null;
      university: string | null;
      degree: string | null;
      visaStatus: string | null;
      careerTarget: string | null;
      linkedInUrl: string | null;
      timezone: string | null;
      notes: string | null;
    } | null;
  };
};

export function SettingsForm({ account }: SettingsFormProps) {
  const router = useRouter();
  const [profileStatus, setProfileStatus] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [pendingProfile, setPendingProfile] = useState(false);
  const [pendingPassword, setPendingPassword] = useState(false);

  async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPendingProfile(true);
    setProfileStatus("");
    setProfileError("");
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    setPendingProfile(false);
    if (response.ok) {
      setProfileStatus(result.message ?? "Profile saved.");
      router.refresh();
    } else {
      setProfileError(result.message ?? "Unable to save profile.");
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPendingPassword(true);
    setPasswordStatus("");
    setPasswordError("");
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch("/api/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    setPendingPassword(false);
    if (response.ok) {
      setPasswordStatus(result.message ?? "Password updated.");
      event.currentTarget.reset();
    } else {
      setPasswordError(result.message ?? "Unable to update password.");
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleProfileSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-950">Profile details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            <span>Full name</span>
            <input name="name" defaultValue={account.name} required className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Email</span>
            <input value={account.email} readOnly className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500" />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Mobile number</span>
            <input name="mobileNumber" defaultValue={account.profile?.mobileNumber ?? ""} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>University</span>
            <input name="university" defaultValue={account.profile?.university ?? ""} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Degree</span>
            <input name="degree" defaultValue={account.profile?.degree ?? ""} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Visa status</span>
            <input name="visaStatus" defaultValue={account.profile?.visaStatus ?? ""} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Career target</span>
            <input name="careerTarget" defaultValue={account.profile?.careerTarget ?? ""} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>LinkedIn URL</span>
            <input name="linkedInUrl" defaultValue={account.profile?.linkedInUrl ?? ""} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
          </label>
          <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
            <span>Timezone</span>
            <input name="timezone" defaultValue={account.profile?.timezone ?? "Europe/London"} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
          </label>
          <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
            <span>Notes</span>
            <textarea name="notes" defaultValue={account.profile?.notes ?? ""} className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3" />
          </label>
        </div>
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={pendingProfile}>
            {pendingProfile ? "Saving..." : "Save settings"}
          </Button>
        </div>
        {profileStatus ? <p className="text-sm text-emerald-700">{profileStatus}</p> : null}
        {profileError ? <p className="text-sm text-rose-600">{profileError}</p> : null}
      </form>

      <form onSubmit={handlePasswordSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-950">Change password</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2 text-sm text-slate-700">
            <span>Current password</span>
            <input type="password" name="currentPassword" required className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>New password</span>
            <input type="password" name="newPassword" required className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Confirm new password</span>
            <input type="password" name="confirmPassword" required className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
          </label>
        </div>
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={pendingPassword}>
            {pendingPassword ? "Updating..." : "Update password"}
          </Button>
        </div>
        {passwordStatus ? <p className="text-sm text-emerald-700">{passwordStatus}</p> : null}
        {passwordError ? <p className="text-sm text-rose-600">{passwordError}</p> : null}
      </form>
    </div>
  );
}
