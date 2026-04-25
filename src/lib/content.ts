import {
  BookingKind,
  InquiryStatus,
  Prisma,
  ReviewStatus,
  WorkshopStatus,
  type BlogPost,
  type FAQ,
  type Service,
  type Testimonial,
  type Workshop,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isMockMode } from "@/lib/env";
import {
  blogPosts as staticPosts,
  faqs as staticFaqs,
  services as staticServices,
  siteConfig as staticSiteConfig,
  testimonials as staticTestimonials,
  workshops as staticWorkshops,
} from "@/lib/data/site-content";

const servicePricingSettingKey = "service_pricing_overrides";
const workshopPricingSettingKey = "workshop_pricing_overrides";
const siteContentSettingKey = "site_content_settings";

export type PriceOverrideMap = Record<string, number>;

export type PublicServiceRecord = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  whoItIsFor: string;
  imageUrl: string | null;
  videoUrl: string | null;
  includedItems: string[];
  durationMinutes: number;
  durationLabel: string;
  pricePence: number;
  compareAtPricePence: number | null;
  isFeatured: boolean;
  isActive: boolean;
  bookingKind: BookingKind;
  isBookable: boolean;
  accent: string;
};

export type PublicWorkshopRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  bannerImageUrl: string | null;
  startsAt: Date;
  endsAt: Date;
  timezone: string;
  seatLimit: number;
  soldCount: number;
  waitlistEnabled: boolean;
  pricePence: number;
  compareAtPricePence: number | null;
  status: WorkshopStatus;
  replayUrl: string | null;
  downloadUrl: string | null;
  isBookable: boolean;
};

export type SiteContentSettings = typeof staticSiteConfig & {
  aboutTitle: string;
  aboutIntro: string;
  aboutBody: string;
  values: string[];
  workshopsTitle: string;
  workshopsDescription: string;
  footerDescription: string;
};

const staticSiteSettings: SiteContentSettings = {
  ...staticSiteConfig,
  aboutTitle: "Practical UK job-search support shaped by lived experience, not generic advice.",
  aboutIntro:
    "Aditi Rahegaonkar publicly shares content centred on helping international students and graduates navigate UK applications, interviews, sponsorship questions, and the emotional pressure that often comes with the process.",
  aboutBody:
    "The tone of the brand is intentionally practical and reassuring. The message is not that there is a magic formula, but that students can get better results with clearer strategy, stronger positioning, and support that actually understands their reality.",
  values: [
    "Practical guidance over vague motivation",
    "Support that understands international student realities in the UK",
    "Career strategy that includes sponsorship and timing, not just CV formatting",
    "Confidence built through clarity, preparation, and honest feedback",
  ],
  workshopsTitle: "Live sessions on UK job search, sponsorship awareness, and stronger applications.",
  workshopsDescription:
    "Keep workshops current from the admin panel, including pricing, offers, seat limits, and whether a session is still available live or now replay-only.",
  footerDescription:
    "Career coaching and UK job-search guidance designed to make the process clearer for international students and graduates.",
};

function serviceAccentForSlug(slug: string) {
  const match = staticServices.find((service) => service.slug === slug);
  return match?.accent ?? "from-slate-200 via-white to-slate-100";
}

function durationLabel(durationMinutes: number, bookingKind: BookingKind) {
  if (durationMinutes > 0) {
    return `${durationMinutes} minutes`;
  }

  if (bookingKind === BookingKind.RESUME_REVIEW) {
    return "Asynchronous review";
  }

  return "Custom support";
}

