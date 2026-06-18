export function calculateReadingTime(content: string, wordsPerMinute = 200) {
  const cleanContent = content
    .replace(/<[^>]*>/g, "")
    .replace(/[#*`_~\[\]]/g, "")
    .replace(/\n+/g, " ")
    .trim();

  const words = cleanContent.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return {
    minutes,
    words,
    text: minutes === 1 ? "1 min read" : `${minutes} min read`,
  };
}

// Responsive YouTube Embeds — matches any iframe whose src is a YouTube URL,
// regardless of class or surrounding <figure> wrapper.
export function makeYouTubeEmbedsResponsive(html: string) {
  return html.replace(
    /<iframe\b[^>]*\bsrc=["']([^"']*(?:youtube\.com\/embed|youtube-nocookie\.com\/embed|youtu\.be)[^"']*)["'][^>]*>[\s\S]*?<\/iframe>/gi,
    (_match, src) => {
      return `<div style="position:relative;width:100%;padding-bottom:56.25%;height:0;overflow:hidden;margin:1.5em 0;"><iframe src="${src}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
    },
  );
}

export function wrapTablesForScroll(html: string) {
  return html.replace(
    /<table\b[\s\S]*?<\/table>/gi,
    (match) =>
      `<div class="w-full overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 my-6">${match}</div>`,
  );
}

// Ensure every anchor opens in a new tab (skips hash-only and already-targeted links)
export function openLinksInNewTab(html: string) {
  return html.replace(/<a\b([^>]*)>/gi, (match, attrs: string) => {
    const hrefMatch = attrs.match(/\bhref\s*=\s*["']([^"']*)["']/i);
    const href = hrefMatch?.[1] ?? "";
    if (!href || href.startsWith("#")) return match;
    if (/\btarget\s*=/i.test(attrs)) return match;
    const existingRel = attrs.match(/\brel\s*=\s*["']([^"']*)["']/i)?.[1];
    const rel = existingRel
      ? Array.from(
          new Set([...existingRel.split(/\s+/), "noopener", "noreferrer"]),
        ).join(" ")
      : "noopener noreferrer";
    const attrsWithoutRel = attrs.replace(/\s+rel\s*=\s*["'][^"']*["']/i, "");
    return `<a${attrsWithoutRel} target="_blank" rel="${rel}">`;
  });
}

export function processContent(content: string) {
  return wrapTablesForScroll(
    openLinksInNewTab(makeYouTubeEmbedsResponsive(content)),
  );
}