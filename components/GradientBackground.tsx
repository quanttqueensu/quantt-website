import { ReactNode } from "react";

interface GradientBackgroundProps {
  children: ReactNode;
  variant?: "full" | "short";
  className?: string;
}

export default function GradientBackground({
  children,
  variant = "full",
  className = "",
}: GradientBackgroundProps) {
  const gradients = {
    full: "bg-gradient-to-b from-navy via-blue-mid via-50% to-blue-grey",
    short: "bg-gradient-to-b from-navy via-blue-mid to-blue-grey/80",
  };

  return (
    <div data-gradient className={`relative min-h-screen ${gradients[variant]} ${className}`}>
      {children}
    </div>
  );
}
