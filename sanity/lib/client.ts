import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

// Prefer a dedicated read-only viewer token if present, otherwise reuse the
// write token. Both are server-only — this module is server-only via the
// "server-only" import above, so neither is ever bundled for the browser.
// Sanity v5 gates document reads behind tokens even on "Public" datasets,
// so a token is required for the site to render content.
const readToken =
  process.env.SANITY_API_READ_TOKEN ?? process.env.SANITY_API_WRITE_TOKEN;

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // CDN can't be used together with tokens.
  useCdn: !readToken,
  token: readToken,
  perspective: "published",
});

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  perspective: "raw",
});
