import { roleService } from "../../services/roleService";
import { createListSlice } from "../createListSlice";

const created = createListSlice({
  name: "roles",
  fetchAll: (actor) => roleService.getAll(actor),
  fetchOne: (id, actor) => roleService.getById(id, actor),
  createItem: (payload) => roleService.create(payload),
  updateItem: (id, payload) => roleService.update(id, payload),
  removeItem: (id) => roleService.remove(id),
});

export const fetchRoles = created.fetchItems;
export const fetchRole = created.fetchItem;
export const createRole = created.createRecord;
export const updateRole = created.updateRecord;
export const removeRole = created.removeRecord;
export default created.slice.reducer;
