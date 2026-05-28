import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Bell } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Rescue Reports', to: '/rescue' },
    { label: 'Adopt', to: '/adoption' },
    { label: 'Lost & Found', to: '/lost-found' },
    { label: 'Volunteers', to: '/volunteers' },
    { label: 'Donate', to: '/donate' },
  ];

  return (
    <nav className="bg-[#0a0f1e]/90 backdrop-blur-[20px] border-b border-white/10 sticky top-0 z-[100]">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-[10px] flex items-center justify-center">
            <span className="text-[20px]">🐾</span>
          </div>
          <span className="font-['Poppins',sans-serif] font-bold text-lg text-slate-100">
            Animal<span className="text-orange-500">Rescue</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="flex items-center gap-6 hidden-mobile">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="text-slate-400 no-underline text-sm font-medium transition-colors duration-200 hover:text-orange-500">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {['rescue_team', 'admin'].includes(user.role) && (
                <Link to="/adoption/add" className="btn-primary px-3.5 py-1.5 text-[13px]">Add Animal</Link>
              )}
              <NotificationBell />
              {user.role === 'admin' && (
                <Link to="/admin" className="btn-secondary px-3.5 py-1.5 text-[13px]">Admin</Link>
              )}
              <Link to="/dashboard" className="flex items-center gap-2 no-underline bg-white/5 rounded-[10px] px-3 py-1.5 border border-white/10">
                {user.profilePicture
                  ? <img src={user.profilePicture} alt="avatar" className="w-7 h-7 rounded-full object-cover" />
                  : <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">{user.name?.[0]?.toUpperCase()}</div>
                }
                <span className="text-[13px] text-slate-100 font-medium">{user.name?.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="bg-transparent border-none cursor-pointer text-slate-400 flex items-center hover:text-orange-500 transition-colors" title="Logout">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary px-4.5 py-2 text-sm">Login</Link>
              <Link to="/register" className="btn-primary px-4.5 py-2 text-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
