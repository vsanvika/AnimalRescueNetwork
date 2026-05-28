import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const LostFound = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lost');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'lost', animalType: '', description: '', contactName: '', contactPhone: '', address: '', color: '' });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchReports(); }, [activeTab]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/lostfound?type=${activeTab}`);
      setReports(data);
    } catch (e) {}
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries({ ...form, type: activeTab, lat: 0, lng: 0 }).forEach(([k, v]) => fd.append(k, v));
      images.forEach(img => fd.append('images', img));
      await API.post('/lostfound', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Report submitted!');
      setShowForm(false);
      setForm({ type: 'lost', animalType: '', description: '', contactName: '', contactPhone: '', address: '', color: '' });
      fetchReports();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    setSubmitting(false);
  };

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      <div className="page-header">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="font-['Poppins'] text-[32px] font-extrabold text-slate-100 mb-2">Lost & Found</h1>
            <p className="text-slate-400">Report missing pets or found animals</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary"><Plus size={16} /> Report {activeTab === 'lost' ? 'Lost' : 'Found'} Pet</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1 w-fit">
        {['lost', 'found'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-[10px] border-none cursor-pointer font-semibold text-sm capitalize transition-all duration-200 ${activeTab === tab ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white' : 'bg-transparent text-slate-500'}`}>
            {tab === 'lost' ? '🔍' : '📍'} {tab} Pets
          </button>
        ))}
      </div>

      {/* Report Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-7 mb-7 flex flex-col gap-4">
          <h3 className="font-bold text-slate-100 text-lg">Report a {activeTab} animal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-400 text-[13px] mb-1.5">Animal Type *</label>
              <input required className="input-field" placeholder="e.g. Dog, Cat, Parrot..." value={form.animalType} onChange={e => setForm({ ...form, animalType: e.target.value })} />
            </div>
            <div>
              <label className="block text-slate-400 text-[13px] mb-1.5">Color/Markings</label>
              <input className="input-field" placeholder="e.g. Brown with white spots" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} />
            </div>
            <div>
              <label className="block text-slate-400 text-[13px] mb-1.5">Your Name *</label>
              <input required className="input-field" value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} />
            </div>
            <div>
              <label className="block text-slate-400 text-[13px] mb-1.5">Phone *</label>
              <input required type="tel" className="input-field" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-[13px] mb-1.5">Last Seen Location</label>
            <input className="input-field" placeholder="Area, street, landmark..." value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
          <div>
            <label className="block text-slate-400 text-[13px] mb-1.5">Description *</label>
            <textarea required className="input-field" rows={3} placeholder="Describe the animal, any distinctive features, circumstances..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-slate-400 text-[13px] mb-1.5">Photos</label>
            <input type="file" accept="image/*" multiple className="input-field p-2" onChange={e => setImages(Array.from(e.target.files))} />
          </div>
          <div className="flex gap-2.5">
            <button type="submit" className="btn-primary px-6 py-2.5" disabled={submitting}>Submit Report</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary px-6 py-2.5">Cancel</button>
          </div>
        </form>
      )}

      {/* Reports Grid */}
      {loading ? (
        <div className="text-center py-15 text-slate-500">Loading...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <div className="text-[64px] mb-4">{activeTab === 'lost' ? '🔍' : '📍'}</div>
          <h3 className="text-xl font-bold text-slate-400">No {activeTab} pet reports</h3>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
          {reports.map(r => (
            <div key={r._id} className="glass-card p-5">
              {r.images?.[0] && <img src={r.images[0]} alt="" className="w-full h-[180px] object-cover rounded-[10px] mb-3.5" />}
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-100 text-base">{r.animalType}</h3>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${r.status === 'open' ? 'bg-green-500/10 text-green-500' : 'bg-slate-400/10 text-slate-400'}`}>
                  {r.status}
                </span>
              </div>
              {r.color && <p className="text-xs text-slate-500 mb-1.5">🎨 {r.color}</p>}
              <p className="text-[13px] text-slate-400 mb-2.5 leading-[1.5]">{r.description?.slice(0, 100)}...</p>
              {r.lastSeenLocation?.address && <p className="text-xs text-slate-500 mb-2.5">📍 {r.lastSeenLocation.address}</p>}
              <div className="border-t border-white/5 pt-3">
                <p className="font-semibold text-slate-100 text-sm">{r.contactName}</p>
                <a href={`tel:${r.contactPhone}`} className="text-orange-500 text-sm no-underline font-semibold">{r.contactPhone}</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LostFound;
