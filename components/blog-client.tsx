"use client";

import { useRouter } from "next/navigation";
import { BlogList } from "./blog-list";

export default function BlogPageClient(props: any) {
  const router = useRouter();

  return (
    <BlogList
      {...props}
      onPageChange={(page) => {
        router.push(
          page === 1
            ? "/blog"
            : `/blog?page=${page}`
        );
      }}
    />
  );
}