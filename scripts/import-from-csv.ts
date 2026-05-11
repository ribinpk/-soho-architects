/**
 * Seeds Sanity with the 6 projects from Ref/Project Detail.csv.
 *
 * - Reads the CSV
 * - Collects every image referenced (top-level columns + <img> tags embedded
 *   in HTML body fields)
 * - Uploads each image to Sanity (preferring local files from Ref/ if found,
 *   falling back to the framerusercontent.com URL otherwise)
 * - Converts HTML to portable text, replacing <img> tags with image blocks
 * - createOrReplace's each project doc — idempotent across re-runs
 *
 * Run: npm run import:csv
 */
import { parse as parseCsv } from "csv-parse/sync";
import { config as loadEnv } from "dotenv";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "next-sanity";
import { parse as parseHtml, type HTMLElement } from "node-html-parser";

loadEnv({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing required env. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local.",
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

const CSV_PATH = path.resolve("Ref/Project Detail.csv");
const LOCAL_IMAGE_DIR = path.resolve(
  "Ref/Soho Architects® _ Interior & Architecture Studio",
);
const CACHE_DIR = path.resolve("sanity-import-cache");
const CACHE_FILE = path.join(CACHE_DIR, "url-to-asset.json");

type CsvRow = Record<string, string>;
type AssetCache = Record<string, string>;

const cache: AssetCache = (() => {
  if (existsSync(CACHE_FILE)) {
    try {
      return JSON.parse(readFileSync(CACHE_FILE, "utf-8"));
    } catch {
      return {};
    }
  }
  return {};
})();

function persistCache() {
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

// --- image upload ----------------------------------------------------------

function extractHashFromUrl(url: string): string | null {
  const m = url.match(/images\/([^.?#/]+)/);
  return m ? m[1] : null;
}

function localPathFor(url: string): string | null {
  const hash = extractHashFromUrl(url);
  if (!hash) return null;
  for (const ext of [".jpg", ".jpeg", ".png", ".webp"]) {
    const p = path.join(LOCAL_IMAGE_DIR, `${hash}${ext}`);
    if (existsSync(p)) return p;
  }
  return null;
}

async function uploadImage(url: string): Promise<string> {
  if (cache[url]) return cache[url];

  let buffer: Buffer;
  let filename: string;
  const local = localPathFor(url);

  if (local) {
    buffer = readFileSync(local);
    filename = path.basename(local);
  } else {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Fetch failed for ${url}: ${res.status} ${res.statusText}`);
    }
    buffer = Buffer.from(await res.arrayBuffer());
    filename = url.split("/").pop()?.split("?")[0] ?? "image";
  }

  const asset = await client.assets.upload("image", buffer, { filename });
  cache[url] = asset._id;
  persistCache();
  return asset._id;
}

// --- key generation --------------------------------------------------------

let keyCounter = 0;
function makeKey(): string {
  keyCounter += 1;
  return `k${keyCounter.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

// --- HTML → portable text --------------------------------------------------

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type Block = {
  _type: "block";
  _key: string;
  style: string;
  markDefs: unknown[];
  children: Span[];
};
type ImageBlock = {
  _type: "image";
  _key: string;
  asset: { _type: "reference"; _ref: string };
  alt?: string;
};

function emitSpan(spans: Span[], text: string, marks: string[]) {
  if (!text) return;
  const last = spans[spans.length - 1];
  if (last && arraysEqual(last.marks, marks)) {
    last.text += text;
    return;
  }
  spans.push({ _type: "span", _key: makeKey(), text, marks });
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) return false;
  return true;
}

function walkInline(node: HTMLElement, marks: string[], spans: Span[]) {
  for (const child of node.childNodes) {
    if (child.nodeType === 3) {
      // text
      const text = (child as unknown as { rawText: string }).rawText;
      if (text) emitSpan(spans, decodeEntities(text), marks);
    } else if (child.nodeType === 1) {
      const el = child as HTMLElement;
      const tag = el.rawTagName?.toLowerCase();
      if (tag === "strong" || tag === "b") {
        walkInline(el, [...marks, "strong"], spans);
      } else if (tag === "em" || tag === "i") {
        walkInline(el, [...marks, "em"], spans);
      } else if (tag === "br") {
        emitSpan(spans, "\n", marks);
      } else {
        walkInline(el, marks, spans);
      }
    }
  }
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function paragraphToBlock(p: HTMLElement): Block | null {
  const spans: Span[] = [];
  walkInline(p, [], spans);
  const text = spans.map((s) => s.text).join("").trim();
  if (!text) return null;
  return {
    _type: "block",
    _key: makeKey(),
    style: "normal",
    markDefs: [],
    children: spans,
  };
}

function htmlToBlocks(
  html: string | undefined,
  urlToAssetId: Map<string, string>,
): Array<Block | ImageBlock> {
  if (!html?.trim()) return [];
  const root = parseHtml(html, { lowerCaseTagName: false });
  const blocks: Array<Block | ImageBlock> = [];

  for (const child of root.childNodes) {
    if (child.nodeType !== 1) continue;
    const el = child as HTMLElement;
    const tag = el.rawTagName?.toLowerCase();

    if (tag === "p") {
      const block = paragraphToBlock(el);
      if (block) blocks.push(block);
    } else if (tag === "img") {
      const src = el.getAttribute("src");
      if (src && urlToAssetId.has(src)) {
        const alt = el.getAttribute("alt")?.trim() ?? "";
        blocks.push({
          _type: "image",
          _key: makeKey(),
          asset: { _type: "reference", _ref: urlToAssetId.get(src)! },
          ...(alt ? { alt } : {}),
        });
      }
    }
  }

  return blocks;
}

function imageRef(assetId: string, alt?: string) {
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: assetId },
    ...(alt ? { alt } : {}),
  };
}

// --- main ------------------------------------------------------------------

const IMAGE_COLUMNS = [
  "Project Cover",
  "Overview Image",
  "Design Approach Image",
  "Detail Image",
  "Gallery Image //01",
  "Gallery Image //02",
  "Gallery Image //03",
  "Gallery Image //04",
] as const;

const HTML_COLUMNS = [
  "Project Description",
  "Project Overview",
  "Design Approach",
  "Details",
] as const;

function collectUrls(rows: CsvRow[]): Set<string> {
  const urls = new Set<string>();
  for (const row of rows) {
    for (const col of IMAGE_COLUMNS) {
      const v = row[col]?.trim();
      if (v) urls.add(v);
    }
    for (const col of HTML_COLUMNS) {
      const html = row[col];
      if (!html) continue;
      const matches = html.matchAll(/<img[^>]+src="([^"]+)"/g);
      for (const m of matches) urls.add(m[1]);
    }
  }
  return urls;
}

async function uploadAll(urls: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const concurrency = 4;
  let done = 0;
  for (let i = 0; i < urls.length; i += concurrency) {
    const slice = urls.slice(i, i + concurrency);
    await Promise.all(
      slice.map(async (url) => {
        try {
          const id = await uploadImage(url);
          map.set(url, id);
          done += 1;
          console.log(`  [${done}/${urls.length}] ${url.split("/").pop()}`);
        } catch (err) {
          console.error(`  ✗ ${url}\n     ${(err as Error).message}`);
        }
      }),
    );
  }
  return map;
}

function normalizeStatus(s: string | undefined): "completed" | "ongoing" {
  return s?.trim().toLowerCase().startsWith("complete") ? "completed" : "ongoing";
}

function buildProjectDoc(row: CsvRow, urlMap: Map<string, string>) {
  const slug = row.Slug?.trim();
  if (!slug) throw new Error(`Missing slug for row: ${row["Project Name"]}`);

  const cover = urlMap.get(row["Project Cover"]);
  if (!cover) throw new Error(`Missing cover image for ${slug}`);

  const optionalImage = (col: string, altCol: string) => {
    const url = row[col]?.trim();
    if (!url) return undefined;
    const id = urlMap.get(url);
    if (!id) return undefined;
    return imageRef(id, row[altCol]?.trim() || undefined);
  };

  const galleryItems = (["//01", "//02", "//03", "//04"] as const)
    .map((suffix) => {
      const url = row[`Gallery Image ${suffix}`]?.trim();
      if (!url) return undefined;
      const id = urlMap.get(url);
      if (!id) return undefined;
      return {
        _key: makeKey(),
        ...imageRef(id, row[`Gallery Image ${suffix}:alt`]?.trim() || undefined),
      };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return {
    _id: `project.${slug}`,
    _type: "project" as const,
    name: row["Project Name"]?.trim(),
    slug: { _type: "slug" as const, current: slug },
    projectNumber: Number.parseInt(row["Project Number"], 10),
    client: row["Client Name"]?.trim() || undefined,
    location: row.Location?.trim(),
    status: normalizeStatus(row.Status),
    year: Number.parseInt(row.Year, 10) || new Date().getFullYear(),
    builtArea: row["Total Built Area"]?.trim() || undefined,
    featured: false,
    cover: imageRef(cover, row["Project Cover:alt"]?.trim() || undefined),
    description: htmlToBlocks(row["Project Description"], urlMap),
    overviewImage: optionalImage("Overview Image", "Overview Image:alt"),
    overviewBody: htmlToBlocks(row["Project Overview"], urlMap),
    overviewLayout: "standard" as const,
    designApproachImage: optionalImage("Design Approach Image", "Design Approach Image:alt"),
    designApproachBody: htmlToBlocks(row["Design Approach"], urlMap),
    designApproachLayout: "standard" as const,
    detailImage: optionalImage("Detail Image", "Detail Image:alt"),
    detailBody: htmlToBlocks(row.Details, urlMap),
    detailLayout: "standard" as const,
    gallery: galleryItems,
  };
}

async function main() {
  console.log("→ Reading CSV...");
  const csvText = readFileSync(CSV_PATH, "utf-8");
  const rows = parseCsv(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];
  console.log(`  ${rows.length} projects.`);

  console.log("→ Collecting image URLs...");
  const allUrls = [...collectUrls(rows)];
  console.log(`  ${allUrls.length} unique images.`);

  console.log("→ Uploading images to Sanity (cached across runs)...");
  const urlMap = await uploadAll(allUrls);
  console.log(`  ${urlMap.size}/${allUrls.length} uploaded.`);

  console.log("→ Creating project documents...");
  for (const row of rows) {
    try {
      const doc = buildProjectDoc(row, urlMap);
      await client.createOrReplace(doc);
      console.log(`  ✓ ${doc.name}`);
    } catch (err) {
      console.error(`  ✗ ${row["Project Name"] || row.Slug}: ${(err as Error).message}`);
    }
  }

  console.log("\nDone. Open Sanity Studio at /admin to review.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
