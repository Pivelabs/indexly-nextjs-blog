// lib/blog-config.ts

export const blogConfig = {
  brandName: process.env.BLOG_BRAND_NAME || "Indexly",
  brandDescription: process.env.BLOG_BRAND_DESCRIPTION || "Welcome to the Indexly blog, where we share insights, updates, and stories about our journey in building a powerful knowledge graph platform. Stay tuned for the latest news, tips, and best practices to help you get the most out of Indexly!",
  logoUrl: process.env.BLOG_LOGO_URL || "",
  websiteUrl: process.env.BLOG_WEBSITE_URL || "https://app.indexly.ai",
  signupUrl: process.env.BLOG_SIGNUP_URL || "https://app.indexly.ai/register",
};