import { z } from "zod";

export const timelineOptions = [
  { value: "under-3-months", label: "Under 3 months" },
  { value: "3-6-months", label: "3 – 6 months" },
  { value: "6-plus-months", label: "6+ months" },
  { value: "exploring", label: "Just exploring" },
] as const;

export const siteSecuredOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not-yet", label: "Not yet" },
] as const;

const timelineValues = timelineOptions.map((o) => o.value) as [
  (typeof timelineOptions)[number]["value"],
  ...(typeof timelineOptions)[number]["value"][],
];
const siteSecuredValues = siteSecuredOptions.map((o) => o.value) as [
  (typeof siteSecuredOptions)[number]["value"],
  ...(typeof siteSecuredOptions)[number]["value"][],
];

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please share your name").max(120),
  email: z.string().trim().email("A valid email helps us reply"),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  location: z.string().trim().max(160).optional().or(z.literal("")),
  timeline: z.enum(timelineValues).optional().or(z.literal("")),
  siteSecured: z.enum(siteSecuredValues).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more — at least 10 characters")
    .max(4000),
  // honeypot — bots fill this, humans don't
  company: z.string().max(0).optional().or(z.literal("")),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export function labelForTimeline(v: string | undefined): string | undefined {
  return timelineOptions.find((o) => o.value === v)?.label;
}
export function labelForSiteSecured(v: string | undefined): string | undefined {
  return siteSecuredOptions.find((o) => o.value === v)?.label;
}
