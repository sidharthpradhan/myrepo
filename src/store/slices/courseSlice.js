import { courseService } from "../../services/courseService";
import { createListSlice } from "../createListSlice";

const created = createListSlice({
  name: "courses",
  fetchAll: (actor) => courseService.getAll(actor),
  fetchOne: (id, actor) => courseService.getById(id, actor),
  createItem: (payload) => courseService.create(payload),
  updateItem: (id, payload) => courseService.update(id, payload),
  removeItem: (id) => courseService.remove(id),
});

export const fetchCourses = created.fetchItems;
export const fetchCourse = created.fetchItem;
export const createCourse = created.createRecord;
export const updateCourse = created.updateRecord;
export const removeCourse = created.removeRecord;
export default created.slice.reducer;