function parseIncludedItems(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function buildExcerpt(content: string, fallbackTitle: string) {
  const trimmed = content.replace(/\s+/g, " ").trim();
  if (!trimmed) return fallbackTitle;
  return trimmed.length <= 180 ? trimmed : `${trimmed.slice(0, 177)}...`;
}

function parseObjectSetting(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

function parseNumericOverrides(value: unknown) {
  return Object.fromEntries(
    Object.entries(parseObjectSetting(value)).filter(([, entry]) => typeof entry === "number"),
  ) as PriceOverrideMap;
}

async function getSettingRecord(key: string) {
  if (!prisma || isMockMode()) return null;
  return prisma.siteSetting.findUnique({ where: { key } });
}

async function saveSettingRecord(key: string, value: Prisma.InputJsonValue) {
  if (!prisma || isMockMode()) return;

  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

async function getPriceOverridesFromDb(key: string) {
  const setting = await getSettingRecord(key);
  return parseNumericOverrides(setting?.value);
}

async function savePriceOverridesToDb(key: string, overrides: PriceOverrideMap) {
  await saveSettingRecord(key, overrides);
}

function mapService(service: Service, overrides: PriceOverrideMap): PublicServiceRecord {
  return {
    id: service.id,
    slug: service.slug,
    title: service.title,
    shortDescription: service.shortDescription,
    description: service.description,
    whoItIsFor: service.whoItIsFor,
    imageUrl: service.imageUrl ?? null,
    videoUrl: service.videoUrl ?? null,
    includedItems: parseIncludedItems(service.includedItems),
    durationMinutes: service.durationMinutes,
    durationLabel: durationLabel(service.durationMinutes, service.bookingKind),
    pricePence: service.pricePence,
    compareAtPricePence: overrides[service.id] ?? null,
    isFeatured: service.isFeatured,
    isActive: service.isActive,
    bookingKind: service.bookingKind,
    isBookable: service.bookingKind === BookingKind.ONE_TO_ONE && service.durationMinutes > 0,
    accent: serviceAccentForSlug(service.slug),
  };
}

function mapWorkshop(workshop: Workshop & { _count?: { registrations: number } }, overrides: PriceOverrideMap): PublicWorkshopRecord {
  return {
    id: workshop.id,
    slug: workshop.slug,
    title: workshop.title,
    description: workshop.description,
    imageUrl: workshop.imageUrl ?? workshop.bannerImageUrl ?? null,
    bannerImageUrl: workshop.imageUrl ?? workshop.bannerImageUrl,
    startsAt: workshop.startsAt,
    endsAt: workshop.endsAt,
    timezone: workshop.timezone,
    seatLimit: workshop.seatLimit,
    soldCount: workshop._count?.registrations ?? 0,
    waitlistEnabled: workshop.waitlistEnabled,
    pricePence: workshop.pricePence,
    compareAtPricePence: overrides[workshop.id] ?? null,
    status: workshop.status,
    replayUrl: workshop.replayUrl,
    downloadUrl: workshop.downloadUrl,
    isBookable: workshop.status === WorkshopStatus.PUBLISHED,
  };
}

function mapTestimonial(testimonial: Testimonial) {
  return {
    id: testimonial.id,
    name: testimonial.name,
    role: testimonial.currentRole ?? "",
    content: testimonial.content,
    imageUrl: testimonial.imageUrl ?? null,
    rating: testimonial.rating ?? null,
    serviceType: testimonial.serviceType,
  };
}

function mapPost(post: BlogPost) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    topic: post.topic,
    excerpt: post.excerpt,
    content: post.content,
    published: post.published,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

function mapFaq(faq: FAQ) {
  return {
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
  };
}

function normalizeSiteContentSettings(value: unknown): SiteContentSettings {
  const record = parseObjectSetting(value);
  type StringSiteSettingKey = Exclude<keyof SiteContentSettings, "values">;
  const getString = (key: StringSiteSettingKey) => {
    const candidate = record[key as string];
    return typeof candidate === "string" && candidate.trim() ? candidate : staticSiteSettings[key];
  };

  const valuesText = typeof record.valuesText === "string" ? record.valuesText : staticSiteSettings.values.join("\n");

  return {
    name: getString("name"),
    consultantName: getString("consultantName"),
    email: getString("email"),
    phone: getString("phone"),
    whatsapp: getString("whatsapp"),
    location: getString("location"),
    instagram: getString("instagram"),
    linkedin: getString("linkedin"),
    tagline: getString("tagline"),
    heroBadge: getString("heroBadge"),
    heroTitle: getString("heroTitle"),
    heroDescription: getString("heroDescription"),
    mission: getString("mission"),
    credibility: getString("credibility"),
    contactNote: getString("contactNote"),
    aboutTitle: getString("aboutTitle"),
    aboutIntro: getString("aboutIntro"),
    aboutBody: getString("aboutBody"),
    workshopsTitle: getString("workshopsTitle"),
    workshopsDescription: getString("workshopsDescription"),
    footerDescription: getString("footerDescription"),
    values: valuesText
      .split("\n")
      .map((entry) => entry.trim())
      .filter(Boolean),
  };
}

type ManagedSiteContentInput = Omit<SiteContentSettings, "values" | "whatsapp" | "instagram"> & {
  valuesText: string;
  whatsapp?: string;
  instagram?: string;
};

function serializeSiteContentSettings(input: ManagedSiteContentInput) {
  return {
    ...input,
    whatsapp: input.whatsapp ?? "",
    instagram: input.instagram ?? "",
    valuesText: input.valuesText,
  };
}

export async function getPublicSiteContent() {
  if (!prisma || isMockMode()) {
    return staticSiteSettings;
  }

  const setting = await getSettingRecord(siteContentSettingKey);
  return normalizeSiteContentSettings(setting?.value);
}

export async function getManagedSiteContent() {
  const settings = await getPublicSiteContent();

  return {
    ...settings,
    valuesText: settings.values.join("\n"),
  };
}

export async function updateManagedSiteContent(input: ManagedSiteContentInput) {
  if (!prisma || isMockMode()) throw new Error("Site settings require the database.");

  await saveSettingRecord(siteContentSettingKey, serializeSiteContentSettings(input));
  return getManagedSiteContent();
}

export async function getPublicServices() {
  if (!prisma || isMockMode()) {
    return staticServices.map((service) => ({
      id: service.slug,
      slug: service.slug,
      title: service.title,
      shortDescription: service.description,
      description: service.description,
      whoItIsFor: service.who,
      imageUrl: null,
      videoUrl: null,
      includedItems: service.included,
      durationMinutes: 0,
      durationLabel: service.duration,
      pricePence: service.pricePence,
      compareAtPricePence: null,
      isFeatured: true,
      isActive: true,
      bookingKind: BookingKind.ONE_TO_ONE,
      isBookable: !service.slug.includes("workshops") && !service.slug.includes("course"),
      accent: service.accent,
    }));
  }

  const [services, overrides] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: "desc" }, { title: "asc" }],
    }),
    getPriceOverridesFromDb(servicePricingSettingKey),
  ]);

  return services.map((service) => mapService(service, overrides));
}

