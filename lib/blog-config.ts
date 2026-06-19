// lib/blog-config.ts

export const blogConfig = {
  brandName: process.env.BLOG_BRAND_NAME || "Indexly",
  brandDescription: process.env.BLOG_BRAND_DESCRIPTION || "",
  metaDescription: process.env.BLOG_META_DESCRIPTION || "SEO & AI Visibility Platform",
  logoUrl: process.env.BLOG_LOGO_URL || "",
  websiteUrl: process.env.BLOG_WEBSITE_URL || "https://app.indexly.ai",
  signupUrl: process.env.BLOG_SIGNUP_URL || "https://app.indexly.ai/register",
  ctaHeading: process.env.BLOG_CTA_HEADING || "Boost your AI Visibility",
  ctaSubtitle:
    process.env.BLOG_CTA_SUBTITLE || "Set up in minutes. No credit card required.",
  demoUrl: process.env.BLOG_DEMO_URL || "https://indexly.ai/book-a-demo",
};