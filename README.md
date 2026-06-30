# Indexly Sample Blog

Make your [Indexly](https://indexly.ai) generated articles show up as your own blog.


## Prerequisites

- Node.js v18+
- pnpm
- Indexly API key and site ID

## Setup

### 1. Clone the repository

```bash
git clone git@github.com:Pivelabs/indexly-sample-blog.git
cd indexly-sample-blog
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in your `.env` file:

```env
# Indexly API
INDEXLY_API_KEY=your-api-key-here
INDEXLY_SITE_ID=your-site-id-here
INDEXLY_API_URL=https://app.indexly.ai

# Site & SEO
BLOG_SITE_DOMAIN=https://blog.yourcompany.com
BLOG_BRAND_NAME=Acme Corp
BLOG_META_DESCRIPTION=Insights and updates from Acme Corp

# Branding
BLOG_BRAND_DESCRIPTION=Welcome to the Acme Corp blog.
BLOG_LOGO_URL=https://blog.yourcompany.com/logo.png
BLOG_WEBSITE_URL=https://yourcompany.com
BLOG_SIGNUP_URL=https://yourcompany.com/get-started

# Optional CTA
BLOG_CTA_HEADING=Try Acme Corp today
BLOG_CTA_SUBTITLE=Get started in minutes.
BLOG_DEMO_URL=https://yourcompany.com/demo
```

| Variable | Required | Description |
|----------|----------|-------------|
| `INDEXLY_API_KEY` | Yes | Indexly API key |
| `INDEXLY_SITE_ID` | Yes | Indexly site ID |
| `INDEXLY_API_URL` | No | Defaults to `https://app.indexly.ai` |
| `BLOG_SITE_DOMAIN` | Yes | Your deployed blog URL |
| `BLOG_BRAND_NAME` | Yes | Brand name for title, nav, and footer |
| `BLOG_META_DESCRIPTION` | Yes | SEO meta description |
| `BLOG_BRAND_DESCRIPTION` | No | Intro text on the blog listing page |
| `BLOG_LOGO_URL` | No | Logo URL for nav and sidebar CTA |
| `BLOG_WEBSITE_URL` | No | Main website link |
| `BLOG_SIGNUP_URL` | No | Primary CTA link |
| `BLOG_CTA_HEADING` | No | Sidebar CTA headline |
| `BLOG_CTA_SUBTITLE` | No | Sidebar CTA subtitle |
| `BLOG_DEMO_URL` | No | Demo button link |

### 4. Add favicon and logo

**Favicon** — add `favicon.ico` to `app/favicon.ico` or `public/favicon.ico`.

**Logo** — set `BLOG_LOGO_URL` in `.env`. If not set, the app uses `{BLOG_SITE_DOMAIN}/favicon.ico`.

### 5. Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Deploy

```bash
pnpm build
pnpm start
```

Deploy to your hosting provider (e.g. Vercel):

1. Import the repository.
2. Add all environment variables from your `.env` file.
3. Set `BLOG_SITE_DOMAIN` to your production URL.
4. Deploy.
