import { departmentService } from "../../services/departmentService";
import { createListSlice } from "../createListSlice";

const created = createListSlice({
  name: "departments",
  fetchAll: (actor) => departmentService.getAll(actor),
  createItem: (payload) => departmentService.create(payload),
  updateItem: (id, payload) => departmentService.update(id, payload),
  removeItem: (id) => departmentService.remove(id),
});

export const fetchDepartments = created.fetchItems;
export const createDepartment = created.createRecord;
export const updateDepartment = created.updateRecord;
export const removeDepartment = created.removeRecord;
export default created.slice.reducer;
