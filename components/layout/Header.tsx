import Nav from "./Nav";

export default function Header() {
  return (
    <header className="pt-8 pb-2 flex flex-col items-center">
      <h1
        className="text-[clamp(2.5rem,8vw,5rem)] font-bold tracking-[0.15em] leading-none select-none"
        style={{
          color: "transparent",
          WebkitTextStroke: "2px var(--neon-pink)",
          textShadow: "0 0 30px #ff4da666, 0 0 60px #cc44ff33",
          animation: "flicker 8s infinite",
          fontFamily: "var(--font-mono)",
        }}
      >
        m/3m
      </h1>
      <Nav />
    </header>
  );
}
