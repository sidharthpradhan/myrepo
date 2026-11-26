const variants = {
  primary:
    "bg-primary text-white hover:opacity-90 disabled:opacity-60",
  secondary:
    "bg-raised text-ink border border-border hover:bg-primary-soft disabled:opacity-60",
  ghost: "text-ink hover:bg-primary-soft disabled:opacity-60",
  danger: "bg-danger text-white hover:opacity-90 disabled:opacity-60",
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
