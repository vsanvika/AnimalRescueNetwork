import { useState } from 'react';
import { User, Mail, Phone, FileText, Camera, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import useAuthStore from '../store/authStore';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', phone: user?.phone || '', password: '' });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.profilePicture || '');
  const [loading, setLoading] = useState(false);

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (avatar) fd.append('profilePicture', avatar);
      const { data } = await API.put('/auth/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(data);
      toast.success('Profile updated!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  const roleColors = { user: '#0ea5e9', rescue_team: '#f97316', admin: '#a855f7' };

  return (
    <div className="max-w-[700px] mx-auto px-6 py-8">
      <div className="page-header">
        <h1 className="font-['Poppins'] text-[32px] font-extrabold text-slate-100 mb-2">My Profile</h1>
        <p className="text-slate-400">Manage your account details</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Avatar */}
        <div className="glass-card p-7 mb-5 flex items-center gap-6">
          <div className="relative">
            {preview
              ? <img src={preview} alt="avatar" className="w-[90px] h-[90px] rounded-full object-cover border-[3px] border-orange-500" />
              : <div className="w-[90px] h-[90px] rounded-full bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center font-['Poppins'] font-extrabold text-[36px] text-white">{user?.name?.[0]}</div>
            }
            <button type="button" onClick={() => document.getElementById('avatar-input').click()}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-orange-500 border-none flex items-center justify-center cursor-pointer">
              <Camera size={14} color="white" />
            </button>
            <input id="avatar-input" type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-100 text-[22px] mb-1">{user?.name}</h2>
            <p className="text-slate-500 text-[13px]">{user?.email}</p>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize mt-1.5 inline-block" style={{ background: `${roleColors[user?.role]}20`, color: roleColors[user?.role] }}>
              {user?.role?.replace('_', ' ')}
              {user?.isVerified && ' ✓'}
            </span>
          </div>
        </div>

        {/* Fields */}
        <div className="glass-card p-7 flex flex-col gap-4.5">
          <h3 className="font-bold text-slate-100 text-base mb-1">Edit Details</h3>

          {[
            { label: 'Full Name', key: 'name', type: 'text', icon: <User size={15} />, placeholder: 'Your name', required: true },
            { label: 'Phone', key: 'phone', type: 'tel', icon: <Phone size={15} />, placeholder: 'Your phone number' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-slate-400 text-[13px] font-medium mb-1.5">
                {field.label}{field.required ? ' *' : ''}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">{field.icon}</span>
                <input type={field.type} required={field.required} className="input-field pl-[42px]" placeholder={field.placeholder} value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} />
              </div>
            </div>
          ))}

          <div>
            <label className="block text-slate-400 text-[13px] font-medium mb-1.5">Bio</label>
            <textarea className="input-field resize-none" rows={3} placeholder="Tell the community about yourself..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </div>

          <div>
            <label className="block text-slate-400 text-[13px] font-medium mb-1.5">New Password (leave blank to keep current)</label>
            <input type="password" className="input-field" placeholder="New password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>

          <button type="submit" className="btn-primary justify-center p-[13px] text-[15px]" disabled={loading}>
            {loading ? <Loader size={18} className="spinner" /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
