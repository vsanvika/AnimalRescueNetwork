import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from 'lucide-react';
import API from '../api/axios';

const QRView = () => {
  const { token } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/qr/scan/${token}`).then(({ data }) => setPet(data)).catch(() => setPet(null)).finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="text-center p-[100px] text-slate-500"><Loader size={32} className="spinner mx-auto" /></div>;
  if (!pet) return <div className="text-center p-[100px] text-slate-500">Pet not found</div>;

  return (
    <div className="max-w-[720px] mx-auto px-6 py-8">
      <div className="glass-card p-6">
        <h2 className="font-bold text-lg mb-2">{pet.name}</h2>
        <p className="text-sm text-slate-400 mb-3">{pet.type} — {pet.breed}</p>
        {pet.images?.length > 0 && <img src={pet.images[0]} className="w-64 h-64 object-cover rounded-lg mb-4" alt={pet.name} />}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <h3 className="font-semibold">Age</h3>
            <p className="text-slate-400">{pet.age} months</p>
          </div>
          <div>
            <h3 className="font-semibold">Gender</h3>
            <p className="text-slate-400">{pet.gender}</p>
          </div>
          <div>
            <h3 className="font-semibold">Status</h3>
            <p className="text-slate-400">{pet.status || 'Unknown'}</p>
          </div>
          <div>
            <h3 className="font-semibold">Lost</h3>
            <p className="text-slate-400">{pet.lost ? 'Yes' : 'No'}</p>
          </div>
        </div>
        <h3 className="font-semibold">Owner Contact</h3>
        <p className="text-slate-400 mb-2">{pet.owner?.name || 'No owner name'}</p>
        <p className="text-slate-400 mb-2">{pet.owner?.email || 'No email'}</p>
        <p className="text-slate-400 mb-4">{pet.owner?.phone || 'No phone'}</p>

        <h3 className="font-semibold">Vaccination Details</h3>
        <p className="text-slate-400 mb-4">{pet.vaccinationDetails || 'No records'}</p>

        <h3 className="font-semibold">Medical History</h3>
        <p className="text-slate-400 mb-4">{pet.medicalHistory || 'No records'}</p>

        <h3 className="font-semibold">Description</h3>
        <p className="text-slate-400 mb-4">{pet.description || 'No description provided.'}</p>

        <h3 className="font-semibold">Location</h3>
        <p className="text-slate-400">{pet.location || 'Unknown'}</p>
      </div>
    </div>
  );
};

export default QRView;
