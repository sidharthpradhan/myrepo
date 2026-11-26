import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Tabs from "../../components/common/Tabs";
import { ProgressBar } from "../../components/common/Progress";
import { fetchCourses } from "../../store/slices/courseSlice";
import { fetchEnrollments, fetchLxp, fetchPaths } from "../../store/slices/learningSlice";

export default function LearnHomePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const courses = useSelector((state) => state.courses.items);
  const enrollments = useSelector((state) => state.learning.enrollments);
  const paths = useSelector((state) => state.learning.paths);
  const lxp = useSelector((state) => state.learning.lxp);
  const [tab, setTab] = useState("discover");

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchEnrollments());
    dispatch(fetchPaths());
    dispatch(fetchLxp());
  }, [dispatch]);

  const published = courses.filter((item) => item.status === "published");
  const mine = enrollments.filter((item) => item.userId === user.id);
  const bookmarks = published.filter((course) => lxp.bookmarks.some((item) => item.userId === user.id && item.courseId === course.id));
  const popular = [...published].sort((a, b) => b.enrolledCount - a.enrolledCount).slice(0, 4);
  const newest = [...published].sort((a, b) => String(b.publishDate).localeCompare(String(a.publishDate))).slice(0, 4);

  const grid = useMemo(() => {
    if (tab === "mine") return published.filter((course) => mine.some((item) => item.courseId === course.id));
    if (tab === "saved") return bookmarks;
    if (tab === "popular") return popular;
    if (tab === "new") return newest;
    return published;
  }, [tab, published, mine, bookmarks, popular, newest]);

  return (
    <div className="space-y-4">
      <PageHeader title="My Learning" description="Personalized catalog, progress, and recommendations." />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "discover", label: "Discover" },
          { id: "mine", label: "My courses" },
          { id: "saved", label: "Bookmarks" },
          { id: "popular", label: "Popular" },
          { id: "new", label: "New" },
        ]}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {grid.map((course) => {
          const progress = mine.find((item) => item.courseId === course.id)?.progress || 0;
          return (
            <Link key={course.id} to={`/app/learn/courses/${course.id}`} className="rounded-2xl border border-border bg-surface p-4 hover:border-primary">
              <p className="text-3xl">{course.thumbnail}</p>
              <p className="mt-2 font-semibold">{course.title}</p>
              <p className="text-sm text-muted">{course.category} · {course.difficulty}</p>
              <ProgressBar value={progress} className="mt-3" />
            </Link>
          );
        })}
      </div>
      <Card title="Skills & paths">
        <div className="flex flex-wrap gap-2">
          {paths.map((path) => (
            <Link key={path.id} to={`/app/learning-paths/${path.id}`} className="rounded-full bg-primary-soft px-3 py-1 text-sm text-primary">
              {path.title}
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
