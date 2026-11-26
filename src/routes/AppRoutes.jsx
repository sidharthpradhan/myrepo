import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import PermissionRoute from "./PermissionRoute";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import CompanyListPage from "../pages/companies/CompanyListPage";
import CompanyDetailsPage from "../pages/companies/CompanyDetailsPage";
import UserListPage from "../pages/users/UserListPage";
import UserDetailsPage from "../pages/users/UserDetailsPage";
import RoleListPage from "../pages/roles/RoleListPage";
import DepartmentListPage from "../pages/departments/DepartmentListPage";
import TeamListPage from "../pages/teams/TeamListPage";
import CourseListPage from "../pages/courses/CourseListPage";
import CourseDetailsPage from "../pages/courses/CourseDetailsPage";
import CoursePlayerPage from "../pages/courses/CoursePlayerPage";
import LearnHomePage from "../pages/learn/LearnHomePage";
import LearningPathListPage from "../pages/learningPaths/LearningPathListPage";
import LearningPathDetailsPage from "../pages/learningPaths/LearningPathDetailsPage";
import AssessmentListPage from "../pages/assessments/AssessmentListPage";
import AssessmentDetailsPage from "../pages/assessments/AssessmentDetailsPage";
import TakeAssessmentPage from "../pages/assessments/TakeAssessmentPage";
import CertificateListPage from "../pages/certificates/CertificateListPage";
import ContentLibraryPage from "../pages/content/ContentLibraryPage";
import CalendarPage from "../pages/calendar/CalendarPage";
import ReportsPage from "../pages/reports/ReportsPage";
import AnnouncementsPage from "../pages/announcements/AnnouncementsPage";
import DiscussionsPage from "../pages/discussions/DiscussionsPage";
import LeaderboardPage from "../pages/gamification/LeaderboardPage";
import NotificationsPage from "../pages/notifications/NotificationsPage";
import SettingsPage from "../pages/settings/SettingsPage";
import ProfilePage from "../pages/settings/ProfilePage";
import HelpPage from "../pages/settings/HelpPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="help" element={<HelpPage />} />

          <Route element={<PermissionRoute permission="companies.view" />}>
            <Route path="companies" element={<CompanyListPage />} />
            <Route path="companies/:id" element={<CompanyDetailsPage />} />
          </Route>
          <Route element={<PermissionRoute permission="users.view" />}>
            <Route path="users" element={<UserListPage />} />
            <Route path="users/:id" element={<UserDetailsPage />} />
          </Route>
          <Route element={<PermissionRoute permission="roles.view" />}>
            <Route path="roles" element={<RoleListPage />} />
          </Route>
          <Route element={<PermissionRoute permission="departments.view" />}>
            <Route path="departments" element={<DepartmentListPage />} />
          </Route>
          <Route element={<PermissionRoute permission="teams.view" />}>
            <Route path="teams" element={<TeamListPage />} />
          </Route>
          <Route element={<PermissionRoute permission="courses.view" />}>
            <Route path="courses" element={<CourseListPage />} />
            <Route path="courses/:id" element={<CourseDetailsPage />} />
          </Route>
          <Route element={<PermissionRoute permission="learn.view" />}>
            <Route path="learn" element={<LearnHomePage />} />
            <Route path="learn/courses/:id" element={<CoursePlayerPage />} />
          </Route>
          <Route element={<PermissionRoute permission="learningPaths.view" />}>
            <Route path="learning-paths" element={<LearningPathListPage />} />
            <Route path="learning-paths/:id" element={<LearningPathDetailsPage />} />
          </Route>
          <Route element={<PermissionRoute permission="assessments.view" />}>
            <Route path="assessments" element={<AssessmentListPage />} />
            <Route path="assessments/:id" element={<AssessmentDetailsPage />} />
            <Route path="assessments/:id/take" element={<TakeAssessmentPage />} />
          </Route>
          <Route element={<PermissionRoute permission="certificates.view" />}>
            <Route path="certificates" element={<CertificateListPage />} />
          </Route>
          <Route element={<PermissionRoute permission="content.view" />}>
            <Route path="content" element={<ContentLibraryPage />} />
          </Route>
          <Route element={<PermissionRoute permission="calendar.view" />}>
            <Route path="calendar" element={<CalendarPage />} />
          </Route>
          <Route element={<PermissionRoute permission="reports.view" />}>
            <Route path="reports" element={<ReportsPage />} />
          </Route>
          <Route element={<PermissionRoute permission="announcements.view" />}>
            <Route path="announcements" element={<AnnouncementsPage />} />
          </Route>
          <Route element={<PermissionRoute permission="discussions.view" />}>
            <Route path="discussions" element={<DiscussionsPage />} />
          </Route>
          <Route element={<PermissionRoute permission="gamification.view" />}>
            <Route path="leaderboard" element={<LeaderboardPage />} />
          </Route>
          <Route element={<PermissionRoute permission="notifications.view" />}>
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
          <Route element={<PermissionRoute permission="settings.view" />}>
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
