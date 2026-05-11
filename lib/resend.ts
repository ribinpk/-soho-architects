import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

export function isResendConfigured(): boolean {
  return Boolean(
    apiKey &&
      process.env.RESEND_FROM_EMAIL &&
      process.env.INQUIRY_RECIPIENT_EMAIL,
  );
}

export const RESEND_FROM = process.env.RESEND_FROM_EMAIL ?? "";
export const INQUIRY_TO = process.env.INQUIRY_RECIPIENT_EMAIL ?? "";
