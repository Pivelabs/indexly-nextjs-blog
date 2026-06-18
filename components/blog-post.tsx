import { calculateReadingTime, processContent } from "../lib/processors";
import { IndexlyPost } from "../types";
import { Article } from "./craft";
import Toc from "./ui/TOC";
import ShareButtons from "./ShareButtons";

type BlogPostProps = {
    post: IndexlyPost
}

export function BlogPost({ post }: BlogPostProps) {
    const readingTime = calculateReadingTime(post.content ?? "");
    const date = new Date(
        post.updatedAt ?? post.createdAt,
    ).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const featuredImageUrl = post.heroImage ?? null;

    if(!post) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Post not found or cannot load the post at this moment
            </div>
        )
    }

    return (
        <>
            <div className="text-center max-w-6xl mx-auto px-4 sm:px-6 pt-10 space-y-2 not-prose">
                <nav aria-label="Breadcrumb" className="flex justify-left pb-4">
                    <a
                        href="/"
                        className="justify-left text-olive-500 hover:text-olive-950 transition-colors !no-underline !decoration-transparent"
                    >
                        &lt; All posts
                    </a>
                </nav>
                <h1 className="font-display text-4xl/4 font-medium leading-normal text-pretty text-olive-950">
                    {post.selectedTitle || post.topic || "Untitled Post"}
                </h1>
                {post.excerpt && (
                    <p className="max-w-2xl mx-auto text-base/7 text-olive-600 text-pretty">
                        {post.excerpt.replace(/<[^>]*>/g, "").trim()}
                    </p>
                )}
                <div className="flex flex-wrap justify-center items-center gap-x-3 text-sm text-olive-500">
                    {/* <span className="inline-flex items-center gap-2">
          {author?.profile_image ? (
            <img
              src={author.profile_image}
              alt={author.name}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover"
              style={{ borderRadius: "100%" }}
              loading="lazy"
            />
          ) : (
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-olive-200 text-xs font-medium text-olive-700">
              {(author?.name ?? "I").slice(0, 1).toUpperCase()}
            </span>
          )}
          <span>By {author?.name || "Indexly"}</span>
        </span> */}
                    <span aria-hidden="true">·</span>
                    <span>Updated {date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{readingTime.text}</span>
                </div>
            </div>
            
            <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-20">
                            <Toc />
                        </div>
                    </aside>

                    <div className="min-w-0 col-span-1 lg:col-span-6">
                        {/* Featured Image */}
                        {featuredImageUrl && (
                            <div className="-mx-4 sm:-mx-6 lg:mx-0 overflow-hidden lg:rounded-lg bg-accent/25">
                                <img
                                    src={featuredImageUrl}
                                    alt={post.selectedTitle || post.topic || "Post Image"}
                                    width={1200}
                                    height={600}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}

                        {/* Article Body */}
                        <Article
                            dangerouslySetInnerHTML={{
                                __html: processContent(post.content ?? ""),
                            }}
                            className="w-full max-w-full prose-olive prose-headings:font-display prose-headings:tracking-tight prose-headings:text-olive-950 prose-p:text-olive-700 prose-p:text-base/7 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-a:!no-underline prose-strong:text-olive-950 prose-h2:border-b prose-h2:border-olive-200/70 prose-h2:pb-3 [&_img]:w-full [&_img]:h-auto [&_iframe]:max-w-full [&_pre]:overflow-x-auto [&_figure]:!max-w-none [&_figure]:!w-full [&_figure]:mx-0 [&_.kg-embed-card]:!w-full"
                        />
                    </div>

                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-20 space-y-6">
                            <ShareButtons
                                url=""
                                title={post.selectedTitle || post.topic || "Untitled Post"}
                                summary={post.excerpt ?? ""}
                            />
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}
