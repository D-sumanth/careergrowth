import nodemailer from "nodemailer";
import { Resend } from "resend";
import { env } from "@/lib/env";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendTransactionalEmail(payload: EmailPayload) {
  if (env.EMAIL_PROVIDER === "resend" && env.RESEND_API_KEY) {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
    return { provider: "resend" };
  }

  if (env.EMAIL_PROVIDER === "smtp" && env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
    return { provider: "smtp" };
  }

  console.info("Console email fallback", payload);
  return { provider: "console" };
}
