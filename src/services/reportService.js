import { db } from "./mockStore";
import { byCompany, copy, delay } from "../utils/helpers";

function avg(values) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export const reportService = {
  async getCatalog() {
    await delay(120);
    return copy(db.reports);
  },

  async getDashboard(actor) {
    await delay();
    const companies = actor?.companyId == null ? db.companies : db.companies.filter((item) => item.id === actor.companyId);
    const users = byCompany(db.users, actor);
    const courses = byCompany(db.courses, actor);
    const enrollments = db.enrollments.filter((item) => users.some((user) => user.id === item.userId));
    const certificates = byCompany(db.certificates, actor);
    const completed = enrollments.filter((item) => item.status === "completed");
    return {
      totalCompanies: companies.length,
      activeCompanies: companies.filter((item) => item.status === "active").length,
      totalUsers: users.length,
      activeUsers: users.filter((item) => item.status === "active").length,
      totalCourses: courses.length,
      publishedCourses: courses.filter((item) => item.status === "published").length,
      activeLearners: enrollments.filter((item) => item.status === "in-progress").length,
      completionRate: enrollments.length ? Math.round((completed.length / enrollments.length) * 100) : 0,
      certificatesIssued: certificates.length,
      learningHours: courses.reduce((sum, course) => sum + (course.durationHours || 0), 0),
      assessments: byCompany(db.assessments, actor).length,
      userGrowth: [
        { month: "Apr", users: 18 },
        { month: "May", users: 24 },
        { month: "Jun", users: 31 },
        { month: "Jul", users: 36 },
        { month: "Aug", users: 42 },
        { month: "Sep", users: Math.max(users.length, 47) },
      ],
      companyGrowth: [
        { month: "Apr", companies: 1 },
        { month: "May", companies: 2 },
        { month: "Jun", companies: 2 },
        { month: "Jul", companies: 3 },
        { month: "Aug", companies: 3 },
        { month: "Sep", companies: companies.length },
      ],
      completionTrend: [
        { month: "Apr", rate: 42 },
        { month: "May", rate: 48 },
        { month: "Jun", rate: 55 },
        { month: "Jul", rate: 58 },
        { month: "Aug", rate: 63 },
        { month: "Sep", rate: enrollments.length ? Math.round((completed.length / enrollments.length) * 100) : 0 },
      ],
      learningActivity: [
        { day: "Mon", hours: 12 },
        { day: "Tue", hours: 18 },
        { day: "Wed", hours: 9 },
        { day: "Thu", hours: 22 },
        { day: "Fri", hours: 16 },
        { day: "Sat", hours: 7 },
        { day: "Sun", hours: 4 },
      ],
    };
  },

  async getTables(actor) {
    await delay();
    const users = byCompany(db.users, actor);
    const courses = byCompany(db.courses, actor);
    const departments = byCompany(db.departments, actor);
    const teams = byCompany(db.teams, actor);
    const enrollments = db.enrollments.filter((item) => users.some((user) => user.id === item.userId));

    const userProgress = users.map((user) => {
      const mine = enrollments.filter((item) => item.userId === user.id);
      return {
        user: user.name,
        email: user.email,
        department: departments.find((item) => item.id === user.departmentId)?.name || "—",
        courses: mine.length,
        completion: mine.length ? avg(mine.map((item) => item.progress)) : 0,
        lastLogin: user.lastLogin,
        status: user.status,
      };
    });

    const courseCompletion = courses.map((course) => {
      const rows = enrollments.filter((item) => item.courseId === course.id);
      return {
        course: course.title,
        status: course.status,
        enrolled: rows.length || course.enrolledCount,
        completion: rows.length ? avg(rows.map((item) => item.progress)) : 0,
        rating: course.rating,
      };
    });

    const departmentPerformance = departments.map((department) => {
      const members = users.filter((user) => user.departmentId === department.id);
      const rows = enrollments.filter((item) => members.some((user) => user.id === item.userId));
      return {
        department: department.name,
        members: members.length,
        completion: rows.length ? avg(rows.map((item) => item.progress)) : 0,
        hours: members.length * 4,
      };
    });

    const teamPerformance = teams.map((team) => {
      const members = users.filter((user) => user.teamId === team.id);
      const rows = enrollments.filter((item) => members.some((user) => user.id === item.userId));
      return {
        team: team.name,
        members: members.length,
        completion: rows.length ? avg(rows.map((item) => item.progress)) : 0,
        streak: avg(members.map((user) => user.streak || 0)),
      };
    });

    return {
      "user-progress": userProgress,
      "course-completion": courseCompletion,
      "course-engagement": courseCompletion,
      "assessment-performance": copy(db.assessmentResults)
        .filter((item) => users.some((user) => user.id === item.userId))
        .map((item) => ({
          assessment: db.assessments.find((row) => row.id === item.assessmentId)?.title,
          user: users.find((user) => user.id === item.userId)?.name,
          score: item.score,
          passed: item.passed ? "Yes" : "No",
          attempt: item.attempt,
          takenAt: item.takenAt,
        })),
      "department-performance": departmentPerformance,
      "team-performance": teamPerformance,
      "learning-hours": courses.map((course) => ({ course: course.title, hours: course.durationHours, learners: course.enrolledCount })),
      certificates: byCompany(db.certificates, actor).map((item) => ({
        number: item.certificateNumber,
        user: users.find((user) => user.id === item.userId)?.name,
        issuedAt: item.issuedAt,
        status: item.status,
      })),
      "path-completion": byCompany(db.learningPaths, actor).map((path) => ({
        path: path.title,
        courses: path.courseIds.length,
        assigned: path.assignedUserIds.length,
        status: path.status,
      })),
      "user-activity": byCompany(db.activities, actor).map((item) => ({
        user: users.find((user) => user.id === item.userId)?.name || "System",
        text: item.text,
        createdAt: item.createdAt,
      })),
      "login-activity": users.map((user) => ({ user: user.name, email: user.email, lastLogin: user.lastLogin, status: user.status })),
    };
  },
};
