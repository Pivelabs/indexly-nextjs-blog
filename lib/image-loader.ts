import { ImageLoaderProps } from "next/image";

export default function imageLoader({
  src,
  width,
  quality = 75,
}: ImageLoaderProps): string {
  // Skip proxy for already optimized URLs or external CDNs
  if (src.includes("cdn.")) {
    return src;
  }

  const optimizedWidth = getOptimizedWidth(width);

  const params = new URLSearchParams({
    src,
    w: optimizedWidth.toString(),
    q: Math.min(quality, 85).toString(),
  });

  return `/blog/api/ghost-image?${params.toString()}`;
}

function getOptimizedWidth(requestedWidth: number): number {
  const breakpoints = [320, 640, 750, 828, 1080, 1200, 1920, 2048];
  const optimizedWidth = breakpoints.find((bp) => bp >= requestedWidth);
  return optimizedWidth || requestedWidth;
}
