import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/slices/authSlice";

export function usePermissions() {
  const user = useSelector(selectCurrentUser);
  const permissions = user?.permissions || [];

  return useMemo(() => {
    const hasAll = permissions.includes("*");
    const hasPermission = (key) => {
      if (!key) return true;
      if (hasAll) return true;
      return permissions.includes(key);
    };
    const hasAnyPermission = (keys = []) => keys.some((key) => hasPermission(key));
    const hasAllPermissions = (keys = []) => keys.every((key) => hasPermission(key));
    return { permissions, hasPermission, hasAnyPermission, hasAllPermissions, isSuperAdmin: hasAll };
  }, [permissions]);
}
