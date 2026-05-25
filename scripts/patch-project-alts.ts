/**
 * One-off cleanup of `cover.alt` on every project document.
 *
 * Background: three projects ship a generic placeholder alt
 * ("Project Cover Image") on their cover image. When a cover image fails
 * to load (e.g. broken asset reference) the browser renders the alt
 * as visible text — which is what surfaced on /, /projects.
 *
 * Fix: set `cover.alt` to a meaningful, project-specific string for every
 * project. We also print each project's cover asset ref so we can spot
 * which assets are missing if loading still fails.
 *
 * Run: npx tsx scripts/patch-project-alts.ts
 */
import { config as loadEnv } from "dotenv";
import { createClient } from "next-sanity";

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

type Project = {
  _id: string;
  slug: string;
  name: string;
  location?: string;
  cover?: {
    alt?: string;
    asset?: { _ref?: string };
  };
};

async function main() {
  const projects = await client.fetch<Project[]>(
    `*[_type == "project"]{
       _id,
       "slug": slug.current,
       name,
       location,
       cover{ alt, asset }
     } | order(projectNumber asc)`,
  );

  console.log(`Found ${projects.length} project(s).\n`);

  for (const p of projects) {
    const ref = p.cover?.asset?._ref ?? "(no asset)";
    const oldAlt = p.cover?.alt ?? "(none — falls back to project name)";
    const newAlt = p.location
      ? `${p.name} — ${p.location.split(",")[0]?.trim()}`
      : p.name;

    console.log(`• ${p.name} (${p.slug})`);
    console.log(`  asset:  ${ref}`);
    console.log(`  alt:    "${oldAlt}"`);
    console.log(`  → new:  "${newAlt}"\n`);

    if (!p.cover?.asset) {
      console.log("  ! No cover asset — alt update skipped, no image set.\n");
      continue;
    }

    await client.patch(p._id).set({ "cover.alt": newAlt }).commit();
  }

  console.log("project alts patched ✓");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
