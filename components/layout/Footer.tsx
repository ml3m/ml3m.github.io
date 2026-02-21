export default function Footer() {
  return (
    <footer className="text-center py-8 mt-8 text-text-muted text-[0.8rem] space-y-2">
      <p>
        inspired by{" "}
        <a href="https://foxwells.garden" target="_blank" rel="noopener noreferrer">
          foxwells.garden
        </a>{" "}
        and{" "}
        <a href="https://utsuho.rocks" target="_blank" rel="noopener noreferrer">
          utsuho.rocks
        </a>
      </p>
      <p className="text-text-muted/50">&copy; {new Date().getFullYear()} m/3m</p>
    </footer>
  );
}
