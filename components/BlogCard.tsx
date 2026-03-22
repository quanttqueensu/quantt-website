import Link from "next/link";
import Image from "next/image";
import type { BlogPostMeta } from "@/lib/blog";

export default function BlogCard({ post }: { post: BlogPostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block overflow-hidden rounded-lg border border-white/10 bg-white/[0.07] backdrop-blur-md transition-transform hover:-translate-y-0.5">
      {post.coverImage && (
        <div className="relative h-40 w-full">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 700px" />
        </div>
      )}
      <div className="p-5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-light">
          {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
        <h3 className="mt-2 text-base font-semibold text-white group-hover:text-blue-light">{post.title}</h3>
        <p className="mt-1 text-xs text-white/60">{post.excerpt}</p>
        <p className="mt-3 text-[10px] text-white/40">By {post.author}</p>
      </div>
    </Link>
  );
}
