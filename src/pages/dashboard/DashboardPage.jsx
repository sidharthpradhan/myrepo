import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiUsers,
} from "react-icons/fi";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import { SkeletonCards } from "../../components/common/Skeleton";
import { ErrorState } from "../../components/common/EmptyState";
import Card from "../../components/common/Card";
import { fetchCompanies } from "../../store/slices/companySlice";
import { fetchUsers } from "../../store/slices/userSlice";
import { fetchCourses } from "../../store/slices/courseSlice";
import { activityService } from "../../services/notificationService";
import { reportService } from "../../services/reportService";
import { formatDateTime } from "../../utils/format";
import { BarPanel, LinePanel, selectDashboardKind } from "./charts";
import LearnerDashboard from "./LearnerDashboard";

export default function DashboardPage() {
  const user = useSelector((state) => state.auth.user);
  const kind = selectDashboardKind(user);
  if (kind === "learner") return <LearnerDashboard />;
  return <AdminDashboard kind={kind} />;
}

function AdminDashboard({ kind }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setError(null);
      const [dashboard, activity] = await Promise.all([
        reportService.getDashboard(user),
        activityService.getAll(user),
      ]);
      setStats(dashboard);
      setActivities(activity);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    dispatch(fetchCompanies());
    dispatch(fetchUsers());
    dispatch(fetchCourses());
    load();
  }, [dispatch]);

  if (error) return <ErrorState title={error} onRetry={load} />;
  if (!stats) {
    return (
      <div className="space-y-4">
        <PageHeader title="Dashboard" />
        <SkeletonCards count={8} />
      </div>
    );
  }

  const cards =
    kind === "super"
      ? [
          { label: "Total companies", value: stats.totalCompanies, icon: FiBriefcase },
          { label: "Active companies", value: stats.activeCompanies, icon: FiBriefcase },
          { label: "Total users", value: stats.totalUsers, icon: FiUsers },
          { label: "Active users", value: stats.activeUsers, icon: FiUsers },
          { label: "Total courses", value: stats.totalCourses, icon: FiBookOpen },
          { label: "Published courses", value: stats.publishedCourses, icon: FiBookOpen },
          { label: "Active learners", value: stats.activeLearners, icon: FiCheckCircle },
          { label: "Completion rate", value: `${stats.completionRate}%`, icon: FiCheckCircle },
          { label: "Certificates issued", value: stats.certificatesIssued, icon: FiAward },
          { label: "Learning hours", value: stats.learningHours, icon: FiClock },
        ]
      : [
          { label: "Total employees", value: stats.totalUsers, icon: FiUsers },
          { label: "Active learners", value: stats.activeLearners, icon: FiCheckCircle },
          { label: "Total courses", value: stats.totalCourses, icon: FiBookOpen },
          { label: "Published courses", value: stats.publishedCourses, icon: FiBookOpen },
          { label: "Course completion", value: `${stats.completionRate}%`, icon: FiCheckCircle },
          { label: "Assessments", value: stats.assessments, icon: FiCheckCircle },
          { label: "Certificates", value: stats.certificatesIssued, icon: FiAward },
          { label: "Learning hours", value: stats.learningHours, icon: FiClock },
        ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={kind === "super" ? "Super Admin Dashboard" : "Company Dashboard"}
        description="Live totals computed from mock JSON through the report service."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <LinePanel title="User growth" data={stats.userGrowth} xKey="month" yKey="users" />
        <LinePanel title="Course completion" data={stats.completionTrend} xKey="month" yKey="rate" />
        {kind === "super" ? (
          <LinePanel title="Company growth" data={stats.companyGrowth} xKey="month" yKey="companies" />
        ) : null}
        <BarPanel title="Learning activity" data={stats.learningActivity} xKey="day" yKey="hours" />
      </div>
      <Card title="Recent activity">
        <ul className="space-y-3">
          {activities.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 text-sm">
              <span>{item.text}</span>
              <span className="shrink-0 text-muted">{formatDateTime(item.createdAt)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
