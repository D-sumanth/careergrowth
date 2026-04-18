const fallback = {
  APP_URL: "http://localhost:3000",
  AUTH_SECRET: "dev-auth-secret-change-me",
  EMAIL_PROVIDER: "console",
  EMAIL_FROM: "Career Growth Studio <noreply@example.com>",
  STRIPE_CURRENCY: "gbp",
  STRIPE_API_VERSION: "2026-02-25.clover",
  ENABLE_MOCK_MODE: "true",
  UPLOAD_DRIVER: "local",
  UPLOAD_LOCAL_DIR: "./storage/uploads",
  MAX_UPLOAD_SIZE_MB: "10",
};

export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  APP_URL: process.env.APP_URL ?? fallback.APP_URL,
  AUTH_SECRET: process.env.AUTH_SECRET ?? fallback.AUTH_SECRET,
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER ?? fallback.EMAIL_PROVIDER,
  EMAIL_FROM: process.env.EMAIL_FROM ?? fallback.EMAIL_FROM,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: Number(process.env.SMTP_PORT ?? 587),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  STRIPE_CURRENCY: process.env.STRIPE_CURRENCY ?? fallback.STRIPE_CURRENCY,
  STRIPE_API_VERSION: process.env.STRIPE_API_VERSION ?? fallback.STRIPE_API_VERSION,
  ENABLE_MOCK_MODE: (process.env.ENABLE_MOCK_MODE ?? fallback.ENABLE_MOCK_MODE) === "true",
  UPLOAD_DRIVER: process.env.UPLOAD_DRIVER ?? fallback.UPLOAD_DRIVER,
  UPLOAD_LOCAL_DIR: process.env.UPLOAD_LOCAL_DIR ?? fallback.UPLOAD_LOCAL_DIR,
  MAX_UPLOAD_SIZE_MB: Number(process.env.MAX_UPLOAD_SIZE_MB ?? fallback.MAX_UPLOAD_SIZE_MB),
};

export function isMockMode() {
  return env.ENABLE_MOCK_MODE || !env.DATABASE_URL;
}
