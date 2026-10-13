import type { Metadata } from "next";
import Link from "next/link";
import { formatPostDate } from "@/components/BlogCard";
import { List, PageIntro, Wrap } from "@/components/ui";
import { getBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — QUANTT",
  description: "Articles and insights from the QUANTT team on quantitative finance.",
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <>
      <PageIntro
        title="Notes From the Desks."
        lede={<p>Writing from QUANTT members on the strategies they build and trade.</p>}
      />

      <div className="cs-section">
        <Wrap>
          <section className="cs-panel cs-reveal" aria-labelledby="posts-title">
            <div className="cs-panel__intro">
              <h2 id="posts-title" className="cs-h2 cs-h2--md">
                {posts.length > 0 ? "Latest Posts" : "No Posts Yet"}
              </h2>
              {posts.length === 0 && (
                <p>
                  In the meantime, the{" "}
                  <Link href="/competition" className="cs-link">
                    research papers
                  </Link>{" "}
                  from past project teams are the best place to see our work.
                </p>
              )}
            </div>
            {posts.length > 0 && (
              <List
                items={posts.map((post) => ({
                  href: `/blog/${post.slug}`,
                  title: post.title,
                  byline: [formatPostDate(post.date), post.author],
                }))}
              />
            )}
          </section>
        </Wrap>
      </div>
    </>
  );
}
