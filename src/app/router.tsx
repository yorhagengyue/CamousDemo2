import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './layout';
import { LoginPage } from '@/features/auth/LoginPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <Layout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: 'messages',
            lazy: () => import('@/features/messages/MessagesPage'),
          },
          {
            path: 'students',
            lazy: () => import('@/features/profiles/StudentsPage'),
          },
          {
            path: 'students/:id',
            lazy: () => import('@/features/profiles/StudentDetailPage'),
          },
          {
            path: 'teachers',
            lazy: () => import('@/features/profiles/TeachersPage'),
          },
          {
            path: 'teachers/:id',
            lazy: () => import('@/features/profiles/TeacherDetailPage'),
          },
          {
            path: 'courses',
            lazy: () => import('@/features/courses/CoursesPage'),
          },
          {
            path: 'courses/:id',
            lazy: () => import('@/features/courses/CourseDetailPage'),
          },
          {
            path: 'enrolment',
            lazy: () => import('@/features/enrolment/EnrolmentPage'),
          },
          {
            path: 'attendance',
            lazy: () => import('@/features/attendance/AttendancePage'),
          },
          {
            path: 'leave',
            lazy: () => import('@/features/leaves/LeavePage'),
          },
          {
            path: 'reports',
            lazy: () => import('@/features/reports/ReportsPage'),
          },
          {
            path: 'admin',
            lazy: () => import('@/features/admin/AdminPage'),
          },
          {
            path: 'settings',
            lazy: () => import('@/features/settings/SettingsPage'),
          },
          {
            path: 'labs',
            lazy: () => import('@/features/labs/LabsPage'),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
