"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import type { GhostTag, GhostAuthor } from "@/lib/ghost.d";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterPosts } from "@/components/posts/filter";

interface FilterPillsProps {
  tags: GhostTag[];
  authors: GhostAuthor[];
  categories: GhostTag[];
  selectedTag?: string;
  selectedCategory?: string;
  selectedAuthor?: string;
  pillCount?: number;
}

export function FilterPills({
  tags,
  authors,
  categories,
  selectedTag,
  selectedCategory,
  selectedAuthor,
  pillCount = 8,
}: FilterPillsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const topTags = [...tags]
    .sort((a, b) => (b.count?.posts ?? 0) - (a.count?.posts ?? 0))
    .slice(0, pillCount);

  const selectPill = (tagId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (tagId) {
      params.set("tag", tagId);
    } else {
      params.delete("tag");
      params.delete("category");
    }
    const qs = params.toString();
    router.push(qs ? `?${qs}` : "?");
  };

  const activePill = selectedTag ?? selectedCategory ?? null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1 min-w-0">
        <PillButton active={!activePill} onClick={() => selectPill(null)}>
          Latest
        </PillButton>
        {topTags.map((tag) => (
          <PillButton
            key={tag.id}
            active={activePill === tag.id}
            onClick={() => selectPill(tag.id)}
          >
            {tag.name}
          </PillButton>
        ))}
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium whitespace-nowrap hover:bg-accent transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            More filters
          </button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="mb-6">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="space-y-4">
            <FilterPosts
              authors={authors}
              tags={tags}
              categories={categories}
              selectedAuthor={selectedAuthor}
              selectedTag={selectedTag}
              selectedCategory={selectedCategory}
            />
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:underline"
            >
              Reset all filters
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function PillButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-transparent hover:bg-accent"
      )}
    >
      {children}
    </button>
  );
}
