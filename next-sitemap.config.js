/** @type {import('next-sitemap').IConfig} */
const siteDomain = process.env.BLOG_SITE_DOMAIN || "";

module.exports = {
  siteUrl: siteDomain.endsWith("/") ? siteDomain : `${siteDomain}/`,
  generateRobotsTxt: true,
};
