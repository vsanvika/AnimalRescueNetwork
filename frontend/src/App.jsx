import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import useAuthStore from './store/authStore';
import useSocket from './hooks/useSocket';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportRescue from './pages/ReportRescue';
import RescueList from './pages/RescueList';
import RescueDetail from './pages/RescueDetail';
import AdoptionList from './pages/AdoptionList';
import AdoptionDetail from './pages/AdoptionDetail';
import AddAnimal from './pages/AddAnimal';
import LostFound from './pages/LostFound';
import Chat from './pages/Chat';
import Volunteers from './pages/Volunteers';
import Donate from './pages/Donate';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Protected route wrapper
const Protected = ({ children, roles }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  const { user } = useAuthStore();
  useSocket(); // Initialize socket connection globally

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/adoption" element={<AdoptionList />} />
          <Route path="/adoption/:id" element={<AdoptionDetail />} />
          <Route path="/lost-found" element={<LostFound />} />

          {/* Protected — any logged-in user */}
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/rescue" element={<Protected><RescueList /></Protected>} />
          <Route path="/rescue/new" element={<Protected><ReportRescue /></Protected>} />
          <Route path="/rescue/:id" element={<Protected><RescueDetail /></Protected>} />
          <Route path="/chat" element={<Protected><Chat /></Protected>} />
          <Route path="/volunteers" element={<Protected><Volunteers /></Protected>} />
          <Route path="/donate" element={<Protected><Donate /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />

          {/* Rescue team + admin */}
          <Route path="/adoption/add" element={<Protected roles={['rescue_team', 'admin']}><AddAnimal /></Protected>} />

          {/* Admin only */}
          <Route path="/admin" element={<Protected roles={['admin']}><AdminPanel /></Protected>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1a2235', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 14 },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </div>
  );
}

export default App;
