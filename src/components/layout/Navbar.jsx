import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiBell, FiLogOut, FiMenu, FiUser } from "react-icons/fi";
import { APP_NAME } from "../../constants/app";
import { logout } from "../../store/slices/authSlice";
import { markAllNotificationsRead, markNotificationRead, selectUnreadCount } from "../../store/slices/notificationSlice";
import Avatar from "../common/Avatar";
import Dropdown, { DropdownItem } from "../common/Dropdown";
import IconButton from "../common/IconButton";
import GlobalSearch from "./GlobalSearch";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar({ company, onMenu }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const notifications = useSelector((state) => state.notifications.items);
  const unread = useSelector(selectUnreadCount);

  return (
    <header className="flex h-(--navbar-height) shrink-0 items-center gap-3 border-b border-border bg-surface px-3 sm:px-5">
      <IconButton onClick={onMenu} title="Toggle menu">
        <FiMenu />
      </IconButton>
      <div className="hidden min-w-0 items-center gap-2 md:flex">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
          {company?.logo || "SK"}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{company?.name || APP_NAME}</p>
          <p className="truncate text-xs text-muted">{user?.role?.name}</p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-end gap-2">
        <GlobalSearch />
      </div>
      <ThemeSwitcher />
      <Dropdown
        trigger={
          <button type="button" className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-primary-soft">
            <FiBell />
            {unread ? (
              <span className="absolute right-1.5 top-1.5 h-4 min-w-4 rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            ) : null}
          </button>
        }
      >
        <div className="w-80 p-1">
          <div className="flex items-center justify-between px-2 py-1">
            <p className="text-sm font-semibold">Notifications</p>
            <button type="button" className="text-xs text-primary" onClick={() => dispatch(markAllNotificationsRead())}>
              Mark all read
            </button>
          </div>
          {notifications.slice(0, 5).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => dispatch(markNotificationRead(item.id))}
              className="flex w-full flex-col rounded-lg px-3 py-2 text-left hover:bg-primary-soft"
            >
              <span className="text-sm font-medium">{item.title}</span>
              <span className="text-xs text-muted">{item.message}</span>
            </button>
          ))}
          <DropdownItem onClick={() => navigate("/app/notifications")}>View all</DropdownItem>
        </div>
      </Dropdown>
      <Dropdown
        trigger={
          <button type="button" className="flex items-center gap-2 rounded-lg p-1 hover:bg-primary-soft">
            <Avatar name={user?.name} src={user?.avatar} size="sm" />
          </button>
        }
      >
        <DropdownItem onClick={() => navigate("/app/profile")}>
          <FiUser /> My Profile
        </DropdownItem>
        <DropdownItem onClick={() => navigate("/app/settings")}>
          Settings
        </DropdownItem>
        <DropdownItem onClick={() => navigate("/app/help")}>Help</DropdownItem>
        <DropdownItem
          className="text-danger"
          onClick={() => {
            dispatch(logout());
            navigate("/login");
          }}
        >
          <FiLogOut /> Logout
        </DropdownItem>
      </Dropdown>
    </header>
  );
}
