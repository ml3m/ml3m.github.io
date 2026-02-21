/* eslint-disable @next/next/no-img-element */

export default function Footer() {
  return (
    <footer className="text-center py-8 mt-8 text-text-muted text-[0.8rem] space-y-5">
      <div className="space-y-2">
        <p className="text-text-secondary">inspired by</p>
        <a href="https://fleepy.tv" target="_blank" rel="noopener noreferrer">
          <img
            src="/img/badges/fleepy.png"
            alt="fleepy.tv"
            className="inline-block"
            style={{ maxHeight: 31, imageRendering: "pixelated" }}
          />
        </a>
      </div>

      <p className="text-text-muted/50 pt-2">
        &copy; {new Date().getFullYear()} m/3m
      </p>
    </footer>
  );
}
