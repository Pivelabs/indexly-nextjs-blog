// app/api/ghost-image/route.ts
// Parallel to app/api/wp-image — proxies Ghost-hosted images so callers can go
// through a single /api/ghost-image?src=... URL. Ghost content images are
// public (no auth required), so this exists mostly for caching, CDN control,
// and a consistent transform pipeline.
import { NextResponse } from "next/server";

const GHOST_URL = process.env.GHOST_URL?.replace(/\/+$/, "");

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const src = searchParams.get("src");
  if (!src) return new NextResponse("Missing src", { status: 400 });

  const absolute = /^https?:\/\//i.test(src)
    ? src
    : `${GHOST_URL ?? ""}${src.startsWith("/") ? "" : "/"}${src}`;

  const res = await fetch(absolute);
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
