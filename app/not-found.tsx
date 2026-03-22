import Link from "next/link";
import GradientBackground from "@/components/GradientBackground";

export default function NotFound() {
  return (
    <GradientBackground variant="short">
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-7xl font-bold text-white/20">404</p>
        <h1 className="mt-4 font-heading text-2xl font-bold text-white">Page Not Found</h1>
        <p className="mt-2 text-sm text-white/60">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="mt-6 rounded bg-primary px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary/80">Back to Home</Link>
      </div>
    </GradientBackground>
  );
}
