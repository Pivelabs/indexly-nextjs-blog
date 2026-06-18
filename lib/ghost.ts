// lib/ghost.ts
// Ghost Content API client — parallel to lib/wordpress.ts.
// Docs: https://ghost.org/docs/content-api/
//
// Required env vars:
//   GHOST_URL                — e.g. https://yourblog.ghost.io (no trailing slash needed)
//   GHOST_CONTENT_API_KEY    — Content API key from Ghost Admin > Settings > Integrations
//
// Optional:
//   GHOST_API_VERSION        — e.g. "v5.0" (defaults to "v5.0")

import querystring from "query-string";
import type {
  GhostPost,
  GhostPage,
  GhostTag,
  GhostCategory,
  GhostAuthor,
  GhostResponse,
  GhostPagination,
} from "./ghost";

const GHOST_URL = process.env.GHOST_URL?.replace(/\/+$/, "");
const GHOST_CONTENT_API_KEY = process.env.GHOST_CONTENT_API_KEY;
const GHOST_API_VERSION = process.env.GHOST_API_VERSION ?? "v5.0";

if (!GHOST_URL) {
  throw new Error("GHOST_URL environment variable is not defined");
}
if (!GHOST_CONTENT_API_KEY) {
  throw new Error("GHOST_CONTENT_API_KEY environment variable is not defined");
}

const API_BASE = `${GHOST_URL}/ghost/api/content`;

export class GhostAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string
  ) {
    super(message);
    this.name = "GhostAPIError";
  }
}

// Ghost images are publicly accessible — the proxy simply rewrites
// to the same /api/ghost-image route (useful if you want CDN/auth control
// or a consistent transform pipeline). If you don't need proxying, you can
// return `src` directly from consumers.
export function proxyImage(src: string | null | undefined): string {
  if (!src) return "";
  const path = GHOST_URL && src.startsWith(GHOST_URL) ? src.replace(GHOST_URL, "") : src;
  return `/api/ghost-image?src=${encodeURIComponent(path)}`;
}

type CacheOptions = { tags?: string[]; revalidate?: number };

