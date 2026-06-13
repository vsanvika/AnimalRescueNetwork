import { useState } from 'react';
import { Loader } from 'lucide-react';
import { toDataURL } from 'qrcode';
import API from '../api/axios';

const buildQrLink = (token) => new URL(`/qr/${token}`, window.location.origin).toString();

const initialNewAnimal = {
  name: '',
  type: 'dog',
  breed: '',
  age: 0,
  gender: 'unknown',
  vaccinated: false,
  description: '',
  location: '',
  ownerName: '',
  ownerEmail: '',
  ownerPhone: '',
  vaccinationDetails: '',
  medicalHistory: '',
  lost: false,
};

const GenerateQR = () => {
  const [generating, setGenerating] = useState(false);
  const [newAnimal, setNewAnimal] = useState(initialNewAnimal);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [qrImage, setQrImage] = useState('');
  const [qrToken, setQrToken] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImagePreview('');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setNewAnimal(initialNewAnimal);
    setImageFile(null);
    setImagePreview('');
    setError('');
  };

  const handleCreateNewAnimalQr = async (e) => {
    e.preventDefault();
    setError('');
    setGenerating(true);

    if (!newAnimal.name || !newAnimal.type) {
      setError('Name and type are required.');
      setGenerating(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newAnimal.name);
      formData.append('type', newAnimal.type);
      formData.append('breed', newAnimal.breed);
      formData.append('age', String(newAnimal.age));
      formData.append('gender', newAnimal.gender);
      formData.append('vaccinated', String(newAnimal.vaccinated));
      formData.append('description', newAnimal.description);
      formData.append('location', newAnimal.location);
      formData.append('vaccinationDetails', newAnimal.vaccinationDetails);
      formData.append('medicalHistory', newAnimal.medicalHistory);
      formData.append('lost', String(newAnimal.lost));
      formData.append('ownerContact[name]', newAnimal.ownerName);
      formData.append('ownerContact[email]', newAnimal.ownerEmail);
      formData.append('ownerContact[phone]', newAnimal.ownerPhone);
      if (imageFile) formData.append('image', imageFile);

      const { data } = await API.post('/api/adoption/generate-qr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const qrLink = buildQrLink(data.qrToken);
      const qrDataUrl = await toDataURL(qrLink);
      setQrImage(qrDataUrl);
      setQrToken(data.qrToken);
      resetForm();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to generate QR.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-8">
      <h1 className="font-bold text-2xl text-slate-100 mb-4">Generate QR for a new animal</h1>
      <div className="glass-card p-6 mb-6">
        <form onSubmit={handleCreateNewAnimalQr}>
          <h2 className="font-semibold text-xl text-slate-100 mb-4">Fill animal and owner details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-slate-400">Name *</label>
            <input required className="input-field" value={newAnimal.name} onChange={(e) => setNewAnimal((prev) => ({ ...prev, name: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm text-slate-400">Image</label>
            <input type="file" accept="image/*" className="input-field" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="preview" className="mt-2 w-32 h-32 object-cover rounded-md" />}
          </div>
          <div>
            <label className="text-sm text-slate-400">Type *</label>
            <select required className="input-field" value={newAnimal.type} onChange={(e) => setNewAnimal((prev) => ({ ...prev, type: e.target.value }))}>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="rabbit">Rabbit</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400">Breed</label>
            <input className="input-field" value={newAnimal.breed} onChange={(e) => setNewAnimal((prev) => ({ ...prev, breed: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm text-slate-400">Age (months)</label>
            <input type="number" min="0" className="input-field" value={newAnimal.age} onChange={(e) => setNewAnimal((prev) => ({ ...prev, age: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="text-sm text-slate-400">Gender</label>
            <select className="input-field" value={newAnimal.gender} onChange={(e) => setNewAnimal((prev) => ({ ...prev, gender: e.target.value }))}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <input type="checkbox" id="newVaccinated" checked={newAnimal.vaccinated} onChange={(e) => setNewAnimal((prev) => ({ ...prev, vaccinated: e.target.checked }))} className="w-4 h-4 accent-orange-500" />
            <label htmlFor="newVaccinated" className="text-sm text-slate-400">Vaccinated</label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-slate-400">Location</label>
            <input className="input-field" value={newAnimal.location} onChange={(e) => setNewAnimal((prev) => ({ ...prev, location: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm text-slate-400">Description</label>
            <input className="input-field" value={newAnimal.description} onChange={(e) => setNewAnimal((prev) => ({ ...prev, description: e.target.value }))} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-slate-400">Owner Name</label>
            <input className="input-field" value={newAnimal.ownerName} onChange={(e) => setNewAnimal((prev) => ({ ...prev, ownerName: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm text-slate-400">Owner Email</label>
            <input className="input-field" value={newAnimal.ownerEmail} onChange={(e) => setNewAnimal((prev) => ({ ...prev, ownerEmail: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm text-slate-400">Owner Phone</label>
            <input className="input-field" value={newAnimal.ownerPhone} onChange={(e) => setNewAnimal((prev) => ({ ...prev, ownerPhone: e.target.value }))} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="text-sm text-slate-400">Vaccination Details</label>
            <textarea className="input-field" rows={2} value={newAnimal.vaccinationDetails} onChange={(e) => setNewAnimal((prev) => ({ ...prev, vaccinationDetails: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm text-slate-400">Medical History</label>
            <textarea className="input-field" rows={2} value={newAnimal.medicalHistory} onChange={(e) => setNewAnimal((prev) => ({ ...prev, medicalHistory: e.target.value }))} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="newLost" checked={newAnimal.lost} onChange={(e) => setNewAnimal((prev) => ({ ...prev, lost: e.target.checked }))} className="w-4 h-4 accent-orange-500" />
            <label htmlFor="newLost" className="text-sm text-slate-400">Mark as Lost</label>
          </div>
        </div>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary" disabled={generating}>{generating ? 'Generating...' : 'Generate QR'}</button>
        </div>
      </form>
        {qrImage && (
          <div className="mt-6">
            <div className="flex flex-col gap-3">
              <img src={qrImage} alt="Generated QR" className="w-40 h-40 bg-white rounded-md" />
              <button className="btn-secondary text-sm" onClick={() => navigator.clipboard.writeText(buildQrLink(qrToken))}>Copy QR Link</button>
              <a className="btn-secondary text-sm" href={qrImage} download={`qr-${qrToken}.png`}>Download</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateQR;
