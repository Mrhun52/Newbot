import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Money } from './pages/Money';
import { Cars } from './pages/Cars';
import { Unlock } from './pages/Unlock';
import { Account } from './pages/Account';
import { History } from './pages/History';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ToastContainer } from './components/ui/ToastContainer';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><DashboardLayout><Navigate to="/dashboard" replace /></DashboardLayout></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/money" element={<ProtectedRoute><DashboardLayout><Money /></DashboardLayout></ProtectedRoute>} />
        <Route path="/cars" element={<ProtectedRoute><DashboardLayout><Cars /></DashboardLayout></ProtectedRoute>} />
        <Route path="/unlock" element={<ProtectedRoute><DashboardLayout><Unlock /></DashboardLayout></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><DashboardLayout><Account /></DashboardLayout></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><DashboardLayout><History /></DashboardLayout></ProtectedRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}
