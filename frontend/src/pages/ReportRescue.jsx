import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Upload, Loader, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const emergencyOptions = [
  { value: 'low', label: '🟢 Low — Animal is alive, minor injury' },
  { value: 'medium', label: '🟡 Medium — Needs attention soon' },
  { value: 'high', label: '🟠 High — Serious injury, urgent help' },
  { value: 'critical', label: '🔴 Critical — Life-threatening emergency' },
];

const ReportRescue = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ animalType: 'dog', description: '', emergencyLevel: 'medium', address: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [gettingLoc, setGettingLoc] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const getLocation = () => {
    setGettingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.success('Location captured!');
        setGettingLoc(false);
      },
      () => { toast.error('Could not get location'); setGettingLoc(false); }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.lat) return toast.error('Please capture your location');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries({ ...form, lat: location.lat, lng: location.lng }).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      await API.post('/rescue', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Rescue report submitted! Teams are notified. 🚨');
      navigate('/rescue');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[720px] mx-auto px-6 py-8">
      <div className="page-header mb-8">
        <h1 className="font-['Poppins'] text-[32px] font-extrabold text-slate-100 mb-2">🚨 Report Rescue</h1>
        <p className="text-slate-400">Submit a report and rescue teams will be notified immediately</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 flex flex-col gap-5">
        {/* Animal Type */}
        <div>
          <label className="block text-slate-400 text-[13px] font-medium mb-2">Animal Type *</label>
          <div className="grid grid-cols-3 gap-2.5">
            {['dog', 'cat', 'bird', 'cow', 'horse', 'other'].map((type) => (
              <button key={type} type="button"
                onClick={() => setForm({ ...form, animalType: type })}
                className={`p-2.5 rounded-[10px] border cursor-pointer font-semibold text-[13px] capitalize transition-all duration-200 ${form.animalType === type ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-white/10 bg-white/5 text-slate-400'}`}>
                {type === 'dog' ? '🐕' : type === 'cat' ? '🐈' : type === 'bird' ? '🦅' : type === 'cow' ? '🐄' : type === 'horse' ? '🐎' : '🐾'} {type}
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Level */}
        <div>
          <label className="block text-slate-400 text-[13px] font-medium mb-2">Emergency Level *</label>
          <select className="input-field" value={form.emergencyLevel} onChange={(e) => setForm({ ...form, emergencyLevel: e.target.value })}>
            {emergencyOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-slate-400 text-[13px] font-medium mb-2">Description *</label>
          <textarea
            required className="input-field" rows={4}
            placeholder="Describe the animal's condition, what you see, any distinctive features..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-slate-400 text-[13px] font-medium mb-2">Location *</label>
          <div className="flex gap-2.5">
            <input className="input-field flex-1" placeholder="Location address (optional)" value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <button type="button" onClick={getLocation} className="btn-secondary shrink-0 px-4 py-2.5" disabled={gettingLoc}>
              {gettingLoc ? <Loader size={16} className="spinner" /> : <MapPin size={16} />}
              {location.lat ? '✓ Captured' : 'Get GPS'}
            </button>
          </div>
          {location.lat && <p className="text-xs text-green-500 mt-1.5">📍 Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</p>}
        </div>

        {/* Image */}
        <div>
          <label className="block text-slate-400 text-[13px] font-medium mb-2">Animal Photo (optional)</label>
          <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center relative cursor-pointer"
            onClick={() => document.getElementById('rescue-image').click()}>
            {preview
              ? <img src={preview} alt="preview" className="max-h-[200px] rounded-lg object-cover mx-auto" />
              : <>
                  <Upload size={32} className="text-slate-600 mx-auto mb-2 block" />
                  <p className="text-slate-600 text-sm">Click to upload photo</p>
                </>
            }
            <input id="rescue-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full justify-center p-[14px] text-[15px]" disabled={loading}>
          {loading ? <Loader size={18} className="spinner" /> : '🚨 Submit Rescue Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportRescue;
