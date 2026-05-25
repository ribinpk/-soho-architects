/**
 * Build the favicon set from a single SVG source.
 *
 * Emits:
 *   app/icon.svg         — vector, used by all modern browsers
 *   app/apple-icon.png   — 180x180 PNG, used on iOS home-screen
 *   app/favicon.ico      — multi-size ICO (16/32/48), legacy fallback
 *
 * Design: a single solid orange square — the brand accent colour from the
 * SOHO Architects wordmark, abstracted to its essence. Maximum legibility
 * at 16px in a browser tab strip; the orange does the work.
 *
 * Run: npx tsx scripts/build-favicon.ts
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const BRAND_ORANGE = "#E08A2C";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BRAND_ORANGE}"/>
</svg>
`;

const svgBuffer = Buffer.from(svg);

async function buildPng(size: number): Promise<Buffer> {
  return await sharp(svgBuffer).resize(size, size).png().toBuffer();
}

/**
 * Build an ICO file from one or more PNG buffers. The ICO format is a
 * directory header plus per-image entries, each pointing at an embedded
 * PNG payload. Tiny enough to inline rather than pull a dep for.
 *
 * See: https://en.wikipedia.org/wiki/ICO_(file_format)
 */
function buildIco(pngs: { size: number; data: Buffer }[]): Buffer {
  const count = pngs.length;
  const headerSize = 6 + 16 * count;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);        // reserved
  header.writeUInt16LE(1, 2);        // type: 1 = ICO
  header.writeUInt16LE(count, 4);    // number of images

  const entries: Buffer[] = [];
  const payloads: Buffer[] = [];
  let offset = headerSize;

  for (const { size, data } of pngs) {
    const entry = Buffer.alloc(16);
    // Width / height: 0 means 256, so a real value 1..255 maps directly.
    entry.writeUInt8(size === 256 ? 0 : size, 0);
    entry.writeUInt8(size === 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);          // colour palette size (0 = no palette)
    entry.writeUInt8(0, 3);          // reserved
    entry.writeUInt16LE(1, 4);       // colour planes
    entry.writeUInt16LE(32, 6);      // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    payloads.push(data);
    offset += data.length;
  }

  return Buffer.concat([header, ...entries, ...payloads]);
}

async function main() {
  // 1. Vector source — modern browsers use this directly.
  writeFileSync("app/icon.svg", svg);
  console.log("✓ app/icon.svg");

  // 2. Apple touch icon — 180x180 is Apple's current recommendation.
  const apple = await buildPng(180);
  writeFileSync("app/apple-icon.png", apple);
  console.log("✓ app/apple-icon.png (180x180)");

  // 3. Multi-size ICO — covers any legacy browser that doesn't read .svg.
  const png16 = await buildPng(16);
  const png32 = await buildPng(32);
  const png48 = await buildPng(48);
  const ico = buildIco([
    { size: 16, data: png16 },
    { size: 32, data: png32 },
    { size: 48, data: png48 },
  ]);
  writeFileSync("app/favicon.ico", ico);
  console.log("✓ app/favicon.ico (16 + 32 + 48)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
