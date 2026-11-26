const tones = {
  default: "bg-raised text-ink",
  primary: "bg-primary-soft text-primary",
  success: "bg-emerald-500/15 text-success",
  warning: "bg-amber-500/15 text-warning",
  danger: "bg-red-500/15 text-danger",
};

export default function Badge({ children, tone = "default" }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${tones[tone] || tones.default}`}>
      {children}
    </span>
  );
}

export function statusTone(status) {
  if (["active", "published", "issued", "completed", "passed"].includes(status)) return "success";
  if (["draft", "invited", "in-progress", "pending"].includes(status)) return "warning";
  if (["inactive", "archived", "failed"].includes(status)) return "danger";
  return "default";
}
