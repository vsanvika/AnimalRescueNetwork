import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import useAuthStore from '../store/authStore';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      setUser(data);
      toast.success('Account created! Welcome to AnimalRescue 🐾');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute top-[15%] right-[10%] w-[300px] h-[300px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.1), transparent 70%)' }} />
      <div className="absolute bottom-[15%] left-[10%] w-[250px] h-[250px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.1), transparent 70%)' }} />

      <div className="glass-card fade-in w-full max-w-[440px] px-9 py-10">
        <div className="text-center mb-8">
          <div className="text-[48px] mb-3">🐾</div>
          <h1 className="font-['Poppins'] font-extrabold text-[28px] text-slate-100 mb-2">Join the Network</h1>
          <p className="text-slate-500 text-sm">Create your Animal Rescue account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-slate-400 text-[13px] font-medium mb-1.5">Full Name *</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" required className="input-field pl-[42px]" placeholder="Your full name"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-[13px] font-medium mb-1.5">Email *</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="email" required className="input-field pl-[42px]" placeholder="you@email.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-[13px] font-medium mb-1.5">I am a...</label>
            <select className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="user">Regular User (Report / Adopt)</option>
              <option value="rescue_team">Rescue Team Member</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-[13px] font-medium mb-1.5">Password *</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type={showPw ? 'text' : 'password'} required className="input-field px-[42px]" placeholder="Min 6 characters"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-slate-500">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full justify-center p-[13px] text-[15px] mt-2" disabled={loading}>
            {loading ? <Loader size={18} className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-500 font-semibold no-underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
