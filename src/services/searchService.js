import { db } from "./mockStore";
import { delay } from "../utils/helpers";

function hit(item, query, fields) {
  const q = query.toLowerCase();
  return fields.some((field) => String(item[field] || "").toLowerCase().includes(q));
}

export const searchService = {
  async search(query, actor) {
    await delay(180);
    if (!query?.trim()) return [];
    const q = query.trim();
    const companyId = actor?.companyId;
    const inCompany = (item) => companyId == null || item.companyId === companyId || item.companyId == null;

    const results = [];
    db.users.filter((item) => inCompany(item) && hit(item, q, ["name", "email", "jobTitle"])).forEach((item) => {
      results.push({ type: "Users", id: item.id, title: item.name, subtitle: item.email, path: `/app/users/${item.id}` });
    });
    if (companyId == null) {
      db.companies.filter((item) => hit(item, q, ["name", "industry"])).forEach((item) => {
        results.push({ type: "Companies", id: item.id, title: item.name, subtitle: item.industry, path: `/app/companies/${item.id}` });
      });
    }
    db.courses.filter((item) => inCompany(item) && hit(item, q, ["title", "category", "description"])).forEach((item) => {
      results.push({ type: "Courses", id: item.id, title: item.title, subtitle: item.category, path: `/app/courses/${item.id}` });
    });
    db.learningPaths.filter((item) => inCompany(item) && hit(item, q, ["title", "skill"])).forEach((item) => {
      results.push({ type: "Learning Paths", id: item.id, title: item.title, subtitle: item.skill, path: `/app/learning-paths/${item.id}` });
    });
    db.content.filter((item) => inCompany(item) && hit(item, q, ["title", "type", "category"])).forEach((item) => {
      results.push({ type: "Content", id: item.id, title: item.title, subtitle: item.type, path: "/app/content" });
    });
    db.assessments.filter((item) => inCompany(item) && hit(item, q, ["title"])).forEach((item) => {
      results.push({ type: "Assessments", id: item.id, title: item.title, subtitle: item.type, path: `/app/assessments/${item.id}` });
    });
    db.certificates.filter((item) => inCompany(item) && hit(item, q, ["certificateNumber", "templateName"])).forEach((item) => {
      results.push({ type: "Certificates", id: item.id, title: item.certificateNumber, subtitle: item.templateName, path: "/app/certificates" });
    });
    db.reports.filter((item) => hit(item, q, ["name", "description"])).forEach((item) => {
      results.push({ type: "Reports", id: item.id, title: item.name, subtitle: item.description, path: "/app/reports" });
    });
    return results.slice(0, 12);
  },
};
