export default function Card({ title, action, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-border bg-surface p-4 shadow-sm ${className}`}>
      {title || action ? (
        <div className="mb-3 flex items-center justify-between gap-3">
          {title ? <h3 className="font-semibold">{title}</h3> : <span />}
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
