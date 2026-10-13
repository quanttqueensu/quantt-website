import Image from "next/image";
import type { ReactNode } from "react";

/**
 * A photo slot that can be swapped from content/config.yml (`media:`) without code.
 * With no `src`, it renders its built-in fallback children instead.
 * Square corners and object-cover, per the design system.
 */
export default function MediaSlot({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
  children,
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  children?: ReactNode;
}) {
  if (!src) return <>{children}</>;
  return (
    <div className={`relative overflow-hidden bg-blue ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
