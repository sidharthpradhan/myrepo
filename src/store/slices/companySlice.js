import { companyService } from "../../services/companyService";
import { createListSlice } from "../createListSlice";

const created = createListSlice({
  name: "companies",
  fetchAll: (actor) => companyService.getAll(actor),
  fetchOne: (id, actor) => companyService.getById(id, actor),
  createItem: (payload) => companyService.create(payload),
  updateItem: (id, payload) => companyService.update(id, payload),
  removeItem: (id) => companyService.remove(id),
});

export const fetchCompanies = created.fetchItems;
export const fetchCompany = created.fetchItem;
export const createCompany = created.createRecord;
export const updateCompany = created.updateRecord;
export const removeCompany = created.removeRecord;
export default created.slice.reducer;
