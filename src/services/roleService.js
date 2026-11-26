import { db } from "./mockStore";
import { copy, delay, nextId } from "../utils/helpers";
import { createResourceService } from "./createResource";

const base = createResourceService("roles");

export const roleService = {
  ...base,
  async duplicate(id) {
    await delay();
    const role = db.roles.find((item) => item.id === Number(id));
    if (!role) throw new Error("Role not found.");
    const clone = {
      ...copy(role),
      id: nextId(db.roles),
      name: `${role.name} (Copy)`,
      slug: `${role.slug}-copy-${Date.now()}`,
      isSystem: false,
    };
    db.roles.push(clone);
    return copy(clone);
  },
};
