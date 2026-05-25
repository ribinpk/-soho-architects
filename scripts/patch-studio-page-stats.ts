/**
 * One-off: weave the four stats from the (now-removed) homepage StatsStrip
 * into the studioPage introBody as natural prose. Specifically:
 *   - 15 years in practice    → "Fifteen years on"
 *   - 112+ projects delivered → "over a hundred and twelve projects"
 *   - 3 states · India        → "across three Indian states"
 *   - 1 studio · Kozhikode    → "a single studio in Kozhikode by choice"
 *
 * Preserves the existing image block in introBody (the studio photo).
 *
 * Run: npx tsx scripts/patch-studio-page-stats.ts
 */
import { config as loadEnv } from "dotenv";
import { createClient } from "next-sanity";
import { randomUUID } from "node:crypto";

loadEnv({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing env. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-05-01",
  token,
  useCdn: false,
});

const k = () => randomUUID().slice(0, 12);

function para(text: string) {
  return {
    _key: k(),
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [{ _key: k(), _type: "span", marks: [], text }],
  };
}

// Existing studio photo asset — preserved as the third block in the body,
// same as in scripts/patch-studio-page.ts.
const STUDIO_IMAGE_REF =
  "image-dbd27d9bf2ac5c4b9eb48e9660efd77cbc63793d-2528x1684-png";

const newIntroBody = [
  para(
    "SOHO began at a kitchen table in Calicut in 2011 — a small office, a home office, the two collapsed into one. The name stuck.",
  ),
  para(
    "Fifteen years on, the studio is larger and the table is gone, but the premise hasn't moved. We have delivered over a hundred and twelve projects since — houses, workplaces, interiors — across three Indian states, the bulk of them in Kerala, where the monsoon writes half the brief. The principles don't change with the postcode.",
  ),
  para(
    "We remain a single studio in Kozhikode by choice. Every project is led personally by one of the founders, from the first conversation to the last site visit.",
  ),
  {
    _key: k(),
    _type: "image",
    asset: { _ref: STUDIO_IMAGE_REF, _type: "reference" },
    alt: "SOHO Studio, Calicut",
  },
];

async function main() {
  await client.patch("studioPage").set({ introBody: newIntroBody }).commit();
  console.log("studioPage introBody updated with infused stats ✓");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