export async function getPublicServiceBySlug(slug: string) {
  const services = await getPublicServices();
  return services.find((service) => service.slug === slug) ?? null;
}

export async function getManagedServices() {
  if (!prisma || isMockMode()) {
    return getPublicServices();
  }

  const [services, overrides] = await Promise.all([
    prisma.service.findMany({
      orderBy: [{ isFeatured: "desc" }, { title: "asc" }],
    }),
    getPriceOverridesFromDb(servicePricingSettingKey),
  ]);

  return services.map((service) => mapService(service, overrides));
}

export async function createManagedService(input: {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  whoItIsFor: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  includedItemsText: string;
  durationMinutes: number;
  pricePence: number;
  compareAtPricePence?: number | null;
  bookingKind: BookingKind;
  isActive: boolean;
  isFeatured: boolean;
}) {
  if (!prisma || isMockMode()) throw new Error("Service management requires the database.");

  const service = await prisma.service.create({
    data: {
      title: input.title,
      slug: input.slug,
      shortDescription: input.shortDescription,
      description: input.description,
      whoItIsFor: input.whoItIsFor,
      imageUrl: input.imageUrl?.trim() || null,
      videoUrl: input.videoUrl?.trim() || null,
      includedItems: input.includedItemsText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      durationMinutes: input.durationMinutes,
      pricePence: input.pricePence,
      bookingKind: input.bookingKind,
      isActive: input.isActive,
      isFeatured: input.isFeatured,
    },
  });

  const overrides = await getPriceOverridesFromDb(servicePricingSettingKey);
  if (input.compareAtPricePence && input.compareAtPricePence > input.pricePence) {
    overrides[service.id] = input.compareAtPricePence;
  } else {
    delete overrides[service.id];
  }
  await savePriceOverridesToDb(servicePricingSettingKey, overrides);

  return mapService(service, overrides);
}

