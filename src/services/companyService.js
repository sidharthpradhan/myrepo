import { db } from "./mockStore";
import { copy, delay, nextId } from "../utils/helpers";
import { createResourceService } from "./createResource";

const base = createResourceService("companies");

export const companyService = {
  ...base,
  async getAll(actor) {
    await delay();
    if (!actor || actor.companyId == null) return copy(db.companies);
    return copy(db.companies.filter((company) => company.id === actor.companyId));
  },
  async getById(id, actor) {
    await delay();
    const company = db.companies.find((item) => item.id === Number(id));
    if (!company) return null;
    if (actor?.companyId != null && company.id !== actor.companyId) return null;
    return copy(company);
  },
  async assignAdmin(companyId, adminUserId) {
    await delay();
    const company = db.companies.find((item) => item.id === Number(companyId));
    if (!company) throw new Error("Company not found.");
    company.adminUserId = adminUserId;
    return copy(company);
  },
  async create(payload) {
    await delay();
    const company = {
      id: nextId(db.companies),
      status: "active",
      logo: (payload.name || "C").slice(0, 2).toUpperCase(),
      settings: {
        allowSelfEnrollment: true,
        certificatePrefix: "ORG",
        learningReminders: true,
      },
      createdAt: new Date().toISOString().slice(0, 10),
      ...payload,
    };
    db.companies.push(company);
    return copy(company);
  },
};
