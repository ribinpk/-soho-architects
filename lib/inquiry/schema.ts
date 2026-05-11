import { z } from "zod";

export const projectTypes = [
  "residential",
  "commercial",
  "hospitality",
  "workspace",
  "interior",
  "other",
] as const;

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please share your name").max(120),
  email: z.string().trim().email("A valid email helps us reply"),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  projectType: z.enum(projectTypes).optional(),
  location: z.string().trim().max(160).optional().or(z.literal("")),
  budgetRange: z.string().trim().max(120).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more — at least 10 characters")
    .max(4000),
  // honeypot — bots fill this, humans don't
  company: z.string().max(0).optional().or(z.literal("")),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
