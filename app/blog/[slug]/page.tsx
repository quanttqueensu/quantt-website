import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import GradientBackground from "@/components/GradientBackground";
import { getBlogPost, getBlogSlugs } from "@/lib/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
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
    <GradientBackground variant="short">
      <article className="mx-auto max-w-3xl px-6 pt-32 pb-20">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-light">
          {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}{" "}
          &middot; {post.author}
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl">{post.title}</h1>

        <div className="prose-sm mt-10 max-w-none prose-headings:font-heading prose-headings:text-text-dark prose-p:text-text-dark-body prose-a:text-blue-light prose-strong:text-text-dark prose-li:text-text-dark-body">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </GradientBackground>
  );
}
