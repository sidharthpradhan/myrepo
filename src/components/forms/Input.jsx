export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block space-y-1.5">
      {label ? <span className="text-sm font-medium text-ink">{label}</span> : null}
      <input
        className={`h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none placeholder:text-muted focus:ring-2 focus:ring-primary ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
}
