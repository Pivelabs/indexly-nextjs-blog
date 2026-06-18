// app/blog/page.tsx

import { fetchPosts } from "../../lib/indexly";
import BlogPageClient from "../../components/blog-client";
import { blogConfig } from "../../lib/blog-config";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");

  const response = await fetchPosts({
    apiKey: process.env.INDEXLY_API_KEY!,
    apiBaseUrl:
      process.env.INDEXLY_API_URL! || "https://app.indexly.ai",
      siteId: process.env.INDEXLY_SITE_ID || "",
    page,
  });

  return (
    <BlogPageClient
      posts={response.data}
      currentPage={response.pagination.page}
      totalPages={response.pagination.pages}
      brandName={blogConfig.brandName}
      brandDescription={blogConfig.brandDescription}
    />
  );
}