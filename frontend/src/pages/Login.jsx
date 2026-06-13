import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      setUser(data);
      toast.success(`Welcome back, ${data.name}! 🐾`);
      navigate(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.1), transparent 70%)' }} />
      <div className="absolute bottom-[20%] right-[10%] w-[250px] h-[250px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)' }} />

      <div className="glass-card fade-in w-full max-w-[420px] px-9 py-10">
        <div className="text-center mb-8">
          <div className="text-[48px] mb-3">🐾</div>
          <h1 className="font-['Poppins'] font-extrabold text-[28px] text-slate-100 mb-2">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Sign in to your Animal Rescue account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-slate-400 text-[13px] font-medium mb-1.5">Email *</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email" required
                className="input-field pl-[42px]"
                placeholder="you@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-[13px] font-medium mb-1.5">Password *</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPw ? 'text' : 'password'} required
                className="input-field px-[42px]"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-slate-500">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full justify-center p-[13px] text-[15px] mt-2" disabled={loading}>
            {loading ? <Loader size={18} className="spinner" /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-orange-500 font-semibold no-underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
