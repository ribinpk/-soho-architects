import type { QueryParams } from "next-sanity";
import { sanityClient } from "./client";

type FetchOptions = {
  params?: QueryParams;
  tags?: string[];
  revalidate?: number | false;
};

export async function sanityFetch<T>(
  query: string,
  { params = {}, tags = [], revalidate = 60 }: FetchOptions = {},
): Promise<T> {
  return sanityClient.fetch<T>(query, params, {
    next: {
      revalidate: tags.length > 0 ? false : revalidate,
      tags,
    },
  });
}
