import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../constants/navigation";
import { usePermissions } from "../../hooks/usePermissions";
import Tooltip from "../common/Tooltip";
import { NAV_ICONS } from "./navIcons";

export default function Sidebar({ collapsed, onNavigate }) {
  const { hasPermission } = usePermissions();
  const items = NAV_ITEMS.filter((item) => hasPermission(item.permission));

  return (
    <nav className="flex h-full flex-col gap-1 p-3">
      {items.map((item) => {
        const Icon = NAV_ICONS[item.icon] || NAV_ICONS.dashboard;
        const link = (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive ? "bg-primary text-white" : "text-ink hover:bg-primary-soft"
              } ${collapsed ? "justify-center px-0" : ""}`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {collapsed ? null : <span className="truncate">{item.label}</span>}
          </NavLink>
        );
        return collapsed ? (
          <Tooltip key={item.id} label={item.label}>
            {link}
          </Tooltip>
        ) : (
          link
        );
      })}
    </nav>
  );
}
