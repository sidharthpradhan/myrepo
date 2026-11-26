import { userService } from "../../services/userService";
import { createListSlice } from "../createListSlice";

const created = createListSlice({
  name: "users",
  fetchAll: (actor) => userService.getUsers(actor),
  fetchOne: (id, actor) => userService.getUser(id, actor),
  createItem: (payload) => userService.createUser(payload),
  updateItem: (id, payload) => userService.updateUser(id, payload),
  removeItem: (id) => userService.deleteUser(id),
});

export const fetchUsers = created.fetchItems;
export const fetchUser = created.fetchItem;
export const createUser = created.createRecord;
export const updateUser = created.updateRecord;
export const removeUser = created.removeRecord;
export default created.slice.reducer;
