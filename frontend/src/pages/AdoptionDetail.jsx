import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import useAuthStore from '../store/authStore';

const AdoptionDetail = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [applying, setApplying] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    API.get(`/adoption/${id}`).then(({ data }) => setAnimal(data)).finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await API.post(`/adoption/${id}/apply`, { message });
      toast.success('Adoption application submitted!');
      setMessage('');
      API.get(`/adoption/${id}`).then(({ data }) => setAnimal(data));
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    setApplying(false);
  };

  const handleRequest = async (requestId, status) => {
    try {
      await API.put(`/adoption/${id}/request/${requestId}`, { status });
      toast.success(`Request ${status}`);
      API.get(`/adoption/${id}`).then(({ data }) => setAnimal(data));
    } catch (e) { toast.error('Failed'); }
  };

  if (loading) return <div className="text-center p-[100px] text-slate-500"><Loader size={32} className="spinner mx-auto" /></div>;
  if (!animal) return <div className="text-center p-[100px] text-slate-500">Animal not found</div>;

  const typeEmoji = { dog: '🐕', cat: '🐈', bird: '🦜', rabbit: '🐇', other: '🐾' };
  const alreadyApplied = animal.adoptionRequests?.some(r => r.user?._id === user?._id || r.user === user?._id);
  const isOwner = animal.addedBy?._id === user?._id;

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-transparent border-none text-slate-400 cursor-pointer mb-6 text-sm hover:text-slate-300 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-7">
        {/* Left */}
        <div>
          <div className="glass-card overflow-hidden mb-5">
            <div className="h-[340px] bg-white/5 flex items-center justify-center">
              {animal.images?.length > 0
                ? <img src={animal.images[activeImg]} alt={animal.name} className="w-full h-full object-cover" />
                : <span className="text-[80px]">{typeEmoji[animal.type]}</span>
              }
            </div>
            {animal.images?.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {animal.images.map((img, i) => (
                  <img key={i} src={img} onClick={() => setActiveImg(i)} className={`w-[60px] h-[60px] object-cover rounded-lg cursor-pointer ${activeImg === i ? 'border-2 border-orange-500' : 'border-2 border-transparent'}`} alt="" />
                ))}
              </div>
            )}
          </div>
          <div className="glass-card p-6">
            <h2 className="font-bold text-slate-100 text-lg mb-3">About {animal.name}</h2>
            <p className="text-slate-400 leading-[1.8]">{animal.description || 'No description provided.'}</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          <div className="glass-card p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="font-['Poppins'] font-extrabold text-[28px] text-slate-100">{animal.name}</h1>
              <span className="text-[32px]">{typeEmoji[animal.type]}</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {[
                ['Type', animal.type], ['Breed', animal.breed],
                ['Age', animal.age < 12 ? `${animal.age} months` : `${Math.floor(animal.age/12)} years`],
                ['Gender', animal.gender], ['Vaccinated', animal.vaccinated ? '✓ Yes' : '✗ No'],
                ['Status', animal.status],
              ].map(([k, v]) => (
                <div key={k} className="bg-white/5 rounded-lg px-3 py-2.5">
                  <p className="text-[11px] text-slate-500 mb-0.5">{k}</p>
                  <p className="text-sm font-semibold text-slate-100 capitalize">{v}</p>
                </div>
              ))}
            </div>
            <p className="text-[13px] text-slate-500">Added by <span className="text-orange-500">{animal.addedBy?.name}</span></p>
          </div>

          {/* Apply */}
          {user && !isOwner && animal.status !== 'adopted' && (
            <div className="glass-card p-6">
              <h3 className="font-bold text-slate-100 mb-3.5">Apply for Adoption</h3>
              {alreadyApplied ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-[10px] p-3.5 text-center text-green-500 font-semibold">
                  ✓ Application submitted — awaiting review
                </div>
              ) : (
                <>
                  <textarea className="input-field mb-3 resize-none" rows={3} placeholder="Tell us why you'd be a great owner..." value={message} onChange={e => setMessage(e.target.value)} />
                  <button onClick={handleApply} className="btn-primary w-full justify-center" disabled={applying}>
                    {applying ? <Loader size={16} className="spinner" /> : <><Heart size={16} /> Apply Now</>}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Requests (owner view) */}
          {isOwner && animal.adoptionRequests?.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="font-bold text-slate-100 mb-3.5">Applications ({animal.adoptionRequests.length})</h3>
              {animal.adoptionRequests.map(req => (
                <div key={req._id} className="border-b border-white/5 pb-3.5 mb-3.5">
                  <p className="font-semibold text-slate-100 mb-1">{req.user?.name}</p>
                  <p className="text-[13px] text-slate-500 mb-2.5">{req.message}</p>
                  {req.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleRequest(req._id, 'approved')} className="btn-success text-xs px-3 py-1.5">Approve</button>
                      <button onClick={() => handleRequest(req._id, 'rejected')} className="btn-danger text-xs px-3 py-1.5">Reject</button>
                    </div>
                  ) : (
                    <span className={`text-xs font-semibold ${req.status === 'approved' ? 'text-green-500' : 'text-red-500'}`}>{req.status}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdoptionDetail;
