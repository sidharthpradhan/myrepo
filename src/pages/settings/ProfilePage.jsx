import { useSelector } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Avatar from "../../components/common/Avatar";

export default function ProfilePage() {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="space-y-4">
      <PageHeader title="My profile" />
      <Card>
        <div className="flex items-center gap-4">
          <Avatar name={user.name} src={user.avatar} size="lg" />
          <div>
            <p className="text-xl font-semibold">{user.name}</p>
            <p className="text-sm text-muted">{user.email}</p>
            <p className="text-sm text-muted">{user.role?.name}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
