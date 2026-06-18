import { MetadataRoute } from "next";
import { getAllPostsForSitemap, getAllPages } from "@/lib/ghost";
import { siteConfig } from "@/site.config";
import type { GhostPost } from "@/lib/ghost.d";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.site_domain}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  try {
    // Use the dedicated sitemap function
    const posts = await getAllPostsForSitemap();
    console.log(`Sitemap: Found ${posts.length} posts`);

    const postUrls: MetadataRoute.Sitemap = posts.map((post: GhostPost) => ({
      url: `${siteConfig.site_domain}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    // Get all pages
    let pageUrls: MetadataRoute.Sitemap = [];
    try {
      const pages = await getAllPages();
      pageUrls = pages.map((page: any) => ({
        url: `${siteConfig.site_domain}/blog/pages/${page.slug}`,
        lastModified: new Date(page.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    } catch (error) {
      console.warn('Could not fetch pages for sitemap:', error);
    }

    console.log(`Sitemap: Generated ${postUrls.length} post URLs`);
    return [...staticUrls, ...postUrls, ...pageUrls];

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticUrls;
  }
}