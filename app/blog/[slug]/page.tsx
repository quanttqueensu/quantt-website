import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { formatPostDate } from "@/components/BlogCard";
import { getBlogPost, getBlogSlugs } from "@/lib/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

// Static export: every post is built ahead of time; any other slug is the 404 page.
export const dynamicParams = false;

export async function generateStaticParams() {
  // Static export refuses an empty list, so with no posts yet one placeholder is built; it renders the 404 page.
  const slugs = getBlogSlugs();
  return (slugs.length ? slugs : ["none"]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — QUANTT Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <article className="cs-intro">
      <div className="cs-wrap">
        <div className="cs-grid cs-split">
          <h1 className="cs-h2">{post.title}</h1>
          <p className="cs-meta cs-byline !mb-0 self-end">
            <span>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            </span>
            <span>{post.author}</span>
          </p>
        </div>
        <div className="cs-section">
          <div className="prose prose-lg max-w-[65ch] prose-headings:font-normal prose-headings:tracking-[-0.02em] prose-headings:text-ink prose-p:text-body prose-a:text-blue-link prose-strong:font-medium prose-strong:text-ink prose-li:text-body prose-code:text-ink prose-blockquote:border-blue prose-blockquote:text-ink prose-pre:rounded-none prose-pre:bg-panel prose-pre:text-ink prose-img:rounded-none">
            <MDXRemote source={post.content} />
          </div>
        </div>
      </div>
    </article>
  );
}
