import { db } from "./mockStore";
import { copy, delay, nextId } from "../utils/helpers";
import { createResourceService } from "./createResource";

const base = createResourceService("courses");

export const courseService = {
  ...base,
  async duplicate(id) {
    await delay();
    const course = db.courses.find((item) => item.id === Number(id));
    if (!course) throw new Error("Course not found.");
    const clone = {
      ...copy(course),
      id: nextId(db.courses),
      title: `${course.title} (Copy)`,
      status: "draft",
      enrolledCount: 0,
    };
    db.courses.push(clone);
    return copy(clone);
  },
};
