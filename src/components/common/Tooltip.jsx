export default function Tooltip({ label, children }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute left-full top-1/2 z-30 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs text-white opacity-0 shadow-sm transition group-hover:opacity-100">
        {label}
      </span>
    </span>
  );
}
