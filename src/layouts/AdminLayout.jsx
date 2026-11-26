import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { fetchCompanies } from "../store/slices/companySlice";
import { fetchNotifications } from "../store/slices/notificationSlice";
import { applyTheme } from "../utils/theme";
import Drawer from "../components/common/Drawer";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const theme = useSelector((state) => state.theme);
  const companies = useSelector((state) => state.companies.items);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const company = useMemo(() => {
    if (user?.companyId) return companies.find((item) => item.id === user.companyId);
    return { name: "Skillomi", logo: "SK" };
  }, [companies, user]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme(theme);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchCompanies());
  }, [dispatch]);

  const toggle = () => {
    if (window.innerWidth < 1024) setMobileOpen(true);
    else setCollapsed((value) => !value);
  };

  return (
    <div className="flex h-full flex-col bg-app text-ink">
      <Navbar company={company} onMenu={toggle} />
      <div className="flex min-h-0 flex-1">
        <aside
          className={`hidden h-full shrink-0 overflow-x-hidden overflow-y-auto border-r border-border bg-surface transition-[width] duration-200 lg:block ${
            collapsed ? "w-[var(--sidebar-collapsed)]" : "w-[var(--sidebar-width)]"
          }`}
        >
          <Sidebar collapsed={collapsed} />
        </aside>
        <Drawer open={mobileOpen} title="Menu" onClose={() => setMobileOpen(false)}>
          <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </Drawer>
        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
