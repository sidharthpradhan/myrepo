import { Navigate, Outlet } from "react-router-dom";
import { usePermissions } from "../hooks/usePermissions";

export default function PermissionRoute({ permission }) {
  const { hasPermission } = usePermissions();
  if (!hasPermission(permission)) return <Navigate to="/app/dashboard" replace />;
  return <Outlet />;
}
