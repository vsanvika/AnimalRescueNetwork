import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, User, ArrowLeft, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import useAuthStore from '../store/authStore';
import MapView from '../components/MapView';

const statusFlow = ['pending', 'accepted', 'in_progress', 'rescued', 'closed'];
const statusColors = { pending: '#eab308', accepted: '#0ea5e9', in_progress: '#a855f7', rescued: '#22c55e', closed: '#94a3b8' };
const emergencyColors = { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e' };

const RescueDetail = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    API.get(`/rescue/${id}`).then(({ data }) => { setReport(data); setNotes(data.notes || ''); }).finally(() => setLoading(false));
  }, [id]);

  const handleAccept = async () => {
    setUpdating(true);
    try {
      const { data } = await API.put(`/rescue/${id}/accept`);
      setReport(data);
      toast.success('Rescue accepted! The reporter has been notified.');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    setUpdating(false);
  };

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    try {
      const { data } = await API.put(`/rescue/${id}/status`, { status, notes });
      setReport(data);
      toast.success(`Status updated to: ${status.replace('_', ' ')}`);
    } catch (e) { toast.error('Failed to update status'); }
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this report?')) return;
    await API.delete(`/rescue/${id}`);
    toast.success('Report deleted');
    navigate('/rescue');
  };

  if (loading) return <div className="text-center py-[100px] text-slate-500"><Loader size={32} className="spinner mx-auto" /></div>;
  if (!report) return <div className="text-center py-[100px] text-slate-500">Report not found</div>;

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-none border-none text-slate-400 cursor-pointer mb-6 text-sm">
        <ArrowLeft size={16} /> Back to Reports
      </button>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6">
        {/* Main */}
        <div className="flex flex-col gap-5">
          <div className="glass-card p-7">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h1 className="font-['Poppins'] font-extrabold text-[28px] text-slate-100 capitalize mb-2">
                  {report.animalType === 'dog' ? '🐕' : report.animalType === 'cat' ? '🐈' : '🐾'} {report.animalType} Rescue
                </h1>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${statusColors[report.status]}20`, color: statusColors[report.status] }}>
                    {report.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${emergencyColors[report.emergencyLevel]}20`, color: emergencyColors[report.emergencyLevel] }}>
                    {report.emergencyLevel?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {report.image && <img src={report.image} alt="rescue" className="w-full rounded-xl mb-5 max-h-[320px] object-cover" />}

            <p className="text-slate-400 leading-[1.8] text-[15px]">{report.description}</p>

            {report.notes && (
              <div className="bg-orange-500/5 border border-orange-500/20 rounded-[10px] p-4 mt-4">
                <p className="text-[13px] text-orange-500 font-semibold mb-1">Rescue Team Notes:</p>
                <p className="text-slate-400 text-sm">{report.notes}</p>
              </div>
            )}
          </div>

          {/* Map */}
          {report.location?.lat !== 0 && (
            <div className="glass-card p-5">
              <h3 className="font-bold text-slate-100 mb-4 text-base">📍 Rescue Location</h3>
              <MapView lat={report.location.lat} lng={report.location.lng} popupText={report.location.address || 'Rescue Location'} />
              {report.location.address && <p className="text-slate-500 text-[13px] mt-2">{report.location.address}</p>}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Reporter Info */}
          <div className="glass-card p-5">
            <h3 className="font-bold text-slate-100 mb-3.5 text-[15px]">Reporter</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center font-bold text-white">
                {report.reportedBy?.name?.[0]}
              </div>
              <div>
                <p className="font-semibold text-slate-100">{report.reportedBy?.name}</p>
                <p className="text-xs text-slate-500">{report.reportedBy?.email}</p>
              </div>
            </div>
          </div>

          {/* Assigned Team */}
          {report.assignedTo && (
            <div className="glass-card p-5">
              <h3 className="font-bold text-slate-100 mb-3.5 text-[15px]">Assigned Team</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-green-500 flex items-center justify-center font-bold text-white">
                  {report.assignedTo?.name?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-100">{report.assignedTo?.name}</p>
                  <p className="text-xs text-green-500">✓ Rescue Team</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {(user?.role === 'rescue_team' || user?.role === 'admin') && (
            <div className="glass-card p-5">
              <h3 className="font-bold text-slate-100 mb-3.5 text-[15px]">Actions</h3>

              {report.status === 'pending' && !report.assignedTo && (
                <button onClick={handleAccept} className="btn-primary w-full justify-center mb-2.5" disabled={updating}>
                  {updating ? <Loader size={16} className="spinner" /> : '✓ Accept Rescue'}
                </button>
              )}

              {report.assignedTo?._id === user?._id && (
                <>
                  <textarea className="input-field mb-2.5 resize-none" rows={3} placeholder="Add notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                  <div className="flex flex-col gap-2">
                    {['in_progress', 'rescued', 'closed'].map((s) => (
                      <button key={s} onClick={() => handleStatusUpdate(s)} className="btn-secondary justify-center text-[13px] p-2" disabled={report.status === s || updating}>
                        Mark as {s.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {user?.role === 'admin' && (
                <button onClick={handleDelete} className="btn-danger w-full mt-2.5">
                  Delete Report
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RescueDetail;
