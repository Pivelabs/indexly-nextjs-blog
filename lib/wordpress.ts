// lib/wordpress-api.ts
import querystring from "query-string";
import type {
  Post,
  Category,
  Tag,
  Page,
  Author,
  FeaturedMedia,
} from "./wordpress.d";

const WP_URL = process.env.WORDPRESS_URL?.replace(/\/+$/, ""); // e.g. https://wp.mysite.com
const WP_USERNAME = process.env.WP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;
console.log("WP_USERNAME,WP_APP_PASSWORD",process.env.WORDPRESS_USERNAME, process.env.WORDPRESS_APP_PASSWORD )

export function proxyImage(src: string): string {
  if (!src) return "";
  const path = src.replace(WP_URL!, "");
  return `/api/proxy-image?src=${encodeURIComponent(path)}`;
}

if (!WP_URL) {
  throw new Error("WORDPRESS_URL environment variable is not defined");
}
if (!WP_USERNAME || !WP_APP_PASSWORD) {
  throw new Error("WORDPRESS_USERNAME and WORDPRESS_APP_PASSWORD are required for WordPress.org");
}

// Build Basic Auth header (Application Password)
const authHeader = `Basic ${Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString("base64")}`;

// Base API URL
const API_BASE = `${WP_URL}/wp-json/wp/v2`;

// Custom error
export class WordPressAPIError extends Error {
  constructor(message: string, public status: number, public endpoint: string) {
    super(message);
    this.name = "WordPressAPIError";
  }
}

// Pagination headers interface
export interface WordPressPaginationHeaders {
  total: number;
  totalPages: number;
}

export interface WordPressResponse<T> {
  data: T;
  headers: WordPressPaginationHeaders;
}

// Generic fetch with auth + caching
async function wpFetch<T>(
  endpoint: string,
  query?: Record<string, any>,
  cacheOptions?: { tags?: string[]; revalidate?: number }
): Promise<T> {
  const url = `${API_BASE}${endpoint}${query ? `?${querystring.stringify(query)}` : ""}`;
  const tags = cacheOptions?.tags ?? ["wordpress"];
  const revalidate = cacheOptions?.revalidate ?? 3600;

  const response = await fetch(url, {
    headers: {
      Authorization: authHeader,
      "User-Agent": "Next.js Headless WP Client",
      "Content-Type": "application/json",
    },
    next: { tags, revalidate },
  });

  if (!response.ok) {
    let errorMessage = `WordPress API request failed: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.text();
      if (errorBody) errorMessage += ` - ${errorBody}`;
    } catch {}
    throw new WordPressAPIError(errorMessage, response.status, url);
  }

  return response.json() as Promise<T>;
}

// Paginated fetch
async function wpFetchPaginated<T>(
  endpoint: string,
  query?: Record<string, any>,
  cacheTags: string[] = ["wordpress"]
): Promise<WordPressResponse<T>> {
  const url = `${API_BASE}${endpoint}${query ? `?${querystring.stringify(query)}` : ""}`;

  const response = await fetch(url, {
    headers: {
      Authorization: authHeader,
      "User-Agent": "Next.js Headless WP Client",
    },
    next: { tags: cacheTags, revalidate: 3600 },
  });

  if (!response.ok) {
    let errorMessage = `WordPress API request failed: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.text();
      if (errorBody) errorMessage += ` - ${errorBody}`;
    } catch {}
    throw new WordPressAPIError(errorMessage, response.status, url);
  }

  const data = await response.json();

  return {
    data,
    headers: {
      total: parseInt(response.headers.get("X-WP-Total") || "0", 10),
      totalPages: parseInt(response.headers.get("X-WP-TotalPages") || "0", 10),
    },
  };
}

// === POSTS ===
export async function getPostsPaginated(
  page: number = 1,
  perPage: number = 9,
  filterParams?: {
    author?: string;
    tag?: string;
    category?: string;
    search?: string;
  }
): Promise<WordPressResponse<Post[]>> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: perPage,
    page,
  };

  const cacheTags = ["wordpress", "posts", `posts-page-${page}`];

  if (filterParams?.search) {
    query.search = filterParams.search;
    cacheTags.push("posts-search");
  }
  if (filterParams?.author) {
    query.author = filterParams.author;
    cacheTags.push(`posts-author-${filterParams.author}`);
  }
  if (filterParams?.tag) {
    query.tags = filterParams.tag;
    cacheTags.push(`posts-tag-${filterParams.tag}`);
  }
  if (filterParams?.category) {
    query.categories = filterParams.category;
    cacheTags.push(`posts-category-${filterParams.category}`);
  }

  return wpFetchPaginated<Post[]>("/posts", query, cacheTags);
}

// Add this to your wordpress.ts file
export async function getAllPostsForSitemap(): Promise<Post[]> {
  const allPosts: Post[] = [];
  let page = 1;
  let hasMore = true;
  const perPage = 100;

  while (hasMore) {
    const query: Record<string, any> = {
      per_page: perPage,
      page: page,
      status: 'publish',
      _fields: 'id,slug,modified,title', // Only fetch fields we need for sitemap
    };

    try {
      const posts = await wpFetch<Post[]>("/posts", query);
      
      if (!posts || posts.length === 0) {
        hasMore = false;
        break;
      }

      allPosts.push(...posts);

      if (posts.length < perPage) {
        hasMore = false;
      } else {
        page++;
      }

      // Safety check
      if (page > 100) {
        console.warn('getAllPostsForSitemap stopped at page 100');
        hasMore = false;
      }

    } catch (error) {
      console.error(`Error fetching posts page ${page} for sitemap:`, error);
      hasMore = false;
    }
  }

  console.log(`getAllPostsForSitemap: Fetched ${allPosts.length} total posts`);
  return allPosts;
}

