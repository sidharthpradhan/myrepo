import { FiX } from "react-icons/fi";
import IconButton from "../common/IconButton";

export default function Drawer({ open, title, onClose, children }) {
  return (
    <div className={`fixed inset-0 z-40 ${open ? "" : "pointer-events-none hidden lg:hidden"}`} aria-hidden={!open}>
      <button
        className={`absolute inset-0 bg-black/40 transition ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
        aria-label="Close drawer"
      />
      <aside
        className={`absolute left-0 top-0 flex h-full w-[min(86vw,280px)] flex-col bg-surface shadow-xl transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-semibold">{title}</h2>
          <IconButton onClick={onClose} title="Close">
            <FiX />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </div>
  );
}
