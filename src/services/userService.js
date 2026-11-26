import { db } from "./mockStore";
import { byCompany, copy, delay, nextId } from "../utils/helpers";
import { createResourceService } from "./createResource";

const base = createResourceService("users");

function safe(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  return copy(rest);
}

export const userService = {
  async getUsers(actor) {
    await delay();
    return byCompany(db.users, actor).map(safe);
  },
  async getUser(id, actor) {
    await delay();
    return safe(byCompany(db.users, actor).find((item) => item.id === Number(id)));
  },
  async createUser(payload) {
    await delay();
    const user = {
      id: nextId(db.users),
      status: payload.status || "active",
      password: payload.password || "Password123",
      points: 0,
      level: 1,
      streak: 0,
      badges: [],
      lastLogin: null,
      avatar: `${payload.firstName?.[0] || "U"}${payload.lastName?.[0] || ""}`.toUpperCase(),
      name: `${payload.firstName || ""} ${payload.lastName || ""}`.trim(),
      ...payload,
    };
    db.users.push(user);
    return safe(user);
  },
  async updateUser(id, payload) {
    const updated = await base.update(id, {
      ...payload,
      name: payload.firstName || payload.lastName
        ? `${payload.firstName || ""} ${payload.lastName || ""}`.trim()
        : payload.name,
    });
    return safe(updated);
  },
  async deleteUser(id) {
    return safe(await base.remove(id));
  },
  async inviteUser(payload) {
    return this.createUser({ ...payload, status: "invited" });
  },
};
