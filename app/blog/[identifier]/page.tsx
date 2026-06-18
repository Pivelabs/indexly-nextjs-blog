// app/blog/[id]/page.tsx

import { BlogPost } from "@/components/blog-post";
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

  console.log("Fetched post:", post);
  console.log("Post slug:", post.slug);
  console.log("Identifier:", identifier);

  return <BlogPost post={post} />;
}