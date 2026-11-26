export default function IconButton({ children, className = "", title, ...props }) {
  return (
    <button
      type="button"
      title={title}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-primary-soft ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
