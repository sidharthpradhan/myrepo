import Input from "./Input";

export default function Textarea({ label, rows = 4, ...props }) {
  return (
    <label className="block space-y-1.5">
      {label ? <span className="text-sm font-medium text-ink">{label}</span> : null}
      <textarea
        rows={rows}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none placeholder:text-muted focus:ring-2 focus:ring-primary"
        {...props}
      />
    </label>
  );
}

export { Input };
