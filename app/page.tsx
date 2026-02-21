import AboutSection from "@/components/sections/AboutSection";
import LinksSection from "@/components/sections/LinksSection";
import BadgesSection from "@/components/sections/BadgesSection";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function Home() {
  return (
    <div className="max-w-[680px] mx-auto px-4 py-4 space-y-6">
      <AnimatedSection delay={0}>
        <AboutSection />
      </AnimatedSection>
      <AnimatedSection delay={0.1}>
        <LinksSection />
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
        <BadgesSection />
      </AnimatedSection>
    </div>
  );
}
