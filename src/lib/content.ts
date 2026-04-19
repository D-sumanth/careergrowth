import { BookingKind, type BlogPost, type FAQ, type Service, type Testimonial } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isMockMode } from "@/lib/env";
import { blogPosts as staticPosts, faqs as staticFaqs, services as staticServices, testimonials as staticTestimonials } from "@/lib/data/site-content";

const pricingSettingKey = "service_pricing_overrides";

export type ServicePriceOverrideMap = Record<string, number>;

export type PublicServiceRecord = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  whoItIsFor: string;
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

async function getPricingOverridesFromDb() {
  if (!prisma || isMockMode()) return {};

  const setting = await prisma.siteSetting.findUnique({
    where: { key: pricingSettingKey },
  });

  if (!setting || typeof setting.value !== "object" || Array.isArray(setting.value) || !setting.value) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(setting.value as Record<string, unknown>).filter(([, value]) => typeof value === "number"),
  ) as ServicePriceOverrideMap;
}

async function savePricingOverridesToDb(overrides: ServicePriceOverrideMap) {
  if (!prisma || isMockMode()) return;

  await prisma.siteSetting.upsert({
    where: { key: pricingSettingKey },
    update: { value: overrides },
    create: { key: pricingSettingKey, value: overrides },
  });
}

function mapService(service: Service, overrides: ServicePriceOverrideMap): PublicServiceRecord {
  return {
    id: service.id,
    slug: service.slug,
    title: service.title,
    shortDescription: service.shortDescription,
    description: service.description,
    whoItIsFor: service.whoItIsFor,
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

export async function getPublicServices() {
  if (!prisma || isMockMode()) {
    return staticServices.map((service) => ({
      id: service.slug,
      slug: service.slug,
      title: service.title,
      shortDescription: service.description,
      description: service.description,
      whoItIsFor: service.who,
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
    getPricingOverridesFromDb(),
  ]);

  return services.map((service) => mapService(service, overrides));
}

export async function getManagedServices() {
  if (!prisma || isMockMode()) {
    return getPublicServices();
  }

  const [services, overrides] = await Promise.all([
    prisma.service.findMany({
      orderBy: [{ isFeatured: "desc" }, { title: "asc" }],
    }),
    getPricingOverridesFromDb(),
  ]);

  return services.map((service) => mapService(service, overrides));
}

export async function createManagedService(input: {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  whoItIsFor: string;
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

  const overrides = await getPricingOverridesFromDb();
  if (input.compareAtPricePence && input.compareAtPricePence > input.pricePence) {
    overrides[service.id] = input.compareAtPricePence;
  } else {
    delete overrides[service.id];
  }
  await savePricingOverridesToDb(overrides);

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

  const overrides = await getPricingOverridesFromDb();
  if (input.compareAtPricePence && input.compareAtPricePence > input.pricePence) {
    overrides[service.id] = input.compareAtPricePence;
  } else {
    delete overrides[service.id];
  }
  await savePricingOverridesToDb(overrides);

  return mapService(service, overrides);
}

export async function deleteManagedService(id: string) {
  if (!prisma || isMockMode()) throw new Error("Service management requires the database.");

  await prisma.service.delete({ where: { id } });
  const overrides = await getPricingOverridesFromDb();
  delete overrides[id];
  await savePricingOverridesToDb(overrides);
  return { ok: true };
}

function mapTestimonial(testimonial: Testimonial) {
  return {
    id: testimonial.id,
    name: testimonial.name,
    role: testimonial.currentRole ?? "",
    content: testimonial.content,
    rating: testimonial.rating ?? null,
    serviceType: testimonial.serviceType,
  };
}

export async function getPublicTestimonials() {
  if (!prisma || isMockMode()) {
    return staticTestimonials.map((item, index) => ({
      id: `static-${index}`,
      name: item.name,
      role: item.role,
      content: item.quote,
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
  rating?: number | null;
}) {
  if (!prisma || isMockMode()) throw new Error("Testimonials require the database.");

  const item = await prisma.testimonial.create({
    data: {
      name: input.name,
      headline: input.role?.trim() || "Client feedback",
      content: input.content,
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
    orderBy: { publishedAt: "desc" },
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

function mapFaq(faq: FAQ) {
  return {
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
  };
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