export async function getAllPosts(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
}): Promise<Post[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 100,
  };

  if (filterParams?.search) query.search = filterParams.search;
  if (filterParams?.author) query.author = filterParams.author;
  if (filterParams?.tag) query.tags = filterParams.tag;
  if (filterParams?.category) query.categories = filterParams.category;

  return wpFetch<Post[]>("/posts", query);
}

export async function getPostById(id: number): Promise<Post> {
  return wpFetch<Post>(`/posts/${id}`, { _embed: true });
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const posts = await wpFetch<Post[]>("/posts", { slug, _embed: true });
  return posts[0];
}

// === CATEGORIES ===
export async function getAllCategories(): Promise<Category[]> {
  return wpFetch<Category[]>("/categories", { per_page: 100 });
}

export async function getCategoryById(id: number): Promise<Category> {
  return wpFetch<Category>(`/categories/${id}`);
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const cats = await wpFetch<Category[]>("/categories", { slug });
  return cats[0];
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  return wpFetch<Post[]>("/posts", { categories: categoryId, _embed: true });
}

export async function getPostsByCategoryPaginated(
  categoryId: number,
  page = 1,
  perPage = 9
): Promise<WordPressResponse<Post[]>> {
  return wpFetchPaginated<Post[]>("/posts", {
    categories: categoryId,
    _embed: true,
    per_page: perPage,
    page,
  }, ["wordpress", `category-${categoryId}`, `posts-page-${page}`]);
}

// === TAGS ===
export async function getAllTags(): Promise<Tag[]> {
  return wpFetch<Tag[]>("/tags", { per_page: 100 });
}

export async function getTagById(id: number): Promise<Tag> {
  return wpFetch<Tag>(`/tags/${id}`);
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  const tags = await wpFetch<Tag[]>("/tags", { slug });
  return tags[0];
}

export async function getPostsByTag(tagId: number): Promise<Post[]> {
  return wpFetch<Post[]>("/posts", { tags: tagId, _embed: true });
}

export async function getPostsByTagPaginated(
  tagId: number,
  page = 1,
  perPage = 9
): Promise<WordPressResponse<Post[]>> {
  return wpFetchPaginated<Post[]>("/posts", {
    tags: tagId,
    _embed: true,
    per_page: perPage,
    page,
  }, ["wordpress", `tag-${tagId}`, `posts-page-${page}`]);
}

// === AUTHORS ===
export async function getAllAuthors(): Promise<Author[]> {
  return wpFetch<Author[]>("/users", { per_page: 100 });
}

export async function getAuthorById(id: number): Promise<Author> {
  return wpFetch<Author>(`/users/${id}`);
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  const users = await wpFetch<Author[]>("/users", { slug });
  return users[0];
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  return wpFetch<Post[]>("/posts", { author: authorId, _embed: true });
}

export async function getPostsByAuthorPaginated(
  authorId: number,
  page = 1,
  perPage = 9
): Promise<WordPressResponse<Post[]>> {
  return wpFetchPaginated<Post[]>("/posts", {
    author: authorId,
    _embed: true,
    per_page: perPage,
    page,
  }, ["wordpress", `author-${authorId}`, `posts-page-${page}`]);
}

// === PAGES ===
export async function getAllPages(): Promise<Page[]> {
  return wpFetch<Page[]>("/pages", { _embed: true, per_page: 100 });
}

export async function getPageById(id: number): Promise<Page> {
  return wpFetch<Page>(`/pages/${id}`, { _embed: true });
}

export async function getPageBySlug(slug: string): Promise<Page> {
  const pages = await wpFetch<Page[]>("/pages", { slug, _embed: true });
  return pages[0];
}

// === MEDIA ===
export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia> {
  return wpFetch<FeaturedMedia>(`/media/${id}`);
}

// === SEARCH ===
export async function searchCategories(query: string): Promise<Category[]> {
  return wpFetch<Category[]>("/categories", { search: query, per_page: 100 });
}

export async function searchTags(query: string): Promise<Tag[]> {
  return wpFetch<Tag[]>("/tags", { search: query, per_page: 100 });
}

export async function searchAuthors(query: string): Promise<Author[]> {
  return wpFetch<Author[]>("/users", { search: query, per_page: 100 });
}

// === STATIC GENERATION ===
export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  const allSlugs: { slug: string }[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await wpFetchPaginated<Post[]>("/posts", {
      per_page: 100,
      page,
      _fields: "slug",
    }, [`slugs-page-${page}`]);

    allSlugs.push(...response.data.map((post) => ({ slug: post.slug })));
    hasMore = page < response.headers.totalPages;
    page++;
  }

  return allSlugs;
}

// Helper: Get posts by slug-based taxonomy
export async function getPostsByCategorySlug(categorySlug: string): Promise<Post[]> {
  const category = await getCategoryBySlug(categorySlug);
  return getPostsByCategory(category.id);
}

export async function getPostsByTagSlug(tagSlug: string): Promise<Post[]> {
  const tag = await getTagBySlug(tagSlug);
  return getPostsByTag(tag.id);
}

export async function getPostsByAuthorSlug(authorSlug: string): Promise<Post[]> {
  const author = await getAuthorBySlug(authorSlug);
  return getPostsByAuthor(author.id);
}