export function ProgressBar({ value = 0, className = "" }) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-raised ${className}`}>
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function ProgressCircle({ value = 0, size = 56 }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" className="-rotate-90">
      <circle cx="22" cy="22" r={radius} stroke="var(--app-border)" strokeWidth="6" fill="none" />
      <circle
        cx="22"
        cy="22"
        r={radius}
        stroke="var(--app-primary)"
        strokeWidth="6"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}
