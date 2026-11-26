import { usePermissions } from "../../hooks/usePermissions";

export default function PermissionGate({ permission, permissions, fallback = null, children }) {
  const { hasPermission, hasAnyPermission } = usePermissions();
  const allowed = permissions ? hasAnyPermission(permissions) : hasPermission(permission);
  return allowed ? children : fallback;
}