export async function updateManagedService(
  id: string,
  input: {
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    whoItIsFor: string;
    imageUrl?: string | null;
    videoUrl?: string | null;
    includedItemsText: string;
    durationMinutes: number;
    pricePence: number;
    compareAtPricePence?: number | null;
    bookingKind: BookingKind;
    isActive: boolean;
    isFeatured: boolean;
  },
) {
  if (!prisma || isMockMode()) throw new Error("Service management requires the database.");

  const service = await prisma.service.update({
    where: { id },
    data: {
      title: input.title,
      slug: input.slug,
      shortDescription: input.shortDescription,
      description: input.description,
      whoItIsFor: input.whoItIsFor,
      imageUrl: input.imageUrl?.trim() || null,
      videoUrl: input.videoUrl?.trim() || null,
      includedItems: input.includedItemsText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      durationMinutes: input.durationMinutes,
      pricePence: input.pricePence,
      bookingKind: input.bookingKind,
      isActive: input.isActive,
      isFeatured: input.isFeatured,
    },
  });

  const overrides = await getPriceOverridesFromDb(servicePricingSettingKey);
  if (input.compareAtPricePence && input.compareAtPricePence > input.pricePence) {
    overrides[service.id] = input.compareAtPricePence;
  } else {
    delete overrides[service.id];
  }
  await savePriceOverridesToDb(servicePricingSettingKey, overrides);

  return mapService(service, overrides);
}

export async function deleteManagedService(id: string) {
  if (!prisma || isMockMode()) throw new Error("Service management requires the database.");

  await prisma.service.delete({ where: { id } });
  const overrides = await getPriceOverridesFromDb(servicePricingSettingKey);
  delete overrides[id];
  await savePriceOverridesToDb(servicePricingSettingKey, overrides);
  return { ok: true };
}

export async function getPublicWorkshops() {
  if (!prisma || isMockMode()) {
    return staticWorkshops.map((workshop) => ({
      id: workshop.slug,
      slug: workshop.slug,
      title: workshop.title,
      description: workshop.summary,
      imageUrl: null,
      bannerImageUrl: null,
      startsAt: new Date(workshop.startsAt),
      endsAt: new Date(workshop.endsAt),
      timezone: "Europe/London",
      seatLimit: workshop.seatLimit,
      soldCount: workshop.sold,
      waitlistEnabled: true,
      pricePence: workshop.pricePence,
      compareAtPricePence: null,
      status: workshop.status === "Past" ? WorkshopStatus.COMPLETED : WorkshopStatus.PUBLISHED,
      replayUrl: null,
      downloadUrl: null,
      isBookable: workshop.status !== "Past",
    }));
  }

  const [workshops, overrides] = await Promise.all([
    prisma.workshop.findMany({
      where: { status: { in: [WorkshopStatus.PUBLISHED, WorkshopStatus.COMPLETED] } },
      include: { _count: { select: { registrations: true } } },
      orderBy: { startsAt: "asc" },
    }),
    getPriceOverridesFromDb(workshopPricingSettingKey),
  ]);

  return workshops.map((workshop) => mapWorkshop(workshop, overrides));
}

