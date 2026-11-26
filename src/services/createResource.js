import { db } from "./mockStore";
import { byCompany, copy, delay, nextId } from "../utils/helpers";

export function createResourceService(key) {
  return {
    async getAll(actor) {
      await delay();
      return byCompany(db[key], actor);
    },
    async getById(id, actor) {
      await delay();
      const item = byCompany(db[key], actor).find((entry) => entry.id === Number(id));
      return item ? copy(item) : null;
    },
    async create(payload) {
      await delay();
      const item = { id: nextId(db[key]), ...payload };
      db[key].push(item);
      return copy(item);
    },
    async update(id, payload) {
      await delay();
      const index = db[key].findIndex((entry) => entry.id === Number(id));
      if (index === -1) throw new Error("Record not found.");
      db[key][index] = { ...db[key][index], ...payload, id: db[key][index].id };
      return copy(db[key][index]);
    },
    async remove(id) {
      await delay();
      const index = db[key].findIndex((entry) => entry.id === Number(id));
      if (index === -1) throw new Error("Record not found.");
      const [removed] = db[key].splice(index, 1);
      return copy(removed);
    },
  };
}
