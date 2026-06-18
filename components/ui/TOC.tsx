"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TocItem = {
  id: string;
  text: string;
  children: { id: string; text: string }[];
};

export default function Toc() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeH2, setActiveH2] = useState<string | null>(null);
  const [activeH3, setActiveH3] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const onHashChange = () => {
      window.scrollTo(window.scrollX, window.scrollY - 200);
    };
    window.addEventListener("hashchange", onHashChange);

    const onScroll = () => {
      setIsVisible(
        window.innerHeight + window.scrollY <=
          0.99 * document.body.clientHeight
      );
    };
    document.addEventListener("scroll", onScroll, { passive: true });

    const headings = Array.from(
      document.querySelectorAll<HTMLHeadingElement>("article h2, article h3")
    );

    const tree: TocItem[] = [];
    let currentH2: TocItem | null = null;
    let h2Count = 0;
    let h3Count = 0;

    headings.forEach((h) => {
      h.classList.add("scroll-mt-24");
      if (h.tagName === "H2") {
        const id = h.id || `indexly-h2-${h2Count++}`;
        h.id = id;
        currentH2 = { id, text: h.textContent || "", children: [] };
        tree.push(currentH2);
      } else if (h.tagName === "H3" && currentH2) {
        const id = h.id || `indexly-h3-${h3Count++}`;
        h.id = id;
        currentH2.children.push({ id, text: h.textContent || "" });
      }
    });

    setToc(tree);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top
          );
        if (visible.length === 0) return;
        const top = visible[0].target as HTMLElement;
        if (top.tagName === "H2") {
          setActiveH2(top.id);
          setActiveH3(null);
        } else if (top.tagName === "H3") {
          setActiveH3(top.id);
          const parent = tree.find((t) =>
            t.children.some((c) => c.id === top.id)
          );
          if (parent) setActiveH2(parent.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  if (!isVisible || toc.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="w-[250px] text-left p-4"
    >
      <div className="text-xs font-semibold uppercase tracking-wide text-olive-500 mb-3">
        On this page
      </div>
      <ul className="space-y-2 border-l border-olive-200 !pl-0 list-none [&_li]:!pl-0 [&_li]:before:!hidden [&_li]:before:!content-none">
        {toc.map((h2) => {
          const isActiveH2 = activeH2 === h2.id;
          return (
            <li key={h2.id}>
              <Link
                href={`#${h2.id}`}
                className={cn(
                  "block -ml-px pl-3 border-l text-sm leading-snug transition-colors !no-underline hover:!no-underline [&]:!decoration-transparent",
                  isActiveH2
                    ? "border-olive-950 text-olive-950 font-medium"
                    : "border-transparent text-olive-500 hover:text-olive-950"
                )}
              >
                {h2.text}
              </Link>

              {isActiveH2 && h2.children.length > 0 && (
                <ul className="mt-2 space-y-1.5 !pl-0 list-none">
                  {h2.children.map((h3) => {
                    const isActiveH3 = activeH3 === h3.id;
                    return (
                      <li key={h3.id}>
                        <Link
                          href={`#${h3.id}`}
                          className={cn(
                            "block pl-6 text-[13px] leading-snug transition-colors !no-underline hover:!no-underline [&]:!decoration-transparent",
                            isActiveH3
                              ? "text-olive-950 font-medium"
                              : "text-olive-500 hover:text-olive-800"
                          )}
                        >
                          {h3.text}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
