import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/services",
    "/workshops",
    "/pricing",
    "/testimonials",
    "/contact",
    "/resources",
    "/sign-in",
    "/sign-up",
  ];

  return routes.map((route) => ({
    url: `http://localhost:3000${route}`,
    lastModified: new Date(),
  }));
}