async function ghostFetch<T>(
  resource: string,
  query?: Record<string, any>,
  cacheOptions?: CacheOptions
): Promise<T> {
  const params = {
    key: GHOST_CONTENT_API_KEY,
    ...(query ?? {}),
  };
  const url = `${API_BASE}${resource}?${querystring.stringify(params)}`;
  const tags = cacheOptions?.tags ?? ["ghost"];
  const revalidate = cacheOptions?.revalidate ?? 3600;

  const response = await fetch(url, {
    headers: {
      "Accept-Version": GHOST_API_VERSION,
      "Content-Type": "application/json",
      "User-Agent": "Next.js Headless Ghost Client",
    },
    next: { tags, revalidate },
  });

  if (!response.ok) {
    let errorMessage = `Ghost API request failed: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.text();
      if (errorBody) errorMessage += ` - ${errorBody}`;
    } catch {}
    throw new GhostAPIError(errorMessage, response.status, url);
  }

  return response.json() as Promise<T>;
}

// The Ghost Content API wraps collection responses in a top-level key
// matching the resource name (e.g. { posts: [...], meta: { pagination } }).
// Detail endpoints still return a one-element array under the same key.
async function ghostCollection<T>(
  resource: "posts" | "pages" | "tags" | "authors",
  query?: Record<string, any>,
  cacheOptions?: CacheOptions
): Promise<{ items: T[]; pagination?: GhostPagination }> {
  const body = await ghostFetch<Record<string, any>>(`/${resource}/`, query, cacheOptions);
  return {
    items: (body[resource] ?? []) as T[],
    pagination: body.meta?.pagination,
  };
}

// === POSTS ===
export async function getPostsPaginated(
  page: number = 1,
  perPage: number = 9,
  filterParams?: {
    author?: string;
    tag?: string;
    category?: string; // Ghost has no categories — treated as a tag slug.
    search?: string;
  }
): Promise<GhostResponse<GhostPost[]>> {
  const filters: string[] = [];
  if (filterParams?.author) filters.push(`authors.id:${filterParams.author}`);
  if (filterParams?.tag) filters.push(`tags.id:${filterParams.tag}`);
  if (filterParams?.category) filters.push(`tags.id:${filterParams.category}`);

  const query: Record<string, any> = {
    include: "tags,authors",
    limit: perPage,
    page,
  };
  if (filters.length) query.filter = filters.join("+");

  // Ghost's Content API has no native full-text search. Approximate it by
  // matching title or slug with NQL `~` (contains) — adjust to your needs.
  if (filterParams?.search) {
    const needle = filterParams.search.replace(/'/g, "");
    query.filter = [query.filter, `title:~'${needle}',slug:~'${needle}'`]
      .filter(Boolean)
      .join("+");
  }

  const cacheTags = ["ghost", "posts", `posts-page-${page}`];
  if (filterParams?.search) cacheTags.push("posts-search");
  if (filterParams?.author) cacheTags.push(`posts-author-${filterParams.author}`);
  if (filterParams?.tag) cacheTags.push(`posts-tag-${filterParams.tag}`);
  if (filterParams?.category) cacheTags.push(`posts-category-${filterParams.category}`);

  const { items, pagination } = await ghostCollection<GhostPost>("posts", query, {
    tags: cacheTags,
  });

  return {
    data: items,
    meta: {
      pagination: pagination ?? {
        page,
        limit: perPage,
        pages: 1,
        total: items.length,
        next: null,
        prev: null,
      },
    },
  };
}

export async function getAllPostsForSitemap(): Promise<GhostPost[]> {
  const all: GhostPost[] = [];
  let page = 1;
  const limit = 100;

  while (true) {
    const query: Record<string, any> = {
      limit,
      page,
      fields: "id,slug,updated_at,published_at,title",
      filter: "status:published",
    };

    try {
      const { items, pagination } = await ghostCollection<GhostPost>("posts", query);
      if (!items.length) break;
      all.push(...items);

      if (!pagination || page >= pagination.pages) break;
      page++;

      if (page > 100) {
        console.warn("getAllPostsForSitemap stopped at page 100");
        break;
      }
    } catch (error) {
      console.error(`Error fetching posts page ${page} for sitemap:`, error);
      break;
    }
  }

  console.log(`getAllPostsForSitemap: Fetched ${all.length} total posts`);
  return all;
}

export async function getAllPosts(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
}): Promise<GhostPost[]> {
  const filters: string[] = [];
  if (filterParams?.author) filters.push(`authors.id:${filterParams.author}`);
  if (filterParams?.tag) filters.push(`tags.id:${filterParams.tag}`);
  if (filterParams?.category) filters.push(`tags.id:${filterParams.category}`);
  if (filterParams?.search) {
    const needle = filterParams.search.replace(/'/g, "");
    filters.push(`title:~'${needle}',slug:~'${needle}'`);
  }

  const query: Record<string, any> = {
    include: "tags,authors",
    limit: 100,
  };
  if (filters.length) query.filter = filters.join("+");

  const { items } = await ghostCollection<GhostPost>("posts", query);
  return items;
}

export async function getPostById(id: string): Promise<GhostPost> {
  const body = await ghostFetch<{ posts: GhostPost[] }>(`/posts/${id}/`, {
    include: "tags,authors",
  });
  return body.posts[0];
}

export async function getPostBySlug(slug: string): Promise<GhostPost> {
  const body = await ghostFetch<{ posts: GhostPost[] }>(`/posts/slug/${slug}/`, {
    include: "tags,authors",
  });
  return body.posts[0];
}

// === CATEGORIES (mapped to Ghost tags) ===
// Ghost has no categories. These helpers return tags, filtered to public
// (non-internal, i.e. not `#`-prefixed) so they behave like categories.
export async function getAllCategories(): Promise<GhostCategory[]> {
  const { items } = await ghostCollection<GhostTag>("tags", {
    limit: "all",
    filter: "visibility:public",
    include: "count.posts",
  });
  return items;
}

export async function getCategoryById(id: string): Promise<GhostCategory> {
  const body = await ghostFetch<{ tags: GhostTag[] }>(`/tags/${id}/`, {
    include: "count.posts",
  });
  return body.tags[0];
}

export async function getCategoryBySlug(slug: string): Promise<GhostCategory> {
  const body = await ghostFetch<{ tags: GhostTag[] }>(`/tags/slug/${slug}/`, {
    include: "count.posts",
  });
  return body.tags[0];
}

export async function getPostsByCategory(categoryId: string): Promise<GhostPost[]> {
  const { items } = await ghostCollection<GhostPost>("posts", {
    include: "tags,authors",
    filter: `tags.id:${categoryId}`,
    limit: 100,
  });
  return items;
}

export async function getPostsByCategoryPaginated(
  categoryId: string,
  page = 1,
  perPage = 9
): Promise<GhostResponse<GhostPost[]>> {
  const { items, pagination } = await ghostCollection<GhostPost>(
    "posts",
    {
      include: "tags,authors",
      filter: `tags.id:${categoryId}`,
      limit: perPage,
      page,
    },
    { tags: ["ghost", `category-${categoryId}`, `posts-page-${page}`] }
  );
  return {
    data: items,
    meta: {
      pagination: pagination ?? {
        page,
        limit: perPage,
        pages: 1,
        total: items.length,
        next: null,
        prev: null,
      },
    },
  };
}

// === TAGS ===
export async function getAllTags(): Promise<GhostTag[]> {
  const { items } = await ghostCollection<GhostTag>("tags", {
    limit: "all",
    filter: "visibility:public",
    include: "count.posts",
  });
  return items;
}

export async function getTagById(id: string): Promise<GhostTag> {
  const body = await ghostFetch<{ tags: GhostTag[] }>(`/tags/${id}/`, {
    include: "count.posts",
  });
  return body.tags[0];
}

export async function getTagBySlug(slug: string): Promise<GhostTag> {
  const body = await ghostFetch<{ tags: GhostTag[] }>(`/tags/slug/${slug}/`, {
    include: "count.posts",
  });
  return body.tags[0];
}

export async function getPostsByTag(tagId: string): Promise<GhostPost[]> {
  const { items } = await ghostCollection<GhostPost>("posts", {
    include: "tags,authors",
    filter: `tags.id:${tagId}`,
    limit: 100,
  });
  return items;
}

export async function getPostsByTagPaginated(
  tagId: string,
  page = 1,
  perPage = 9
): Promise<GhostResponse<GhostPost[]>> {
  const { items, pagination } = await ghostCollection<GhostPost>(
    "posts",
    {
      include: "tags,authors",
      filter: `tags.id:${tagId}`,
      limit: perPage,
      page,
    },
    { tags: ["ghost", `tag-${tagId}`, `posts-page-${page}`] }
  );
  return {
    data: items,
    meta: {
      pagination: pagination ?? {
        page,
        limit: perPage,
        pages: 1,
        total: items.length,
        next: null,
        prev: null,
      },
    },
  };
}

// === AUTHORS ===
export async function getAllAuthors(): Promise<GhostAuthor[]> {
  const { items } = await ghostCollection<GhostAuthor>("authors", {
    limit: "all",
    include: "count.posts",
  });
  return items;
}

export async function getAuthorById(id: string): Promise<GhostAuthor> {
  const body = await ghostFetch<{ authors: GhostAuthor[] }>(`/authors/${id}/`, {
    include: "count.posts",
  });
  return body.authors[0];
}

export async function getAuthorBySlug(slug: string): Promise<GhostAuthor> {
  const body = await ghostFetch<{ authors: GhostAuthor[] }>(`/authors/slug/${slug}/`, {
    include: "count.posts",
  });
  return body.authors[0];
}

export async function getPostsByAuthor(authorId: string): Promise<GhostPost[]> {
  const { items } = await ghostCollection<GhostPost>("posts", {
    include: "tags,authors",
    filter: `authors.id:${authorId}`,
    limit: 100,
  });
  return items;
}

export async function getPostsByAuthorPaginated(
  authorId: string,
  page = 1,
  perPage = 9
): Promise<GhostResponse<GhostPost[]>> {
  const { items, pagination } = await ghostCollection<GhostPost>(
    "posts",
    {
      include: "tags,authors",
      filter: `authors.id:${authorId}`,
      limit: perPage,
      page,
    },
    { tags: ["ghost", `author-${authorId}`, `posts-page-${page}`] }
  );
  return {
    data: items,
    meta: {
      pagination: pagination ?? {
        page,
        limit: perPage,
        pages: 1,
        total: items.length,
        next: null,
        prev: null,
      },
    },
  };
}

// === PAGES ===
export async function getAllPages(): Promise<GhostPage[]> {
  const { items } = await ghostCollection<GhostPage>("pages", {
    include: "tags,authors",
    limit: "all",
  });
  return items;
}

export async function getPageById(id: string): Promise<GhostPage> {
  const body = await ghostFetch<{ pages: GhostPage[] }>(`/pages/${id}/`, {
    include: "tags,authors",
  });
  return body.pages[0];
}

export async function getPageBySlug(slug: string): Promise<GhostPage> {
  const body = await ghostFetch<{ pages: GhostPage[] }>(`/pages/slug/${slug}/`, {
    include: "tags,authors",
  });
  return body.pages[0];
}

// === MEDIA ===
// Ghost has no separate media endpoint. Images live as URL fields on posts,
// tags, and authors (e.g. `feature_image`). This helper is kept for API
// parity and simply wraps the URL into a minimal shape.
export async function getFeaturedMediaById(
  src: string
): Promise<{ source_url: string }> {
  return { source_url: src };
}

// === SEARCH (tag / author autocompletes) ===
// Ghost Content API has no search endpoint. These match the title/name field
// with NQL `~` (contains). Good enough for filter UIs; for real search, plug
// in an external index (Algolia, Typesense, etc.).
export async function searchCategories(query: string): Promise<GhostCategory[]> {
  const needle = query.replace(/'/g, "");
  const { items } = await ghostCollection<GhostTag>("tags", {
    limit: 100,
    filter: `visibility:public+name:~'${needle}'`,
    include: "count.posts",
  });
  return items;
}

export async function searchTags(query: string): Promise<GhostTag[]> {
  return searchCategories(query);
}

export async function searchAuthors(query: string): Promise<GhostAuthor[]> {
  const needle = query.replace(/'/g, "");
  const { items } = await ghostCollection<GhostAuthor>("authors", {
    limit: 100,
    filter: `name:~'${needle}'`,
    include: "count.posts",
  });
  return items;
}

// === STATIC GENERATION ===
export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  const all: { slug: string }[] = [];
  let page = 1;

  while (true) {
    const { items, pagination } = await ghostCollection<GhostPost>("posts", {
      limit: 100,
      page,
      fields: "slug",
    });
    all.push(...items.map((p) => ({ slug: p.slug })));
    if (!pagination || page >= pagination.pages) break;
    page++;
  }

  return all;
}

// Helper: Get posts by slug-based taxonomy
export async function getPostsByCategorySlug(categorySlug: string): Promise<GhostPost[]> {
  const { items } = await ghostCollection<GhostPost>("posts", {
    include: "tags,authors",
    filter: `tags.slug:${categorySlug}`,
    limit: 100,
  });
  return items;
}

export async function getPostsByTagSlug(tagSlug: string): Promise<GhostPost[]> {
  const { items } = await ghostCollection<GhostPost>("posts", {
    include: "tags,authors",
    filter: `tags.slug:${tagSlug}`,
    limit: 100,
  });
  return items;
}

export async function getPostsByAuthorSlug(authorSlug: string): Promise<GhostPost[]> {
  const { items } = await ghostCollection<GhostPost>("posts", {
    include: "tags,authors",
    filter: `authors.slug:${authorSlug}`,
    limit: 100,
  });
  return items;
}
