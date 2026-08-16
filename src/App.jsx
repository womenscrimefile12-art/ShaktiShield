import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EmergencyContacts from './pages/EmergencyContacts';
import SOS from './pages/SOS';
import SafetyTips from './pages/SafetyTips';
import SelfDefense from './pages/SelfDefense';
import ReportIncident from './pages/ReportIncident';
import SafePlaces from './pages/SafePlaces';
import Helpline from './pages/Helpline';
import AdminDashboard from './admin/AdminDashboard';
import Users from './admin/Users';
import Reports from './admin/Reports';
import SOSAlerts from './admin/SOSAlerts';
import Analytics from './admin/Analytics';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" />;
  return children;
};

const AppLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <Sidebar />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '1.5rem' }}>{children}</main>
    </div>
  </div>
);

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
      <Route path="/contacts" element={<ProtectedRoute><AppLayout><EmergencyContacts /></AppLayout></ProtectedRoute>} />
      <Route path="/sos" element={<ProtectedRoute><AppLayout><SOS /></AppLayout></ProtectedRoute>} />
      <Route path="/safety-tips" element={<ProtectedRoute><AppLayout><SafetyTips /></AppLayout></ProtectedRoute>} />
      <Route path="/self-defense" element={<ProtectedRoute><AppLayout><SelfDefense /></AppLayout></ProtectedRoute>} />
      <Route path="/report" element={<ProtectedRoute><AppLayout><ReportIncident /></AppLayout></ProtectedRoute>} />
      <Route path="/report-incident" element={<ProtectedRoute><AppLayout><ReportIncident /></AppLayout></ProtectedRoute>} />
      <Route path="/safe-places" element={<ProtectedRoute><AppLayout><SafePlaces /></AppLayout></ProtectedRoute>} />
      <Route path="/helpline" element={<ProtectedRoute><AppLayout><Helpline /></AppLayout></ProtectedRoute>} />

      <Route path="/admin" element={<ProtectedRoute adminOnly><AppLayout><AdminDashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute adminOnly><AppLayout><Users /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute adminOnly><AppLayout><Reports /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/sos" element={<ProtectedRoute adminOnly><AppLayout><SOSAlerts /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><AppLayout><Analytics /></AppLayout></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
