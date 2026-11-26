export default function Select({ label, options = [], className = "", ...props }) {
  return (
    <label className="block space-y-1.5">
      {label ? <span className="text-sm font-medium text-ink">{label}</span> : null}
      <select
        className={`h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-primary ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
