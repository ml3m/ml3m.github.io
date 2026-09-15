import Link from "next/link";
import GlowText from "@/components/ui/GlowText";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1
        className="text-[clamp(4rem,15vw,10rem)] font-bold tracking-[0.1em] leading-none mb-2"
        style={{
          color: "transparent",
          WebkitTextStroke: "2px var(--neon-pink)",
          textShadow: "0 0 20px #ff4da6aa, 0 0 40px #cc44ff66",
          fontFamily: "var(--font-mono)",
        }}
      >
        404
      </h1>
      
      <GlowText color="purple" className="text-xl md:text-2xl font-bold uppercase tracking-widest mb-6">
        Signal Lost
      </GlowText>
      
      <p className="text-text-secondary max-w-md mb-10 text-sm leading-relaxed">
        The node you are trying to reach has been disconnected from the network. It may have been relocated, deleted, or perhaps it never existed in this timeline.
      </p>
      
      <Link
        href="/"
        className="relative inline-flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest text-xs transition-all duration-300
                   text-neon-lavender border border-neon-lavender/30 bg-neon-lavender/5
                   hover:bg-neon-lavender/20 hover:text-white hover:border-neon-lavender
                   hover:shadow-[0_0_20px_rgba(199,125,255,0.4)] rounded-sm group"
      >
        <span className="relative z-10 flex items-center gap-2">
          <span>&lt;</span> Return to Mainframe <span>/&gt;</span>
        </span>
      </Link>
    </div>
  );
}
