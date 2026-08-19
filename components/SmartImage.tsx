// components/SmartImage.tsx
import Image from "next/image";
import type { ImgHTMLAttributes } from "react";

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
}

/**
 * - Ghost-hosted images (content/images or matching GHOST_HOSTNAME) → proxy
 *   via /api/ghost-image
 * - External URLs → next/image (optimised)
 */
export default function SmartImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  ...rest
}: SmartImageProps) {
  const ghostHost = process.env.NEXT_PUBLIC_GHOST_HOSTNAME || process.env.GHOST_HOSTNAME;
  const needsProxy =
    src.includes("/content/images/") ||
    (ghostHost ? src.includes(ghostHost) : false);

  if (needsProxy) {
    const proxyUrl = `/blog/api/ghost-image?src=${encodeURIComponent(src)}`;
    return (
      <Image
        src={proxyUrl}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={className}
        unoptimized
        {...rest}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      unoptimized
      {...rest}
    />
  );
}