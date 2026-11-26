import { Link } from "react-router-dom";

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-muted">
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-2">
          {item.to ? (
            <Link to={item.to} className="hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
          {index < items.length - 1 ? <span>/</span> : null}
        </span>
      ))}
    </nav>
  );
}
