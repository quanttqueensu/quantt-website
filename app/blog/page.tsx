import type { Metadata } from "next";
import GradientBackground from "@/components/GradientBackground";
import SectionLabel from "@/components/SectionLabel";
import ScrollReveal from "@/components/ScrollReveal";
import BlogCard from "@/components/BlogCard";
import { getBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — QUANTT",
  description: "Articles and insights from the QUANTT team on quantitative finance.",
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <GradientBackground variant="short">
      <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
        <ScrollReveal>
          <SectionLabel><span className="text-blue-light">Insights</span></SectionLabel>
          <h1 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">Blog</h1>
        </ScrollReveal>

        {posts.length > 0 ? (
          <div className="mt-10 space-y-4">
            {posts.map((post) => (<BlogCard key={post.slug} post={post} />))}
          </div>
        ) : (
          <p className="mt-10 text-sm text-white/50">No posts yet — check back soon.</p>
        )}
      </div>
    </GradientBackground>
  );
}
