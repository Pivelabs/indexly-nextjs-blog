type SiteConfig = {
  site_domain: string;
  site_name: string;
  site_description: string;
};

export const siteConfig: SiteConfig = {
  site_name: process.env.BLOG_BRAND_NAME || "",
  site_description:
    process.env.BLOG_META_DESCRIPTION ||
    "",
  site_domain: process.env.BLOG_SITE_DOMAIN || "",
};
