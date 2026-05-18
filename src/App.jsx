import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate
} from '@/lib/router';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { VerifyOtpPage } from '@/pages/VerifyOtpPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { AddExpensePage } from '@/pages/AddExpensePage';
import { AddIncomePage } from '@/pages/AddIncomePage';
import { BudgetPage } from '@/pages/BudgetPage';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { PricingPage } from '@/pages/PricingPage';
import { AboutPage } from '@/pages/AboutPage';
import { ComingSoonPage } from '@/pages/ComingSoonPage';
import { OtpSentPage } from '@/pages/OtpSentPage';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/otp-sent" element={<OtpSentPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/features" element={<ComingSoonPage title="Features" />} />
      <Route path="/how-it-works" element={<ComingSoonPage title="How it Works" />} />
      <Route path="/testimonials" element={<ComingSoonPage title="Testimonials" />} />
      <Route path="/integrations" element={<ComingSoonPage title="Integrations" />} />
      <Route path="/updates" element={<ComingSoonPage title="Updates" />} />
      <Route path="/blog" element={<ComingSoonPage title="Blog" />} />
      <Route path="/careers" element={<ComingSoonPage title="Careers" />} />
      <Route path="/contact" element={<ComingSoonPage title="Contact" />} />
      <Route path="/privacy" element={<ComingSoonPage title="Privacy Policy" />} />
      <Route path="/terms" element={<ComingSoonPage title="Terms of Service" />} />
      <Route path="/security" element={<ComingSoonPage title="Security" />} />
      
      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            <DashboardPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <DashboardLayout>
            <AnalyticsPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/add-expense" element={
        <ProtectedRoute>
          <DashboardLayout>
            <AddExpensePage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/add-income" element={
        <ProtectedRoute>
          <DashboardLayout>
            <AddIncomePage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/budget" element={
        <ProtectedRoute>
          <DashboardLayout>
            <BudgetPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/transactions" element={
        <ProtectedRoute>
          <DashboardLayout>
            <TransactionsPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <DashboardLayout>
            <SettingsPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
