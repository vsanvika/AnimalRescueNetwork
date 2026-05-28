import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import useAuthStore from '../store/authStore';

const Volunteers = () => {
  const { user } = useAuthStore();
  const [volunteers, setVolunteers] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ skills: '', availability: 'part_time', bio: '', location: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get('/volunteers/me');
        setMyProfile(data);
      } catch (e) {}
      if (user?.role === 'admin') {
        try {
          const { data } = await API.get('/volunteers');
          setVolunteers(data);
        } catch (e) {}
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistering(true);
    try {
      const payload = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) };
      const { data } = await API.post('/volunteers/register', payload);
      setMyProfile(data);
      setShowForm(false);
      toast.success('Volunteer registration submitted!');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    setRegistering(false);
  };

  const statusColors = { active: '#22c55e', inactive: '#94a3b8', pending: '#eab308' };

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      <div className="page-header">
        <h1 className="font-['Poppins'] text-[32px] font-extrabold text-slate-100 mb-2">🤝 Volunteer Program</h1>
        <p className="text-slate-400">Join our network and help save animal lives</p>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[['320+', 'Active Volunteers', '#f97316'], ['2400+', 'Rescues Completed', '#22c55e'], ['50+', 'Cities Covered', '#0ea5e9']].map(([v, l, c]) => (
          <div key={l} className="glass-card p-6 text-center">
            <div className="text-[36px] font-['Poppins'] font-extrabold" style={{ color: c }}>{v}</div>
            <div className="text-[13px] text-slate-500 mt-1">{l}</div>
          </div>
        ))}
      </div>

      {/* My Volunteer Profile */}
      {!loading && myProfile ? (
        <div className="glass-card p-7 mb-7">
          <h2 className="font-bold text-slate-100 text-xl mb-4">My Volunteer Profile</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
            {[
              ['Status', myProfile.status, statusColors[myProfile.status]],
              ['Availability', myProfile.availability?.replace('_', ' '), '#0ea5e9'],
              ['Total Rescues', myProfile.totalRescues, '#f97316'],
              ['Assigned', myProfile.assignedRescues?.length, '#a855f7'],
            ].map(([k, v, c]) => (
              <div key={k} className="bg-white/5 rounded-[10px] py-3.5 px-4">
                <p className="text-xs text-slate-500 mb-1">{k}</p>
                <p className="font-bold text-lg capitalize" style={{ color: c || '#f1f5f9' }}>{v}</p>
              </div>
            ))}
          </div>
          {myProfile.skills?.length > 0 && (
            <div className="mt-4">
              <p className="text-[13px] text-slate-500 mb-2">Skills:</p>
              <div className="flex gap-2 flex-wrap">
                {myProfile.skills.map(s => (
                  <span key={s} className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-xs font-semibold">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : !loading && !myProfile && (
        <div className="glass-card p-9 mb-7 text-center">
          <div className="text-[56px] mb-4">🤝</div>
          <h2 className="font-extrabold text-slate-100 text-2xl mb-2">Become a Volunteer</h2>
          <p className="text-slate-400 max-w-[480px] mx-auto mb-6">
            Join our rescue network and help save lives. Volunteers are the backbone of every successful rescue.
          </p>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary px-8 py-3 text-[15px]">
            Register as Volunteer
          </button>
        </div>
      )}

      {/* Registration Form */}
      {showForm && (
        <form onSubmit={handleRegister} className="glass-card p-7 mb-7 flex flex-col gap-4">
          <h3 className="font-bold text-slate-100 text-lg">Volunteer Registration</h3>
          <div>
            <label className="block text-slate-400 text-[13px] mb-1.5">Skills (comma separated)</label>
            <input className="input-field" placeholder="e.g. First Aid, Animal Handling, Driving" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
          </div>
          <div>
            <label className="block text-slate-400 text-[13px] mb-1.5">Availability</label>
            <select className="input-field" value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })}>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="weekends">Weekends Only</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-[13px] mb-1.5">Location</label>
            <input className="input-field" placeholder="Your city" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="block text-slate-400 text-[13px] mb-1.5">Bio</label>
            <textarea className="input-field" rows={3} placeholder="Tell us about yourself and why you want to volunteer..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div className="flex gap-2.5">
            <button type="submit" className="btn-primary" disabled={registering}>{registering ? <Loader size={16} className="spinner" /> : 'Submit'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {/* Admin: All Volunteers */}
      {user?.role === 'admin' && volunteers.length > 0 && (
        <>
          <h2 className="font-bold text-slate-100 text-xl mb-4">All Volunteers</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {volunteers.map(v => (
              <div key={v._id} className="glass-card p-5">
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center font-bold text-white text-base">
                    {v.user?.name?.[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-100">{v.user?.name}</p>
                    <span className="text-[11px] font-semibold" style={{ color: statusColors[v.status] }}>{v.status}</span>
                  </div>
                </div>
                <div className="flex gap-2 justify-between text-[13px]">
                  <span className="text-slate-500">Rescues: <span className="text-orange-500 font-bold">{v.totalRescues}</span></span>
                  <span className="text-slate-500 capitalize">{v.availability?.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Volunteers;
