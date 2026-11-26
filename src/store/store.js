import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice";
import companies from "./slices/companySlice";
import courses from "./slices/courseSlice";
import departments from "./slices/departmentSlice";
import learning from "./slices/learningSlice";
import notifications from "./slices/notificationSlice";
import roles from "./slices/roleSlice";
import teams from "./slices/teamSlice";
import theme from "./slices/themeSlice";
import users from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth,
    theme,
    companies,
    users,
    roles,
    departments,
    teams,
    courses,
    learning,
    notifications,
  },
});
