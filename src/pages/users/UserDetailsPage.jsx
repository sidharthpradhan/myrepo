import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Badge, { statusTone } from "../../components/common/Badge";
import { ProgressBar } from "../../components/common/Progress";
import PageLoader from "../../components/common/Skeleton";
import { fetchUser } from "../../store/slices/userSlice";
import { fetchRoles } from "../../store/slices/roleSlice";
import { fetchDepartments } from "../../store/slices/departmentSlice";
import { fetchTeams } from "../../store/slices/teamSlice";
import { fetchCourses } from "../../store/slices/courseSlice";
import { fetchEnrollments } from "../../store/slices/learningSlice";
import { certificateService } from "../../services/certificateService";
import { assessmentService } from "../../services/assessmentService";
import { formatDateTime } from "../../utils/format";
import { useState } from "react";

export default function UserDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.current);
  const roles = useSelector((state) => state.roles.items);
  const departments = useSelector((state) => state.departments.items);
  const teams = useSelector((state) => state.teams.items);
  const courses = useSelector((state) => state.courses.items);
  const enrollments = useSelector((state) => state.learning.enrollments.filter((item) => item.userId === Number(id)));
  const [certs, setCerts] = useState([]);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    dispatch(fetchUser(id));
    dispatch(fetchRoles());
    dispatch(fetchDepartments());
    dispatch(fetchTeams());
    dispatch(fetchCourses());
    dispatch(fetchEnrollments());
    const actor = undefined;
    certificateService.getAll({ companyId: null }).then(setCerts);
    assessmentService.getResults({ companyId: null }).then(setScores);
  }, [dispatch, id]);

  if (!user) return <PageLoader />;
  const mineCerts = certs.filter((item) => item.userId === user.id);
  const mineScores = scores.filter((item) => item.userId === user.id);

  return (
    <div className="space-y-4">
      <PageHeader
        title={user.name}
        crumbs={[{ label: "Users", to: "/app/users" }, { label: user.name }]}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Personal information">
          <p className="text-sm">{user.jobTitle}</p>
          <p className="text-sm text-muted">{user.email}</p>
          <p className="text-sm text-muted">{user.phone || "No phone"}</p>
        </Card>
        <Card title="Organization">
          <p className="text-sm">Role: {roles.find((item) => item.id === user.roleId)?.name}</p>
          <p className="text-sm">Department: {departments.find((item) => item.id === user.departmentId)?.name || "—"}</p>
          <p className="text-sm">Team: {teams.find((item) => item.id === user.teamId)?.name || "—"}</p>
          <Badge tone={statusTone(user.status)}>{user.status}</Badge>
        </Card>
        <Card title="Login activity">
          <p className="text-sm">Last login: {formatDateTime(user.lastLogin)}</p>
          <p className="text-sm">Streak {user.streak} · Level {user.level} · {user.points} pts</p>
        </Card>
      </div>
      <Card title="Learning progress">
        <div className="space-y-3">
          {enrollments.map((item) => (
            <div key={item.id}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{courses.find((course) => course.id === item.courseId)?.title}</span>
                <span>{item.progress}%</span>
              </div>
              <ProgressBar value={item.progress} />
            </div>
          ))}
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Certificates">
          <ul className="text-sm">
            {mineCerts.map((item) => (
              <li key={item.id}>{item.certificateNumber} · {item.issuedAt}</li>
            ))}
          </ul>
        </Card>
        <Card title="Assessments">
          <ul className="text-sm">
            {mineScores.map((item) => (
              <li key={item.id}>Score {item.score}% · attempt {item.attempt}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
