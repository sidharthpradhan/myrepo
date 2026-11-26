import { teamService } from "../../services/teamService";
import { createListSlice } from "../createListSlice";

const created = createListSlice({
  name: "teams",
  fetchAll: (actor) => teamService.getAll(actor),
  createItem: (payload) => teamService.create(payload),
  updateItem: (id, payload) => teamService.update(id, payload),
  removeItem: (id) => teamService.remove(id),
});

export const fetchTeams = created.fetchItems;
export const createTeam = created.createRecord;
export const updateTeam = created.updateRecord;
export const removeTeam = created.removeRecord;
export default created.slice.reducer;
