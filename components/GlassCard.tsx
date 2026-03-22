import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
}: GlassCardProps) {
  return (
    <div
      className={`rounded-lg border border-white/10 bg-white/[0.07] backdrop-blur-md ${
        hover
          ? "transition-transform duration-300 hover:-translate-y-0.5 hover:border-white/20"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
