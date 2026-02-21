interface NeonCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export default function NeonCard({
  children,
  className = "",
  padding = "p-5",
}: NeonCardProps) {
  return (
    <div className={`neon-card rounded-sm ${padding} ${className}`}>
      {children}
    </div>
  );
}
