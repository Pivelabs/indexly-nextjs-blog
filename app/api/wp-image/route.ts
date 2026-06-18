// app/blog/api/wp-image/route.ts
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const src = searchParams.get("src");
  if (!src) return new NextResponse("Missing src", { status: 400 });

  const res = await fetch(src, {
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_APP_PASSWORD}`
      ).toString("base64")}`,
    },
  });

  if (!res.ok) return new NextResponse("Image not found", { status: 404 });

  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") ?? "image/jpeg";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
