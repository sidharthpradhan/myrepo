import activities from "../data/activities.json";
import announcements from "../data/announcements.json";
import assessmentResults from "../data/assessmentResults.json";
import assessments from "../data/assessments.json";
import calendar from "../data/calendar.json";
import certificates from "../data/certificates.json";
import companies from "../data/companies.json";
import content from "../data/content.json";
import courses from "../data/courses.json";
import departments from "../data/departments.json";
import discussions from "../data/discussions.json";
import enrollments from "../data/enrollments.json";
import learningPaths from "../data/learningPaths.json";
import lxp from "../data/lxp.json";
import notifications from "../data/notifications.json";
import permissions from "../data/permissions.json";
import reports from "../data/reports.json";
import roles from "../data/roles.json";
import teams from "../data/teams.json";
import users from "../data/users.json";
import { copy } from "../utils/helpers";

export const db = {
  activities: copy(activities),
  announcements: copy(announcements),
  assessmentResults: copy(assessmentResults),
  assessments: copy(assessments),
  calendar: copy(calendar),
  certificates: copy(certificates),
  companies: copy(companies),
  content: copy(content),
  courses: copy(courses),
  departments: copy(departments),
  discussions: copy(discussions),
  enrollments: copy(enrollments),
  learningPaths: copy(learningPaths),
  lxp: copy(lxp),
  notifications: copy(notifications),
  permissions: copy(permissions),
  reports: copy(reports),
  roles: copy(roles),
  teams: copy(teams),
  users: copy(users),
};
