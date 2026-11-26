import { initials } from "../../utils/format";

export default function Avatar({ name, src, size = "md" }) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-lg" };
  if (src && src.startsWith("http")) {
    return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover`} />;
  }
  return (
    <span className={`inline-flex items-center justify-center rounded-full bg-primary-soft font-semibold text-primary ${sizes[size]}`}>
      {src || initials(name)}
    </span>
  );
}
