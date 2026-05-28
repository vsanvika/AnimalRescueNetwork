import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Heart, MessageCircle, Users, TrendingUp, Plus } from 'lucide-react';
import useAuthStore from '../store/authStore';
import API from '../api/axios';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ myReports: 0, myAdoptions: 0, pendingCount: 0 });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get('/rescue');
        setRecentReports(data.slice(0, 4));
        setStats({
          myReports: data.length,
          pendingCount: data.filter((r) => r.status === 'pending').length,
          inProgress: data.filter((r) => r.status === 'in_progress').length,
        });
      } catch (e) {}
      setLoading(false);
    };
    fetchData();
  }, []);

  const roleActions = {
    user: [
      { icon: '🚨', title: 'Report Animal', desc: 'Report an injured or lost animal', link: '/rescue/new', color: '#ef4444' },
      { icon: '🐾', title: 'Browse Adoptions', desc: 'Find your perfect companion', link: '/adoption', color: '#f97316' },
      { icon: '🔍', title: 'Lost & Found', desc: 'Search for lost pets', link: '/lost-found', color: '#0ea5e9' },
      { icon: '💬', title: 'Chat', desc: 'Talk to rescue teams', link: '/chat', color: '#22c55e' },
    ],
    rescue_team: [
      { icon: '📋', title: 'All Reports', desc: 'View and accept rescue reports', link: '/rescue', color: '#ef4444' },
      { icon: '🐾', title: 'Add Animal', desc: 'List an animal for adoption', link: '/adoption/add', color: '#f97316' },
      { icon: '💬', title: 'Chat', desc: 'Communicate with users', link: '/chat', color: '#22c55e' },
      { icon: '👥', title: 'Volunteers', desc: 'Manage rescue volunteers', link: '/volunteers', color: '#a855f7' },
    ],
    admin: [
      { icon: '⚙️', title: 'Admin Panel', desc: 'Full system control', link: '/admin', color: '#f97316' },
      { icon: '📊', title: 'Analytics', desc: 'View platform statistics', link: '/admin', color: '#0ea5e9' },
      { icon: '👥', title: 'Users', desc: 'Manage all users', link: '/admin', color: '#a855f7' },
      { icon: '💝', title: 'Donations', desc: 'View donation records', link: '/admin', color: '#ec4899' },
    ],
  };

  const statusColors = { pending: '#eab308', accepted: '#0ea5e9', in_progress: '#a855f7', rescued: '#22c55e', closed: '#94a3b8' };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Welcome */}
      <div className="page-header">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="font-['Poppins'] text-[32px] font-extrabold text-slate-100 mb-2">
              Welcome back, {user?.name?.split(' ')[0]}! 🐾
            </h1>
            <p className="text-slate-400 text-[15px]">
              Role: <span className="text-orange-500 font-semibold capitalize">{user?.role?.replace('_', ' ')}</span>
              {user?.isVerified && <span className="ml-2 text-green-500 text-xs">✓ Verified</span>}
            </p>
          </div>
          <Link to="/rescue/new" className="btn-primary">
            <Plus size={16} /> Report Animal
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 mb-8">
        {[
          { icon: '🚨', label: 'Total Reports', value: stats.myReports, color: '#ef4444' },
          { icon: '⏳', label: 'Pending', value: stats.pendingCount, color: '#eab308' },
          { icon: '🔄', label: 'In Progress', value: stats.inProgress || 0, color: '#a855f7' },
        ].map((s) => (
          <div key={s.label} className="glass-card p-5 text-center">
            <div className="text-[28px] mb-2">{s.icon}</div>
            <div className="text-[32px] font-extrabold font-['Poppins']" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="font-bold text-slate-100 text-xl mb-4">Quick Actions</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-10">
        {(roleActions[user?.role] || roleActions.user).map((action) => (
          <Link key={action.title} to={action.link} className="no-underline">
            <div className="glass-card p-5 cursor-pointer">
              <div className="w-[44px] h-[44px] rounded-xl flex items-center justify-center text-[22px] mb-3" style={{ background: `${action.color}20` }}>
                {action.icon}
              </div>
              <h3 className="font-bold text-slate-100 text-base mb-1.5">{action.title}</h3>
              <p className="text-[13px] text-slate-500">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Reports */}
      {recentReports.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-slate-100 text-xl">Recent Reports</h2>
            <Link to="/rescue" className="text-orange-500 text-sm font-semibold no-underline">View All →</Link>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
            {recentReports.map((report) => (
              <Link key={report._id} to={`/rescue/${report._id}`} className="no-underline">
                <div className="glass-card p-4 flex gap-3 items-center cursor-pointer">
                  <div className="w-[44px] h-[44px] rounded-[10px] bg-orange-500/10 flex items-center justify-center text-[22px] shrink-0">
                    {report.animalType === 'dog' ? '🐕' : report.animalType === 'cat' ? '🐈' : '🐾'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-100 capitalize">{report.animalType}</p>
                    <p className="text-xs text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">{report.description}</p>
                  </div>
                  <span className="px-2 py-1 rounded-lg text-[11px] font-semibold shrink-0 capitalize" style={{ background: `${statusColors[report.status]}20`, color: statusColors[report.status] }}>
                    {report.status.replace('_', ' ')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
