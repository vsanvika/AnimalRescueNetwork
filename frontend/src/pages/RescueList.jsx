import { useEffect, useState } from 'react';
import { Filter, Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import RescueCard from '../components/RescueCard';
import useAuthStore from '../store/authStore';

const RescueList = () => {
  const { user } = useAuthStore();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', emergencyLevel: '', animalType: '' });

  useEffect(() => { fetchReports(); }, [filters]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v)));
      const { data } = await API.get(`/rescue?${params}`);
      setReports(data);
    } catch (e) {}
    setLoading(false);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="page-header">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="font-['Poppins'] text-[32px] font-extrabold text-slate-100 mb-2">🚨 Rescue Reports</h1>
            <p className="text-slate-400">{reports.length} report{reports.length !== 1 ? 's' : ''} found</p>
          </div>
          <Link to="/rescue/new" className="btn-primary"><Plus size={16} /> Report Animal</Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-7 flex-wrap">
        {[
          { key: 'status', options: ['', 'pending', 'accepted', 'in_progress', 'rescued', 'closed'], labels: ['All Status', 'Pending', 'Accepted', 'In Progress', 'Rescued', 'Closed'] },
          { key: 'emergencyLevel', options: ['', 'critical', 'high', 'medium', 'low'], labels: ['All Levels', 'Critical', 'High', 'Medium', 'Low'] },
          { key: 'animalType', options: ['', 'dog', 'cat', 'bird', 'cow', 'horse', 'other'], labels: ['All Animals', 'Dog', 'Cat', 'Bird', 'Cow', 'Horse', 'Other'] },
        ].map(({ key, options, labels }) => (
          <select key={key} className="input-field w-auto min-w-[140px]"
            value={filters[key]} onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}>
            {options.map((o, i) => <option key={o} value={o}>{labels[i]}</option>)}
          </select>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-15 text-slate-500">
          <div className="text-[48px] mb-4">🔄</div>
          <p>Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <div className="text-[64px] mb-4">🐾</div>
          <h3 className="text-xl font-bold text-slate-400 mb-2">No reports found</h3>
          <p className="mb-6">Be the first to report an animal in need</p>
          <Link to="/rescue/new" className="btn-primary">Report Now</Link>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
          {reports.map((r) => <RescueCard key={r._id} report={r} />)}
        </div>
      )}
    </div>
  );
};

export default RescueList;
