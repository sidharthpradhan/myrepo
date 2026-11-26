import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import PermissionGate from "../../components/common/PermissionGate";
import PageLoader from "../../components/common/Skeleton";
import { learningPathService } from "../../services/learningPathService";
import { courseService } from "../../services/courseService";
import { userService } from "../../services/userService";
import { notify } from "../../utils/notify";

export default function LearningPathDetailsPage() {
  const { id } = useParams();
  const actor = useSelector((state) => state.auth.user);
  const [path, setPath] = useState(null);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignId, setAssignId] = useState("");

  useEffect(() => {
    learningPathService.getById(id, actor).then(setPath);
    courseService.getAll(actor).then(setCourses);
    userService.getUsers(actor).then(setUsers);
  }, [id, actor]);

  if (!path) return <PageLoader />;
  const sequence = path.courseIds.map((courseId) => courses.find((item) => item.id === courseId)).filter(Boolean);

  const move = async (index, direction) => {
    const next = [...path.courseIds];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    const updated = await learningPathService.update(path.id, { courseIds: next });
    setPath(updated);
  };

  return (
    <div className="space-y-4">
      <PageHeader title={path.title} crumbs={[{ label: "Learning Paths", to: "/app/learning-paths" }, { label: path.title }]} />
      <Card title="Sequence">
        <ol className="space-y-2">
          {sequence.map((course, index) => (
            <li key={course.id} className="flex items-center justify-between rounded-xl border border-border px-3 py-2">
              <span>
                {index + 1}. {course.title}
              </span>
              <PermissionGate permission="learningPaths.edit">
                <span className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => move(index, -1)}>Up</Button>
                  <Button size="sm" variant="secondary" onClick={() => move(index, 1)}>Down</Button>
                </span>
              </PermissionGate>
            </li>
          ))}
        </ol>
      </Card>
      <PermissionGate permission="learningPaths.assign">
        <Card title="Assign users">
          <div className="flex gap-2">
            <select className="h-10 flex-1 rounded-lg border border-border bg-surface px-3" value={assignId} onChange={(event) => setAssignId(event.target.value)}>
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            <Button
              onClick={async () => {
                const assignedUserIds = [...new Set([...(path.assignedUserIds || []), Number(assignId)])];
                const updated = await learningPathService.update(path.id, { assignedUserIds });
                setPath(updated);
                notify.success("User assigned");
              }}
            >
              Assign
            </Button>
          </div>
          <p className="mt-2 text-sm text-muted">{path.assignedUserIds?.length || 0} assigned</p>
        </Card>
      </PermissionGate>
    </div>
  );
}
