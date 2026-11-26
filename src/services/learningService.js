import { db } from "./mockStore";
import { byCompany, copy, delay } from "../utils/helpers";

export const learningService = {
  async getEnrollments(actor) {
    await delay();
    const users = byCompany(db.users, actor);
    return copy(db.enrollments.filter((item) => users.some((user) => user.id === item.userId)));
  },
  async getLxp() {
    await delay();
    return copy(db.lxp);
  },
  async updateProgress(enrollmentId, progress) {
    await delay();
    const row = db.enrollments.find((item) => item.id === Number(enrollmentId));
    if (!row) throw new Error("Enrollment not found.");
    row.progress = progress;
    row.status = progress >= 100 ? "completed" : "in-progress";
    row.updatedAt = new Date().toISOString().slice(0, 10);
    return copy(row);
  },
  async enroll(userId, courseId) {
    await delay();
    const existing = db.enrollments.find((item) => item.userId === userId && item.courseId === courseId);
    if (existing) return copy(existing);
    const row = {
      id: db.enrollments.length + 1,
      userId,
      courseId,
      progress: 0,
      status: "not-started",
      lastLessonId: null,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    db.enrollments.push(row);
    return copy(row);
  },
};
