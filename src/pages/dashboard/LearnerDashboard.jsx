import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import { ProgressBar, ProgressCircle } from "../../components/common/Progress";
import { SkeletonCards } from "../../components/common/Skeleton";
import { fetchCourses } from "../../store/slices/courseSlice";
import { fetchEnrollments, fetchLxp, fetchPaths } from "../../store/slices/learningSlice";
import { fetchNotifications } from "../../store/slices/notificationSlice";

export default function LearnerDashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const courses = useSelector((state) => state.courses.items);
  const enrollments = useSelector((state) => state.learning.enrollments);
  const paths = useSelector((state) => state.learning.paths);
  const lxp = useSelector((state) => state.learning.lxp);
  const loading = useSelector((state) => state.courses.loading);

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchEnrollments());
    dispatch(fetchPaths());
    dispatch(fetchLxp());
    dispatch(fetchNotifications());
  }, [dispatch]);

  const mine = useMemo(
    () => enrollments.filter((item) => item.userId === user.id),
    [enrollments, user],
  );
  const continueLearning = mine.find((item) => item.status === "in-progress");
  const continueCourse = courses.find((item) => item.id === continueLearning?.courseId);
  const recommended = courses.filter((item) => item.status === "published").slice(0, 3);
  const myPaths = paths.filter((item) => item.assignedUserIds?.includes(user.id));
  const goals = lxp.goals.filter((item) => item.userId === user.id);

  if (loading && !courses.length) {
    return (
      <div>
        <PageHeader title="My learning" />
        <SkeletonCards />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`Welcome back, ${user.firstName}`} description="Pick up where you left off and keep your streak alive." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Continue learning" className="lg:col-span-2">
          {continueCourse ? (
            <div className="space-y-3">
              <p className="text-lg font-semibold">{continueCourse.title}</p>
              <ProgressBar value={continueLearning.progress} />
              <Link to={`/app/learn/courses/${continueCourse.id}`} className="inline-flex text-sm font-medium text-primary">
                Resume course
              </Link>
            </div>
          ) : (
            <p className="text-sm text-muted">You are all caught up. Browse recommended courses below.</p>
          )}
        </Card>
        <Card title="Learning streak">
          <div className="flex items-center gap-4">
            <ProgressCircle value={Math.min(100, (user.streak || 0) * 5)} />
            <div>
              <p className="text-3xl font-semibold">{user.streak || 0}</p>
              <p className="text-sm text-muted">days in a row · {user.points} pts · Level {user.level}</p>
            </div>
          </div>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card title="My courses">
          <ul className="space-y-2 text-sm">
            {mine.map((item) => {
              const course = courses.find((row) => row.id === item.courseId);
              return (
                <li key={item.id}>
                  <Link to={`/app/learn/courses/${item.courseId}`} className="hover:text-primary">
                    {course?.title} · {item.progress}%
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card title="Learning paths">
          <ul className="space-y-2 text-sm">
            {myPaths.map((item) => (
              <li key={item.id}>
                <Link to={`/app/learning-paths/${item.id}`} className="hover:text-primary">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Goals">
          <ul className="space-y-3">
            {goals.map((goal) => (
              <li key={goal.id}>
                <p className="text-sm">{goal.title}</p>
                <ProgressBar value={goal.progress} className="mt-1" />
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card title="Recommended courses">
        <div className="grid gap-3 md:grid-cols-3">
          {recommended.map((course) => (
            <Link key={course.id} to={`/app/learn/courses/${course.id}`} className="rounded-xl border border-border p-3 hover:border-primary">
              <p className="text-2xl">{course.thumbnail}</p>
              <p className="mt-2 font-medium">{course.title}</p>
              <p className="text-xs text-muted">{course.difficulty} · {course.durationHours}h</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
