import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const AddAnimal = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', type: 'dog', breed: '', age: '', gender: 'unknown', vaccinated: false, description: '', location: '' });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach(img => fd.append('images', img));
      await API.post('/adoption', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Animal listing created!');
      navigate('/adoption');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    setLoading(false);
  };

  return (
    <div className="max-w-[720px] mx-auto px-6 py-8">
      <div className="page-header">
        <h1 className="font-['Poppins'] text-2xl md:text-[32px] font-extrabold text-slate-100 mb-2">Add Animal for Adoption</h1>
        <p className="text-slate-400">List a rescued animal to find them a loving home</p>
      </div>
      <form onSubmit={handleSubmit} className="glass-card p-8 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-[13px] font-medium mb-1.5">Name *</label>
            <input required className="input-field" placeholder="Animal's name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-slate-400 text-[13px] font-medium mb-1.5">Type *</label>
            <select required className="input-field capitalize" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              {['dog', 'cat', 'bird', 'rabbit', 'other'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-[13px] font-medium mb-1.5">Breed</label>
            <input className="input-field" placeholder="e.g. Labrador" value={form.breed} onChange={e => setForm({ ...form, breed: e.target.value })} />
          </div>
          <div>
            <label className="block text-slate-400 text-[13px] font-medium mb-1.5">Age (months) *</label>
            <input required type="number" min="0" className="input-field" placeholder="e.g. 6" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
          </div>
          <div>
            <label className="block text-slate-400 text-[13px] font-medium mb-1.5">Gender</label>
            <select className="input-field" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
              <option value="unknown">Unknown</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-[13px] font-medium mb-1.5">Location</label>
            <input className="input-field" placeholder="City / Shelter name" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="vaccinated" checked={form.vaccinated} onChange={e => setForm({ ...form, vaccinated: e.target.checked })} className="w-[18px] h-[18px] accent-orange-500" />
          <label htmlFor="vaccinated" className="text-slate-400 font-medium cursor-pointer">Animal is vaccinated</label>
        </div>
        <div>
          <label className="block text-slate-400 text-[13px] font-medium mb-1.5">Description</label>
          <textarea className="input-field" rows={4} placeholder="Describe the animal's personality, health, and needs..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div>
          <label className="block text-slate-400 text-[13px] font-medium mb-2">Photos (up to 5)</label>
          <div className="border-2 border-dashed border-white/10 rounded-xl p-5 text-center cursor-pointer" onClick={() => document.getElementById('animal-imgs').click()}>
            {previews.length > 0 ? (
              <div className="flex gap-2.5 flex-wrap justify-center">
                {previews.map((p, i) => <img key={i} src={p} className="w-20 h-20 object-cover rounded-lg" alt="" />)}
              </div>
            ) : (
              <>
                <Upload size={28} className="text-slate-600 mx-auto mb-2 block" />
                <p className="text-slate-600 text-sm">Click to upload photos</p>
              </>
            )}
            <input id="animal-imgs" type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
          </div>
        </div>
        <button type="submit" className="btn-primary w-full justify-center p-3.5 text-[15px]" disabled={loading}>
          {loading ? <Loader size={18} className="spinner" /> : 'Add Animal Listing'}
        </button>
      </form>
    </div>
  );
};

export default AddAnimal;
