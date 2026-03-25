import GradientBackground from "@/components/GradientBackground";
import Hero from "@/components/Hero";
import HiringBanner from "@/components/HiringBanner";
import Mission from "@/components/Mission";
import ThreePillars from "@/components/ThreePillars";
import UpcomingEvents from "@/components/UpcomingEvents";

export default function Home() {
  return (
    <>
      <Hero />
      <GradientBackground>
        <HiringBanner />
        <Mission />
        <ThreePillars />
        <UpcomingEvents />
      </GradientBackground>
    </>
  );
}
