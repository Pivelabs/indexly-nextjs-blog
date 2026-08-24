// app/blog/[id]/page.tsx

import { BlogPost } from "@/components/blog-post";
import { notFound } from "next/navigation";
import { fetchPostDetails } from "../../../lib/indexly";

type Props = {
  params: Promise<{
    identifier: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { identifier } = await params;

  const post = await fetchPostDetails(
    process.env.INDEXLY_API_KEY!,
    identifier,
    process.env.INDEXLY_API_URL! || "https://app.indexly.ai",
    process.env.INDEXLY_SITE_ID
  );

  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
}