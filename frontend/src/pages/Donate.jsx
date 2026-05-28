import { useEffect, useState } from 'react';
import { Heart, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const presets = [100, 250, 500, 1000, 2500, 5000];

const Donate = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myDonations, setMyDonations] = useState([]);
  const [totalRaised, setTotalRaised] = useState(0);

  useEffect(() => {
    API.get('/donations/me').then(({ data }) => setMyDonations(data)).catch(() => {});
  }, []);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) return toast.error('Enter a valid amount');
    setLoading(true);
    try {
      await API.post('/donations', { amount: Number(amount), message, anonymous });
      toast.success(`Thank you for donating Rs.${amount}! 🐾`);
      setAmount('');
      setMessage('');
      const { data } = await API.get('/donations/me');
      setMyDonations(data);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Donation failed');
    }
    setLoading(false);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const total = myDonations.reduce((s, d) => s + (d.status === 'completed' ? d.amount : 0), 0);

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <div className="page-header">
        <h1 className="font-['Poppins'] text-[32px] font-extrabold text-slate-100 mb-2">💝 Support Animal Rescue</h1>
        <p className="text-slate-400">Your donation directly funds rescue operations, medical care, and shelter</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-7">
        {/* Donation Form */}
        <div className="glass-card p-8">
          <h2 className="font-bold text-slate-100 text-xl mb-6">Make a Donation</h2>

          {/* Preset amounts */}
          <p className="text-slate-400 text-[13px] font-medium mb-3">Quick Select</p>
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {presets.map(p => (
              <button key={p} type="button" onClick={() => setAmount(String(p))}
                className={`p-3 rounded-[10px] cursor-pointer font-bold text-[15px] transition-all duration-200 border ${String(amount) === String(p) ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-white/10 bg-white/5 text-slate-400'}`}>
                ₹{p.toLocaleString()}
              </button>
            ))}
          </div>

          <form onSubmit={handleDonate} className="flex flex-col gap-4">
            <div>
              <label className="block text-slate-400 text-[13px] font-medium mb-1.5">Custom Amount (₹)</label>
              <input type="number" min="1" className="input-field" placeholder="Enter amount" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div>
              <label className="block text-slate-400 text-[13px] font-medium mb-1.5">Message (optional)</label>
              <textarea className="input-field resize-none" rows={3} placeholder="A message for the rescue team..." value={message} onChange={e => setMessage(e.target.value)} />
            </div>
            <div className="flex items-center gap-2.5">
              <input type="checkbox" id="anon" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} className="w-[18px] h-[18px] accent-orange-500" />
              <label htmlFor="anon" className="text-slate-400 cursor-pointer text-sm">Donate anonymously</label>
            </div>
            <button type="submit" className="btn-primary p-3.5 justify-center text-base" disabled={loading}>
              {loading ? <Loader size={18} className="spinner" /> : <><Heart size={18} /> Donate {amount ? `₹${Number(amount).toLocaleString()}` : 'Now'}</>}
            </button>
          </form>
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-5">
          {/* Impact */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-slate-100 mb-4 text-base">Your Impact</h3>
            <div className="text-center py-5 border-b border-white/5 mb-4">
              <p className="text-[36px] font-['Poppins'] font-extrabold text-orange-500">₹{total.toLocaleString()}</p>
              <p className="text-[13px] text-slate-500">Total Donated by You</p>
            </div>
            {[['₹100', 'Feeds 5 rescued animals for a day'], ['₹500', 'Covers basic medical examination'], ['₹2500', 'Funds a complete rescue operation']].map(([amt, desc]) => (
              <div key={amt} className="flex gap-3 mb-3 items-start">
                <span className="bg-orange-500/10 text-orange-500 px-2 py-1 rounded-md text-[13px] font-bold shrink-0">{amt}</span>
                <p className="text-[13px] text-slate-500 leading-[1.4]">{desc}</p>
              </div>
            ))}
          </div>

          {/* Donation History */}
          {myDonations.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="font-bold text-slate-100 mb-3.5 text-base">My Donations</h3>
              <div className="flex flex-col gap-2.5 max-h-[250px] overflow-y-auto">
                {myDonations.map(d => (
                  <div key={d._id} className="flex justify-between items-center px-3 py-2.5 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-bold text-orange-500 text-[15px]">₹{d.amount.toLocaleString()}</p>
                      <p className="text-[11px] text-slate-500">{formatDate(d.createdAt)}</p>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-1 rounded-[10px] ${d.status === 'completed' ? 'text-green-500 bg-green-500/10' : 'text-yellow-500 bg-yellow-500/10'}`}>
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donate;
