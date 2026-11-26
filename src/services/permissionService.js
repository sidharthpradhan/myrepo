import { db } from "./mockStore";
import { copy, delay } from "../utils/helpers";

export const permissionService = {
  async getCatalog() {
    await delay(120);
    return copy(db.permissions);
  },

  flatten(catalog = db.permissions) {
    return catalog.modules.flatMap((module) =>
      module.actions.map((action) => ({
        key: `${module.id}.${action}`,
        moduleId: module.id,
        moduleName: module.name,
        action,
      })),
    );
  },
};
