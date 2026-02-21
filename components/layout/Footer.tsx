export default function Footer() {
  return (
    <footer className="text-center py-8 mt-8 text-text-muted text-[0.8rem] space-y-2">
      <p>
        inspired by{" "}
        <a href="https://fleepy.tv" target="_blank" rel="noopener noreferrer">
          fleepy
        </a>{" "}
      </p>
      <p className="text-text-muted/50">&copy; {new Date().getFullYear()} m/3m</p>
    </footer>
  );
}
