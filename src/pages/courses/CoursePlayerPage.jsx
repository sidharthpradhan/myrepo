import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { ProgressBar } from "../../components/common/Progress";
import PageLoader from "../../components/common/Skeleton";
import { courseService } from "../../services/courseService";
import { learningService } from "../../services/learningService";
import { notify } from "../../utils/notify";

export default function CoursePlayerPage() {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    courseService.getById(id, user).then((item) => {
      setCourse(item);
      setLesson(item?.modules?.[0]?.lessons?.[0] || null);
    });
    learningService.getEnrollments(user).then((rows) => {
      const mine = rows.find((item) => item.userId === user.id && item.courseId === Number(id));
      setEnrollment(mine);
    });
  }, [id, user]);

  if (!course) return <PageLoader />;

  const completeMore = async () => {
    const next = Math.min(100, (enrollment?.progress || 0) + 20);
    if (enrollment) {
      const updated = await learningService.updateProgress(enrollment.id, next);
      setEnrollment(updated);
    } else {
      const created = await learningService.enroll(user.id, course.id);
      const updated = await learningService.updateProgress(created.id, next);
      setEnrollment(updated);
    }
    notify.success(next >= 100 ? "Course completed" : "Progress saved");
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={course.title}
        crumbs={[{ label: "My Learning", to: "/app/learn" }, { label: course.title }]}
      />
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <Card title="Modules">
          <ul className="space-y-3 text-sm">
            {(course.modules || []).map((module) => (
              <li key={module.id}>
                <p className="font-medium">{module.title}</p>
                {module.lessons.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLesson(item)}
                    className={`mt-1 block w-full rounded-lg px-2 py-1 text-left ${lesson?.id === item.id ? "bg-primary-soft text-primary" : "hover:bg-raised"}`}
                  >
                    {item.title}
                  </button>
                ))}
              </li>
            ))}
          </ul>
        </Card>
        <Card
          title={lesson?.title || "Select a lesson"}
          action={<span className="text-sm text-muted">{enrollment?.progress || 0}%</span>}
        >
          <ProgressBar value={enrollment?.progress || 0} className="mb-4" />
          <div className="rounded-xl bg-raised p-6 text-sm text-muted">
            Mock {lesson?.type || "content"} player. Replace this panel with a real media component when the API is connected.
          </div>
          {lesson?.type === "quiz" ? (
            <Link to={`/app/assessments/${lesson.assessmentId}/take`} className="mt-4 inline-block text-sm text-primary">
              Open quiz
            </Link>
          ) : null}
          <div className="mt-4">
            <Button onClick={completeMore}>Mark progress</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
