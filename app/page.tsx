import GradientBackground from "@/components/GradientBackground";
import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import ThreePillars from "@/components/ThreePillars";
import UpcomingEvents from "@/components/UpcomingEvents";

export default function Home() {
  return (
    <>
      <Hero />
      <GradientBackground>
        <Mission />
        <ThreePillars />
        <UpcomingEvents />
      </GradientBackground>
    </>
  );
}
