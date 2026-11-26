import { FiCheck, FiLoader } from "react-icons/fi";
import Button from "./Button";

export default function LoadingButton({
  loading,
  success,
  loadingText = "Saving...",
  successText = "Saved",
  children,
  disabled,
  ...props
}) {
  const label = loading ? loadingText : success ? successText : children;
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading ? <FiLoader className="animate-spin" /> : null}
      {success && !loading ? <FiCheck /> : null}
      {label}
    </Button>
  );
}
