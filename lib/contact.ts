export const STUDIO_ADDRESS = {
  name: "SOHO Architects",
  street: "Golf Link Road, Malaparamba",
  city: "Kozhikode, Kerala 673009",
} as const;

export const STUDIO_PHONES = [
  { display: "+91 88 9198 80801", tel: "+918891988081" },
  { display: "+91 77 3674 9385", tel: "+917736749385" },
] as const;

export const STUDIO_EMAIL = "info@sohoarchitects.in";

export const WHATSAPP_PHONE = STUDIO_PHONES[0];
export const WHATSAPP_MESSAGE =
  "Hi SOHO Architects, I'd like to discuss a project.";