export async function getManagedWorkshops() {
  if (!prisma || isMockMode()) {
    return getPublicWorkshops();
  }

  const [workshops, overrides] = await Promise.all([
    prisma.workshop.findMany({
      include: { _count: { select: { registrations: true } } },
      orderBy: { startsAt: "asc" },
    }),
    getPriceOverridesFromDb(workshopPricingSettingKey),
  ]);

  return workshops.map((workshop) => mapWorkshop(workshop, overrides));
}

export async function createManagedWorkshop(input: {
  title: string;
  slug: string;
  description: string;
  imageUrl?: string | null;
  startsAt: string;
  endsAt: string;
  timezone: string;
  seatLimit: number;
  waitlistEnabled: boolean;
  pricePence: number;
  compareAtPricePence?: number | null;
  status: WorkshopStatus;
  replayUrl?: string | null;
  downloadUrl?: string | null;
}) {
  if (!prisma || isMockMode()) throw new Error("Workshop management requires the database.");

  const workshop = await prisma.workshop.create({
    data: {
      title: input.title,
      slug: input.slug,
      description: input.description,
      imageUrl: input.imageUrl?.trim() || null,
      bannerImageUrl: input.imageUrl?.trim() || null,
      startsAt: new Date(input.startsAt),
      endsAt: new Date(input.endsAt),
      timezone: input.timezone,
      seatLimit: input.seatLimit,
      waitlistEnabled: input.waitlistEnabled,
      pricePence: input.pricePence,
      status: input.status,
      replayUrl: input.replayUrl?.trim() || null,
      downloadUrl: input.downloadUrl?.trim() || null,
    },
  });

  const overrides = await getPriceOverridesFromDb(workshopPricingSettingKey);
  if (input.compareAtPricePence && input.compareAtPricePence > input.pricePence) {
    overrides[workshop.id] = input.compareAtPricePence;
  } else {
    delete overrides[workshop.id];
  }
  await savePriceOverridesToDb(workshopPricingSettingKey, overrides);

  return mapWorkshop(workshop, overrides);
}

export async function updateManagedWorkshop(
  id: string,
  input: {
    title: string;
    slug: string;
    description: string;
    imageUrl?: string | null;
    startsAt: string;
    endsAt: string;
    timezone: string;
    seatLimit: number;
    waitlistEnabled: boolean;
    pricePence: number;
    compareAtPricePence?: number | null;
    status: WorkshopStatus;
    replayUrl?: string | null;
    downloadUrl?: string | null;
  },
) {
  if (!prisma || isMockMode()) throw new Error("Workshop management requires the database.");

  const workshop = await prisma.workshop.update({
    where: { id },
    data: {
      title: input.title,
      slug: input.slug,
      description: input.description,
      imageUrl: input.imageUrl?.trim() || null,
      bannerImageUrl: input.imageUrl?.trim() || null,
      startsAt: new Date(input.startsAt),
      endsAt: new Date(input.endsAt),
      timezone: input.timezone,
      seatLimit: input.seatLimit,
      waitlistEnabled: input.waitlistEnabled,
      pricePence: input.pricePence,
      status: input.status,
      replayUrl: input.replayUrl?.trim() || null,
      downloadUrl: input.downloadUrl?.trim() || null,
    },
  });

  const overrides = await getPriceOverridesFromDb(workshopPricingSettingKey);
  if (input.compareAtPricePence && input.compareAtPricePence > input.pricePence) {
    overrides[workshop.id] = input.compareAtPricePence;
  } else {
    delete overrides[workshop.id];
  }
  await savePriceOverridesToDb(workshopPricingSettingKey, overrides);

  return mapWorkshop(workshop, overrides);
}

