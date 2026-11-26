import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from "../../store/slices/notificationSlice";
import { formatDateTime } from "../../utils/format";

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.notifications.items);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Notifications"
        actions={
          <Button variant="secondary" onClick={() => dispatch(markAllNotificationsRead())}>
            Mark all read
          </Button>
        }
      />
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => dispatch(markNotificationRead(item.id))}
          className="block w-full text-left"
        >
          <Card className={item.read ? "opacity-70" : ""}>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-muted">{item.message}</p>
            <p className="mt-1 text-xs text-muted">{formatDateTime(item.createdAt)}</p>
          </Card>
        </button>
      ))}
    </div>
  );
}
