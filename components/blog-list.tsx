"use client";

import { useMemo, useState } from "react";

import { Section, Container } from "../components/craft";
import { PostCard } from "./post-card";
import { SearchInput } from "./search-input";
import { IndexlyPost } from "../types";
import { Button } from "../components/ui/button";
import { blogConfig } from "../lib/blog-config";

type BlogListProps = {
  posts: IndexlyPost[];
  currentPage?: number;
  totalPages?: number;
  siteId?: string;
  brandName?: string;
  brandDescription?: string;
  onPageChange?: (page: number) => void;
  createPageUrl?: (page: number) => string;
};

export function BlogList({
  posts,
  currentPage = 1,
  totalPages = 1,
  brandName = blogConfig.brandName,
  brandDescription = blogConfig.brandDescription,
  onPageChange,
  createPageUrl,
}: BlogListProps) {
  const [search, setSearch] = useState("");

  const filteredPosts = useMemo(() => {
    if (!search.trim()) return posts;

    const query = search.toLowerCase();

    return posts.filter((post) =>
      [post.selectedTitle, post.topic, post.excerpt]
        .filter(Boolean)
        .some((value) =>
          value?.toLowerCase().includes(query)
        )
    );
  }, [posts, search]);

  return (
    <Section>
      <Container>
        <div className="space-y-12">
          {/* Hero */}
          <div className="text-center max-w-5xl mx-auto pt-8 pb-4 space-y-4">
            <h1 className="font-display text-4xl md:text-5xl/14 tracking-tight text-pretty text-olive-950">
              {brandName} Blog
            </h1>
            <p className="text-base/7 text-olive-700">
              {brandDescription}
            </p>
            <div className="max-w-5xl mx-auto pt-2">
              <SearchInput
                placeholder="Search posts..."
                onChange={setSearch}
              />
            </div>
          </div>

          {/* Post grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="h-24 w-full border rounded-lg bg-accent/25 flex items-center justify-center">
              <p>No posts found</p>
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6">
              {currentPage > 1 && (
                createPageUrl ? (
                  <Button asChild variant="outline">
                    <a href={createPageUrl(currentPage - 1)}>
                      Previous
                    </a>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => onPageChange?.(currentPage - 1)}
                  >
                    Previous
                  </Button>
                )
              )}

              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>

              {currentPage < totalPages && (
                createPageUrl ? (
                  <Button asChild variant="outline">
                    <a href={createPageUrl(currentPage + 1)}>
                      Next
                    </a>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => onPageChange?.(currentPage + 1)}
                  >
                    Next
                  </Button>
                )
              )}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
