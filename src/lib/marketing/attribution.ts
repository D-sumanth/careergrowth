import { cookies } from "next/headers";

export const ATTRIBUTION_COOKIE = "career_attribution";

export type AttributionSnapshot = {
  source: string;
  medium: string;
  campaign?: string | null;
  referrer?: string | null;
  landingPath?: string | null;
  capturedAt: string;
};

function sanitizeText(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 240) : null;
}

function inferSourceFromReferrer(referrer: string | null) {
  if (!referrer) {
    return { source: "direct", medium: "none" };
  }

  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host.includes("google.")) return { source: "google", medium: "organic" };
    if (host.includes("linkedin.")) return { source: "linkedin", medium: "social" };
    if (host.includes("instagram.")) return { source: "instagram", medium: "social" };
    if (host.includes("facebook.")) return { source: "facebook", medium: "social" };
    if (host.includes("bing.")) return { source: "bing", medium: "organic" };
    return { source: host.replace(/^www\./, ""), medium: "referral" };
  } catch {
    return { source: "direct", medium: "none" };
  }
}

export function buildAttributionSnapshot(requestUrl: URL, referrerHeader: string | null) {
  const utmSource = sanitizeText(requestUrl.searchParams.get("utm_source"));
  const utmMedium = sanitizeText(requestUrl.searchParams.get("utm_medium"));
  const utmCampaign = sanitizeText(requestUrl.searchParams.get("utm_campaign"));
  const referrer = sanitizeText(referrerHeader);
  const inferred = inferSourceFromReferrer(referrer);

  return {
    source: utmSource ?? inferred.source,
    medium: utmMedium ?? inferred.medium,
    campaign: utmCampaign,
    referrer,
    landingPath: sanitizeText(`${requestUrl.pathname}${requestUrl.search}`),
    capturedAt: new Date().toISOString(),
  } satisfies AttributionSnapshot;
}

export async function readAttributionCookie() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(ATTRIBUTION_COOKIE)?.value;
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AttributionSnapshot;
  } catch {
    return null;
  }
}