export async function deleteManagedWorkshop(id: string) {
  if (!prisma || isMockMode()) throw new Error("Workshop management requires the database.");
  await prisma.workshop.delete({ where: { id } });
  const overrides = await getPriceOverridesFromDb(workshopPricingSettingKey);
  delete overrides[id];
  await savePriceOverridesToDb(workshopPricingSettingKey, overrides);
  return { ok: true };
}

export async function getPublicTestimonials() {
  if (!prisma || isMockMode()) {
    return staticTestimonials.map((item, index) => ({
      id: `static-${index}`,
      name: item.name,
      role: item.role,
      content: item.quote,
      imageUrl: null,
      rating: 5,
      serviceType: item.service,
      university: item.university,
    }));
  }

  const items = await prisma.testimonial.findMany({
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });

  return items.map((item) => ({
    ...mapTestimonial(item),
    university: item.university,
  }));
}

export async function getManagedTestimonials() {
  if (!prisma || isMockMode()) {
    return getPublicTestimonials();
  }

  const items = await prisma.testimonial.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return items.map(mapTestimonial);
}

export async function createManagedTestimonial(input: {
  name: string;
  role?: string;
  content: string;
  imageUrl?: string | null;
  rating?: number | null;
}) {
  if (!prisma || isMockMode()) throw new Error("Testimonials require the database.");

  const item = await prisma.testimonial.create({
    data: {
      name: input.name,
      headline: input.role?.trim() || "Client feedback",
      content: input.content,
      imageUrl: input.imageUrl?.trim() || null,
      currentRole: input.role?.trim() || null,
      serviceType: "General",
      rating: input.rating ?? 5,
      featured: false,
    },
  });

  return mapTestimonial(item);
}

export async function updateManagedTestimonial(
  id: string,
  input: {
    name: string;
    role?: string;
    content: string;
    imageUrl?: string | null;
    rating?: number | null;
  },
) {
  if (!prisma || isMockMode()) throw new Error("Testimonials require the database.");

  const item = await prisma.testimonial.update({
    where: { id },
    data: {
      name: input.name,
      headline: input.role?.trim() || "Client feedback",
      content: input.content,
      imageUrl: input.imageUrl?.trim() || null,
      currentRole: input.role?.trim() || null,
      rating: input.rating ?? 5,
    },
  });

  return mapTestimonial(item);
}

export async function deleteManagedTestimonial(id: string) {
  if (!prisma || isMockMode()) throw new Error("Testimonials require the database.");
  await prisma.testimonial.delete({ where: { id } });
  return { ok: true };
}

export async function getPublicPosts() {
  if (!prisma || isMockMode()) {
    return staticPosts.map((post, index) => ({
      id: `static-${index}`,
      slug: post.slug,
      title: post.title,
      topic: post.topic,
      excerpt: post.excerpt,
      content: post.content,
      published: true,
      publishedAt: new Date(post.publishedAt),
      createdAt: new Date(post.publishedAt),
      updatedAt: new Date(post.publishedAt),
    }));
  }

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return posts.map(mapPost);
}

export async function getPublicPostBySlug(slug: string) {
  if (!prisma || isMockMode()) {
    const post = staticPosts.find((entry) => entry.slug === slug);
    if (!post) return null;
    return {
      id: slug,
      slug: post.slug,
      title: post.title,
      topic: post.topic,
      excerpt: post.excerpt,
      content: post.content,
      published: true,
      publishedAt: new Date(post.publishedAt),
      createdAt: new Date(post.publishedAt),
      updatedAt: new Date(post.publishedAt),
    };
  }

  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) return null;
  return mapPost(post);
}

