import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { BookmarkProvider } from './hooks/useBookmarks';

import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import HackathonDetailPage from './pages/HackathonDetailPage';
import NotFoundPage from './pages/NotFoundPage';

import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminHackathonsPage from './pages/admin/AdminHackathonsPage';
import HackathonFormPage from './pages/admin/HackathonFormPage';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';
import AdminSetupPage from './pages/admin/AdminSetupPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <BookmarkProvider>
            <Routes>
              {/* Public */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/hackathon/:id" element={<HackathonDetailPage />} />
              </Route>

              {/* Admin auth */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/setup" element={<AdminSetupPage />} />

              {/* Admin protected */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="hackathons" element={<AdminHackathonsPage />} />
                <Route path="hackathons/new" element={<HackathonFormPage />} />
                <Route path="hackathons/:id/edit" element={<HackathonFormPage />} />
                <Route path="applications" element={<AdminApplicationsPage />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>

            <Toaster
              position="bottom-right"
              toastOptions={{
                className: '!bg-surface-800 !text-surface-100 !text-sm !rounded-xl !shadow-2xl !border !border-white/5',
                duration: 3000,
              }}
            />
          </BookmarkProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
