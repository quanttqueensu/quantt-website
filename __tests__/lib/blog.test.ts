import { describe, it, expect } from "vitest";
import { getBlogPosts, getBlogPost, getBlogSlugs } from "@/lib/blog";

describe("blog loading", () => {
  it("returns array of blog posts sorted by date descending", () => {
    const posts = getBlogPosts();
    expect(Array.isArray(posts)).toBe(true);
    if (posts.length > 1) {
      const d1 = new Date(posts[0].date).getTime();
      const d2 = new Date(posts[1].date).getTime();
      expect(d1).toBeGreaterThanOrEqual(d2);
    }
  });

  it("returns blog slugs", () => {
    const slugs = getBlogSlugs();
    expect(Array.isArray(slugs)).toBe(true);
    slugs.forEach((slug) => {
      expect(slug).not.toContain(".mdx");
      expect(slug).not.toContain(".md");
    });
  });

  it("loads individual blog post by slug", () => {
    const slugs = getBlogSlugs();
    if (slugs.length > 0) {
      const post = getBlogPost(slugs[0]);
      expect(post).not.toBeNull();
      expect(post).toHaveProperty("title");
      expect(post).toHaveProperty("content");
    }
  });

  it("returns null for nonexistent slug", () => {
    const post = getBlogPost("this-slug-does-not-exist-xyz");
    expect(post).toBeNull();
  });
});
