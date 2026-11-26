import { createResourceService } from "./createResource";
import { db } from "./mockStore";
import { byCompany, copy, delay } from "../utils/helpers";

const base = createResourceService("notifications");

export const notificationService = {
  ...base,
  async getForUser(user) {
    await delay();
    return copy(
      db.notifications.filter((item) => {
        if (item.userId === user.id) return true;
        if (user.companyId == null && item.companyId == null) return true;
        return false;
      }),
    );
  },
  async markRead(id) {
    return base.update(id, { read: true });
  },
  async markAllRead(userId) {
    await delay();
    db.notifications.forEach((item) => {
      if (item.userId === userId) item.read = true;
    });
    return copy(db.notifications.filter((item) => item.userId === userId));
  },
};

export const announcementService = createResourceService("announcements");
export const discussionService = createResourceService("discussions");
export const calendarService = createResourceService("calendar");
export const activityService = {
  async getAll(actor) {
    await delay();
    return byCompany(db.activities, actor);
  },
};
