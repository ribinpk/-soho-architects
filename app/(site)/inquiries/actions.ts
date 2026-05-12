"use server";

import { inquirySchema, type InquiryInput } from "@/lib/inquiry/schema";
import { renderInquiryHtml, renderInquiryText } from "@/lib/inquiry/email";
import {
  INQUIRY_TO,
  RESEND_FROM,
  isResendConfigured,
  resend,
} from "@/lib/resend";
import { sanityWriteClient } from "@/sanity/lib/client";

export type InquiryState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<keyof InquiryInput, string>>;
      values?: Partial<InquiryInput>;
    }
  | { status: "success"; message: string };

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
  const parsed = inquirySchema.safeParse(raw);

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    const fieldErrors: Partial<Record<keyof InquiryInput, string>> = {};
    for (const [k, msgs] of Object.entries(flat)) {
      if (msgs && msgs.length) {
        fieldErrors[k as keyof InquiryInput] = msgs[0];
      }
    }
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      fieldErrors,
      values: raw as Partial<InquiryInput>,
    };
  }

  // Honeypot — silently succeed for bots
  if (parsed.data.company) {
    return { status: "success", message: "Thanks. We'll be in touch." };
  }

  if (!isResendConfigured()) {
    return {
      status: "error",
      message:
        "Inquiry service isn't fully configured yet. Please email us directly.",
    };
  }

  try {
    await resend!.emails.send({
      from: RESEND_FROM,
      to: INQUIRY_TO,
      replyTo: parsed.data.email,
      subject: `New inquiry — ${parsed.data.name}`,
      html: renderInquiryHtml(parsed.data),
      text: renderInquiryText(parsed.data),
    });
  } catch (err) {
    console.error("Resend send failed", err);
    return {
      status: "error",
      message: "Could not send your inquiry. Please try again in a moment.",
    };
  }

  // Best-effort persist to Sanity. Email is already sent — don't fail the
  // submission if this errors.
  if (process.env.SANITY_API_WRITE_TOKEN) {
    try {
      await sanityWriteClient.create({
        _type: "inquiry",
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || undefined,
        location: parsed.data.location || undefined,
        timeline: parsed.data.timeline || undefined,
        siteSecured: parsed.data.siteSecured || undefined,
        message: parsed.data.message,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Sanity inquiry persist failed (email did send)", err);
    }
  }

  return {
    status: "success",
    message:
      "Thanks. We've received your note and will reply within three working days — always from a person.",
  };
}
