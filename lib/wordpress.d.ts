// lib/wordpress.d.ts

// --- Existing interfaces ---
interface WPEntity {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  link: string;
  guid: { rendered: string };
}

interface RenderedContent {
  rendered: string;
  protected: boolean;
}

interface RenderedTitle {
  rendered: string;
}

interface MediaSize {
  file: string;
  width: number;
  height: number;
  mime_type: string;
  source_url: string;
}

interface MediaDetails {
  width: number;
  height: number;
  file: string;
  sizes: Record<string, MediaSize>;
}

export interface FeaturedMedia extends WPEntity {
  title: RenderedTitle;
  author: number;
  caption: { rendered: string };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: MediaDetails;
  source_url: string;
}

export interface Author {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: Record<string, string>;
}

interface Taxonomy {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
}

// --- Add Embedded Types ---
interface EmbeddedAuthor {
  "wp:author": Author[];
}

interface EmbeddedMedia {
  "wp:featuredmedia": FeaturedMedia[];
}

interface EmbeddedTerms {
  "wp:term": Array<Array<Taxonomy>>; // [[categories], [tags]]
}

// --- Main Post Type with _embedded ---
export interface Post extends WPEntity {
  title: RenderedTitle;
  content: RenderedContent;
  excerpt: RenderedContent;
  author: number;
  featured_media: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  sticky: boolean;
  template: string;
  format:
    | "standard"
    | "aside"
    | "chat"
    | "gallery"
    | "link"
    | "image"
    | "quote"
    | "status"
    | "video"
    | "audio";
  categories: number[];
  tags: number[];

  // Add _embedded
  _embedded?: EmbeddedAuthor & EmbeddedMedia & EmbeddedTerms;
}

// --- Page Type (optional) ---
export interface Page extends WPEntity {
  title: RenderedTitle;
  content: RenderedContent;
  excerpt: RenderedContent;
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  template: string;
  _embedded?: EmbeddedAuthor & EmbeddedMedia;
}

// --- Category & Tag ---
export interface Category extends Taxonomy {
  taxonomy: "category";
  parent: number;
}

export interface Tag extends Taxonomy {
  taxonomy: "post_tag";
}