export async function getManagedPosts() {
  if (!prisma || isMockMode()) {
    return getPublicPosts();
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return posts.map(mapPost);
}

export async function createManagedPost(input: {
  title: string;
  slug: string;
  topic?: string;
  excerpt?: string;
  content: string;
  published: boolean;
}) {
  if (!prisma || isMockMode()) throw new Error("Posts require the database.");

  const post = await prisma.blogPost.create({
    data: {
      title: input.title,
      slug: input.slug,
      topic: input.topic?.trim() || "Resources",
      excerpt: input.excerpt?.trim() || buildExcerpt(input.content, input.title),
      content: input.content,
      published: input.published,
      publishedAt: input.published ? new Date() : null,
    },
  });

  return mapPost(post);
}

export async function updateManagedPost(
  id: string,
  input: {
    title: string;
    slug: string;
    topic?: string;
    excerpt?: string;
    content: string;
    published: boolean;
  },
) {
  if (!prisma || isMockMode()) throw new Error("Posts require the database.");

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new Error("Post not found.");

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      title: input.title,
      slug: input.slug,
      topic: input.topic?.trim() || "Resources",
      excerpt: input.excerpt?.trim() || buildExcerpt(input.content, input.title),
      content: input.content,
      published: input.published,
      publishedAt: input.published ? existing.publishedAt ?? new Date() : null,
    },
  });

  return mapPost(post);
}

export async function deleteManagedPost(id: string) {
  if (!prisma || isMockMode()) throw new Error("Posts require the database.");
  await prisma.blogPost.delete({ where: { id } });
  return { ok: true };
}

export async function getPublicFaqs() {
  if (!prisma || isMockMode()) {
    return staticFaqs.map((faq, index) => ({
      id: `static-${index}`,
      question: faq.question,
      answer: faq.answer,
    }));
  }

  const items = await prisma.fAQ.findMany({
    where: { isPublished: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  return items.map(mapFaq);
}

export async function getManagedFaqs() {
  if (!prisma || isMockMode()) {
    return getPublicFaqs();
  }

  const items = await prisma.fAQ.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  return items.map(mapFaq);
}

export async function createManagedFaq(input: { question: string; answer: string }) {
  if (!prisma || isMockMode()) throw new Error("FAQs require the database.");

  const item = await prisma.fAQ.create({
    data: {
      question: input.question,
      answer: input.answer,
      category: "general",
      isPublished: true,
      sortOrder: 0,
    },
  });

  return mapFaq(item);
}

export async function updateManagedFaq(id: string, input: { question: string; answer: string }) {
  if (!prisma || isMockMode()) throw new Error("FAQs require the database.");

  const item = await prisma.fAQ.update({
    where: { id },
    data: {
      question: input.question,
      answer: input.answer,
    },
  });

  return mapFaq(item);
}

export async function deleteManagedFaq(id: string) {
  if (!prisma || isMockMode()) throw new Error("FAQs require the database.");
  await prisma.fAQ.delete({ where: { id } });
  return { ok: true };
}

export async function updateManagedInquiry(
  id: string,
  input: {
    status: InquiryStatus;
    assignedTo?: string;
  },
) {
  if (!prisma || isMockMode()) throw new Error("Inquiry management requires the database.");

  return prisma.inquiry.update({
    where: { id },
    data: {
      status: input.status,
      assignedTo: input.assignedTo?.trim() || null,
      repliedAt: input.status === InquiryStatus.RESPONDED || input.status === InquiryStatus.CLOSED ? new Date() : null,
    },
  });
}

export async function updateManagedReview(
  id: string,
  input: {
    status: ReviewStatus;
    assignedToId?: string;
    notes?: string;
    deliverySummary?: string;
    turnaroundHours?: number | null;
  },
) {
  if (!prisma || isMockMode()) throw new Error("Review management requires the database.");

  return prisma.resumeReviewRequest.update({
    where: { id },
    data: {
      status: input.status,
      assignedToId: input.assignedToId?.trim() || null,
      notes: input.notes?.trim() || null,
      deliverySummary: input.deliverySummary?.trim() || null,
      turnaroundHours: input.turnaroundHours ?? null,
    },
    include: {
      requester: true,
      assignedTo: true,
      documents: true,
    },
  });
}
