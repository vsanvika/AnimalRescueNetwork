import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import API from '../api/axios';
import AnimalCard from '../components/AnimalCard';
import useAuthStore from '../store/authStore';

const AdoptionList = () => {
  const { user } = useAuthStore();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', gender: '', vaccinated: '', status: 'available', search: '' });

  useEffect(() => { fetchAnimals(); }, [filters]);

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v)));
      const { data } = await API.get(`/adoption?${params}`);
      setAnimals(data);
    } catch (e) {}
    setLoading(false);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="page-header">
        <h1 className="font-['Poppins'] text-[32px] font-extrabold text-slate-100 mb-2">Adopt a Pet</h1>
        <p className="text-slate-400">Give a rescued animal a loving forever home</p>
      </div>
      <div className="flex gap-3 mb-7 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="input-field pl-10" placeholder="Search by name..."
            value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        </div>
        {['rescue_team', 'admin'].includes(user?.role) && (
          <Link to="/adoption/add" className="btn-primary px-4 py-2 text-sm whitespace-nowrap">Add Animal</Link>
        )}
        {[
          { key: 'type', options: ['', 'dog', 'cat', 'bird', 'rabbit', 'other'], labels: ['All Types', 'Dogs', 'Cats', 'Birds', 'Rabbits', 'Other'] },
          { key: 'gender', options: ['', 'male', 'female'], labels: ['Any Gender', 'Male', 'Female'] },
          { key: 'vaccinated', options: ['', 'true'], labels: ['Any', 'Vaccinated Only'] },
        ].map(({ key, options, labels }) => (
          <select key={key} className="input-field w-auto min-w-[130px]"
            value={filters[key]} onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}>
            {options.map((o, i) => <option key={o} value={o}>{labels[i]}</option>)}
          </select>
        ))}
      </div>
      {loading ? (
        <div className="text-center p-[60px] text-slate-500"><p>Loading animals...</p></div>
      ) : animals.length === 0 ? (
        <div className="text-center p-[80px] text-slate-500">
          <div className="text-[64px] mb-4">🐾</div>
          <h3 className="text-xl font-bold text-slate-400">No animals found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {animals.map((a) => <AnimalCard key={a._id} animal={a} />)}
        </div>
      )}
    </div>
  );
};

export default AdoptionList;
