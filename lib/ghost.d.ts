// lib/ghost.d.ts
// Native Ghost Content API types.
// Docs: https://ghost.org/docs/content-api/

export type GhostVisibility = "public" | "members" | "paid" | "tiers";

export interface GhostTag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  feature_image: string | null;
  visibility: GhostVisibility;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  og_title: string | null;
  og_description: string | null;
  twitter_image: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  codeinjection_head: string | null;
  codeinjection_foot: string | null;
  canonical_url: string | null;
  accent_color: string | null;
  url: string;
  count?: { posts: number };
}

export interface GhostAuthor {
  id: string;
  name: string;
  slug: string;
  profile_image: string | null;
  cover_image: string | null;
  bio: string | null;
  website: string | null;
  location: string | null;
  facebook: string | null;
  twitter: string | null;
  meta_title: string | null;
  meta_description: string | null;
  url: string;
  count?: { posts: number };
}

export interface GhostPost {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  html: string;
  plaintext?: string;
  comment_id: string;
  feature_image: string | null;
  feature_image_alt: string | null;
  feature_image_caption: string | null;
  featured: boolean;
  visibility: GhostVisibility;
  created_at: string;
  updated_at: string;
  published_at: string;
  custom_excerpt: string | null;
  codeinjection_head: string | null;
  codeinjection_foot: string | null;
  custom_template: string | null;
  canonical_url: string | null;
  url: string;
  excerpt: string;
  reading_time: number;
  access: boolean;
  og_image: string | null;
  og_title: string | null;
  og_description: string | null;
  twitter_image: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  tags?: GhostTag[];
  authors?: GhostAuthor[];
  primary_author?: GhostAuthor | null;
  primary_tag?: GhostTag | null;
}

// Ghost has no separate "Page" vs "Post" at the data shape level;
// /pages/ returns the same structure as /posts/.
export type GhostPage = GhostPost;

// Ghost has no categories — tags serve both roles.
// We alias GhostCategory to GhostTag so category-style consumers can work
// against a stable type while the underlying data comes from /tags/.
export type GhostCategory = GhostTag;

export interface GhostPagination {
  page: number;
  limit: number;
  pages: number;
  total: number;
  next: number | null;
  prev: number | null;
}

export interface GhostMeta {
  pagination: GhostPagination;
}

export interface GhostResponse<T> {
  data: T;
  meta: GhostMeta;
}
