import { useEffect, useState } from 'react';
import { Users, AlertCircle, TrendingUp, Shield, Loader, Trash2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const AdminPanel = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchUser, setSearchUser] = useState('');

  useEffect(() => {
    Promise.all([
      API.get('/admin/analytics'),
      API.get('/admin/users'),
    ]).then(([a, u]) => {
      setAnalytics(a.data);
      setUsers(u.data);
    }).finally(() => setLoading(false));
  }, []);

  const toggleBlock = async (userId) => {
    try {
      const { data } = await API.put(`/admin/users/${userId}/block`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isBlocked: data.isBlocked } : u));
      toast.success(data.message);
    } catch (e) { toast.error('Failed'); }
  };

  const verifyUser = async (userId) => {
    try {
      await API.put(`/admin/users/${userId}/verify`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isVerified: true } : u));
      toast.success('User verified');
    } catch (e) { toast.error('Failed'); }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('User deleted');
    } catch (e) { toast.error('Failed'); }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchUser.toLowerCase())
  );

  const roleColor = { user: '#0ea5e9', rescue_team: '#f97316', admin: '#a855f7' };

  if (loading) return <div className="text-center p-[100px]"><Loader size={32} className="spinner mx-auto text-orange-500" /></div>;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="page-header">
        <h1 className="font-['Poppins'] text-[32px] font-extrabold text-slate-100 mb-2">⚙️ Admin Dashboard</h1>
        <p className="text-slate-400">Full system control and analytics</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-7 bg-white/5 rounded-xl p-1 w-fit">
        {['overview', 'users', 'donations'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-[22px] py-[9px] rounded-[10px] border-none cursor-pointer font-semibold text-sm capitalize transition-all duration-200 ${activeTab === tab ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white' : 'bg-transparent text-slate-500'}`}>
            {tab === 'overview' ? '📊' : tab === 'users' ? '👥' : '💝'} {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && analytics && (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mb-8">
            {[
              { icon: '👥', label: 'Total Users', value: analytics.totalUsers, color: '#0ea5e9' },
              { icon: '🚨', label: 'Total Rescues', value: analytics.totalRescues, color: '#ef4444' },
              { icon: '🐾', label: 'Animals Listed', value: analytics.totalAnimals, color: '#f97316' },
              { icon: '🤝', label: 'Volunteers', value: analytics.totalVolunteers, color: '#a855f7' },
              { icon: '💝', label: 'Donations (₹)', value: analytics.totalDonations?.toLocaleString(), color: '#22c55e' },
            ].map(s => (
              <div key={s.label} className="glass-card p-6 text-center">
                <div className="text-[32px] mb-2.5">{s.icon}</div>
                <div className="text-[30px] font-['Poppins'] font-extrabold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Rescue Status Breakdown */}
          <div className="glass-card p-7">
            <h3 className="font-bold text-slate-100 text-lg mb-5">Rescues by Status</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3.5">
              {analytics.rescuesByStatus?.map(s => {
                const colors = { pending: '#eab308', accepted: '#0ea5e9', in_progress: '#a855f7', rescued: '#22c55e', closed: '#94a3b8' };
                return (
                  <div key={s._id} className="bg-white/5 rounded-xl p-4 text-center" style={{ border: `1px solid ${colors[s._id]}30` }}>
                    <div className="text-[28px] font-extrabold font-['Poppins']" style={{ color: colors[s._id] }}>{s.count}</div>
                    <div className="text-xs text-slate-500 capitalize mt-1">{s._id?.replace('_', ' ')}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <>
          <div className="mb-4.5">
            <input className="input-field max-w-[360px]" placeholder="Search users by name or email..." value={searchUser} onChange={e => setSearchUser(e.target.value)} />
          </div>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    {['User', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4.5 py-3.5 text-left text-slate-500 text-xs font-semibold uppercase tracking-[0.5px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u._id} className="border-b border-white/5 transition-colors hover:bg-white/5">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center font-bold text-white text-[13px]">{u.name?.[0]}</div>
                          <div>
                            <p className="font-semibold text-slate-100 text-sm">{u.name}</p>
                            {u.isVerified && <span className="text-[10px] text-green-500 font-semibold">✓ Verified</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-[13px]">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize" style={{ background: `${roleColor[u.role]}20`, color: roleColor[u.role] }}>{u.role?.replace('_', ' ')}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${u.isBlocked ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                          {u.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => toggleBlock(u._id)} className={`bg-transparent border border-white/10 rounded-md px-2.5 py-1 cursor-pointer text-xs font-semibold hover:bg-white/5 ${u.isBlocked ? 'text-green-500' : 'text-red-500'}`}>
                            {u.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                          {u.role === 'rescue_team' && !u.isVerified && (
                            <button onClick={() => verifyUser(u._id)} className="bg-green-500/10 border-none rounded-md px-2.5 py-1 cursor-pointer text-green-500 text-xs font-semibold hover:bg-green-500/20">Verify</button>
                          )}
                          {u.role !== 'admin' && (
                            <button onClick={() => deleteUser(u._id)} className="bg-transparent border-none cursor-pointer text-red-500 p-1 hover:text-red-400">
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Donations */}
      {activeTab === 'donations' && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="text-center flex-1 p-5 bg-orange-500/5 rounded-xl">
              <p className="text-[32px] font-['Poppins'] font-extrabold text-orange-500">₹{analytics?.totalDonations?.toLocaleString()}</p>
              <p className="text-[13px] text-slate-500">Total Raised</p>
            </div>
          </div>
          <p className="text-slate-500 text-center text-sm">Detailed donation records available in the database. Connect Razorpay for live payment tracking.</p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
