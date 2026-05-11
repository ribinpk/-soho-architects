function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required env var: ${name}. Copy .env.local.example to .env.local and fill it in.`,
    );
  }
  return value;
}

export const projectId = required(
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
);

export const dataset = required(
  "NEXT_PUBLIC_SANITY_DATASET",
  process.env.NEXT_PUBLIC_SANITY_DATASET,
);

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-05-01";

export const studioUrl = "/admin";
