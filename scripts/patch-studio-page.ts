/**
 * One-off cleanup of the studioPage singleton:
 *   - introBody: drop the leading "About" duplicate text block, drop the
 *     trailing leftover h3 block, strip the redundant image caption,
 *     and trim a stray trailing "\n" from the third paragraph.
 *   - team[0]: normalize name capitalisation, trim the appended
 *     "inspired by Frank Lloyd Wright" sentence so the bio matches the
 *     spec (two concise sentences, same shape as Varun & Nabeel).
 *   - press[0]: rebalance title/source so the same award name doesn't
 *     appear in both columns.
 *
 * Run: npx tsx scripts/patch-studio-page.ts
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

// Preserve the existing image asset already on the document; just drop the
// caption ("Soho Studio in Calicut") which repeated the page headline.
const STUDIO_IMAGE_REF =
  "image-dbd27d9bf2ac5c4b9eb48e9660efd77cbc63793d-2528x1684-png";

const newIntroBody = [
  para(
    "SOHO began at a kitchen table in Calicut in 2011 — a small office, a home office, the two collapsed into one. The name stuck.",
  ),
  para(
    "Fifteen years on, the studio is larger and the table is gone, but the premise hasn't moved. We make buildings that are answerable to their site, their climate, and the people who'll live in them. Most of our work is in Kerala, where the monsoon writes half the brief. Some of it is elsewhere. The principles don't change with the postcode.",
  ),
  para(
    "We're a small studio by choice. Every project is led by one of the founders, from the first conversation to the last site visit.",
  ),
  {
    _key: k(),
    _type: "image",
    asset: { _ref: STUDIO_IMAGE_REF, _type: "reference" },
    alt: "SOHO Studio, Calicut",
  },
];

const SUHAIL_KEY = "efa980b02243";
const PRESS_KEY = "0fd5677ccd78";

const newSuhailBio = [
  {
    _key: k(),
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        _key: k(),
        _type: "span",
        marks: [],
        text: "Suhail leads the studio's architectural work, and is the partner most likely to be found on site. He cares about how a building meets the ground, how a wall meets the sky, and very little in between is left unresolved.",
      },
    ],
  },
];

async function main() {
  await client
    .patch("studioPage")
    .set({
      introBody: newIntroBody,
      [`team[_key=="${SUHAIL_KEY}"].name`]: "Ar. Suhail AK",
      [`team[_key=="${SUHAIL_KEY}"].bio`]: newSuhailBio,
      [`press[_key=="${PRESS_KEY}"].title`]:
        "IIA Kerala State Award — Silver Leaf",
      [`press[_key=="${PRESS_KEY}"].source`]:
        "Indian Institute of Architects",
    })
    .commit();

  console.log("studioPage patched ✓");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
