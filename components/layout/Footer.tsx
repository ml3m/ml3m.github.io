/* eslint-disable @next/next/no-img-element */

export default function Footer() {
  return (
    <footer className="text-center py-8 mt-8 text-text-muted text-[0.8rem] space-y-5">
      <p className="text-text-muted/50 pt-2">
        &copy; {new Date().getFullYear()} m/3m
      </p>
    </footer>
  );
}
