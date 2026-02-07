import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Layout } from '../components/layout';
import { ProtectedRoute } from './ProtectedRoute';

// Auth pages
import { LoginPage, RegisterPage } from '../pages/auth';

// Protected pages
import { DashboardPage } from '../pages/DashboardPage';
import { InboxPage } from '../pages/inbox';
import { NextActionsPage, WaitingForPage, ScheduledPage, SomedayPage } from '../pages/lists';
import { ProjectsPage, ProjectDetailPage } from '../pages/projects';
import { ContextsPage } from '../pages/contexts';
import { FamilyPage } from '../pages/family';
import { WeeklyReviewPage } from '../pages/review';

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
}

const router = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },

  // Protected routes
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
      {
        path: '/inbox',
        element: <InboxPage />,
      },
      {
        path: '/next-actions',
        element: <NextActionsPage />,
      },
      {
        path: '/waiting-for',
        element: <WaitingForPage />,
      },
      {
        path: '/scheduled',
        element: <ScheduledPage />,
      },
      {
        path: '/someday',
        element: <SomedayPage />,
      },
      {
        path: '/projects',
        element: <ProjectsPage />,
      },
      {
        path: '/projects/:id',
        element: <ProjectDetailPage />,
      },
      {
        path: '/contexts',
        element: <ContextsPage />,
      },
      {
        path: '/family',
        element: <FamilyPage />,
      },
      {
        path: '/review',
        element: <WeeklyReviewPage />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
