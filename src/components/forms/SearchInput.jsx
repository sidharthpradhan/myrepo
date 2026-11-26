import { FiSearch } from "react-icons/fi";

export default function SearchInput({ className = "", ...props }) {
  return (
    <label className={`relative block ${className}`}>
      <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <input
        className="h-10 w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-ink outline-none placeholder:text-muted focus:ring-2 focus:ring-primary"
        {...props}
      />
    </label>
  );
}
