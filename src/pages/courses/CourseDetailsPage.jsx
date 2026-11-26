import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Badge, { statusTone } from "../../components/common/Badge";
import Button from "../../components/common/Button";
import PageLoader from "../../components/common/Skeleton";
import PermissionGate from "../../components/common/PermissionGate";
import { fetchCourse } from "../../store/slices/courseSlice";
import { fetchUsers } from "../../store/slices/userSlice";
import { learningService } from "../../services/learningService";
import { notify } from "../../utils/notify";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const course = useSelector((state) => state.courses.current);
  const users = useSelector((state) => state.users.items);
  const actor = useSelector((state) => state.auth.user);
  const [assignId, setAssignId] = useState("");

  useEffect(() => {
    dispatch(fetchCourse(id));
    dispatch(fetchUsers());
  }, [dispatch, id]);

  if (!course) return <PageLoader />;

  return (
    <div className="space-y-4">
      <PageHeader
        title={course.title}
        crumbs={[{ label: "Courses", to: "/app/courses" }, { label: course.title }]}
        actions={
          <Link to={`/app/learn/courses/${course.id}`}>
            <Button variant="secondary">Preview</Button>
          </Link>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Overview" className="lg:col-span-2">
          <p className="text-sm text-muted">{course.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone={statusTone(course.status)}>{course.status}</Badge>
            <Badge>{course.difficulty}</Badge>
            <Badge>{course.durationHours} hours</Badge>
          </div>
        </Card>
        <Card title="Instructor">
          <p>{users.find((user) => user.id === course.instructorId)?.name || "Unassigned"}</p>
        </Card>
      </div>
      <Card title="Structure">
        <ul className="space-y-3">
          {(course.modules || []).map((module) => (
            <li key={module.id}>
              <p className="font-medium">{module.title}</p>
              <ul className="ml-4 list-disc text-sm text-muted">
                {module.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    {lesson.title} · {lesson.type} · {lesson.duration}m
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Card>
      <PermissionGate permission="courses.assign">
        <Card title="Assign course">
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              className="h-10 flex-1 rounded-lg border border-border bg-surface px-3 text-sm"
              value={assignId}
              onChange={(event) => setAssignId(event.target.value)}
            >
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <Button
              onClick={async () => {
                if (!assignId) return;
                await learningService.enroll(Number(assignId), course.id);
                notify.success("Course assigned");
              }}
            >
              Assign
            </Button>
          </div>
        </Card>
      </PermissionGate>
    </div>
  );
}
