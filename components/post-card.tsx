import type { IndexlyPost } from "../types";
import { cn } from "../lib/utils";
import Link from "next/link";
import SmartImage from "./SmartImage";

export function FeaturedPostCard({ post }: { post: IndexlyPost }) {
  const date = new Date(post.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const imageUrl = post.heroImage ?? null;
  const imageAlt = post.selectedTitle || post.topic || "Post Image";
  const category = post.primaryKeyword ?? null;
  // const author = post.primaryAuthor ?? null;

  let url = "";
  if (post.slug) {
    url = `/blog/${post.slug}`;
  } else {
    url = `/blog/${post.id}`;
  }

  return (
    <Link
      href={url}
      className={cn(
        "group grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 not-prose",
        "border border-olive-200 bg-white rounded-xl overflow-hidden p-4 md:p-6",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <div className="relative aspect-[16/10] md:aspect-auto md:h-full w-full overflow-hidden rounded-lg bg-muted">
        {imageUrl ? (
          <SmartImage
            src={imageUrl}
            alt={imageAlt}
            width={1200}
            height={750}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between gap-6">
        <div className="space-y-4">
          {category && (
            <span className="inline-flex rounded-full bg-olive-100 px-3 py-1 text-xs font-medium text-olive-700">
              {category}
            </span>
          )}
          <h2 className="font-display text-2xl md:text-3xl/tight font-medium tracking-tight text-pretty text-olive-950 line-clamp-3">
            {post.selectedTitle || post.topic || "Untitled Post"}
          </h2>
          {post.excerpt && (
            <p className="text-base text-olive-600 tracking-tight text-pretty line-clamp-4">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* <div className="flex items-center gap-3 text-xs text-olive-500">
          {author?.profile_image ? (
            <img
              src={author.profile_image}
              alt={author.name}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
              {(author?.name ?? "?").slice(0, 1).toUpperCase()}
            </span>
          )}
          <span className="truncate">
            {author?.name ?? "Anonymous"}
            <span className="mx-1.5">·</span>
            {date}
          </span>
        </div> */}
      </div>
    </Link>
  );
}

export function PostCard({ post }: { post: IndexlyPost }) {
  const date = new Date(post.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const imageUrl = post.heroImage ?? null;
  const imageAlt = post.selectedTitle || post.topic || "Post Image";
  const category = post.primaryKeyword ?? null;
  // const author = post.primaryAuthor ?? null;

  let url = "";
  if (post.slug) {
  url = `/blog/${post.slug}`;
} else {
  url = `/blog/${post.id}`;
}

  return (
    <Link
      href={url}
      className={cn(
        "group flex flex-col gap-4 not-prose border border-olive-200 p-4 bg-white",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-muted">
        {imageUrl ? (
          <SmartImage
            src={imageUrl}
            alt={imageAlt}
            width={800}
            height={500}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No image
          </div>
        )}
        {category && (
          <span className="absolute top-3 left-3 rounded-full bg-olive-50/95 backdrop-blur px-3 py-1 text-xs font-medium text-olive-950">
            {category}
          </span>
        )}
      </div>

      <h3 className="font-display text-xl/7 font-medium tracking-tight text-pretty text-olive-950 line-clamp-3">
        {post.selectedTitle || post.topic || "Untitled Post"}
      </h3>
      <p className="font-display text-base tracking-tight text-pretty text-olive-500 line-clamp-3">
        {post.excerpt || "Untitled Post"}
      </p>

      {/* <div className="flex items-center gap-3 text-xs text-olive-500 mt-auto">
        {author?.profile_image ? (
          <img
            src={author.profile_image}
            alt={author.name}
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {(author?.name ?? "?").slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="truncate">
          {author?.name ?? "Anonymous"}
          <span className="mx-1.5">·</span>
          {date}
        </span>
      </div> */}
    </Link>
  );
}
