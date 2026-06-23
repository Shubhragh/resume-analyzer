import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/authStore';

// Layouts
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Resumes } from './pages/Resumes';
import { ResumeDetail } from './pages/ResumeDetail';
import { AnalysisList } from './pages/AnalysisList';
import { Analysis } from './pages/Analysis';
import { Jobs } from './pages/Jobs';
import { Comparison } from './pages/Comparison';
import { Settings } from './pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Layout for authenticated pages
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Dashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resumes"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Resumes />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resumes/:id"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ResumeDetail />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analysis"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <AnalysisList />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analysis/:id"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Analysis />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Jobs />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/comparison"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Comparison />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Settings />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;