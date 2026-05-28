import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Search, Users, Shield } from 'lucide-react';

const stats = [
  { value: '2,400+', label: 'Animals Rescued' },
  { value: '850+', label: 'Successful Adoptions' },
  { value: '320+', label: 'Active Volunteers' },
  { value: '50+', label: 'Partner NGOs' },
];

const features = [
  { icon: '🚨', title: 'Emergency Rescue', desc: 'Report injured or abandoned animals instantly. Our teams respond within 30 minutes.', link: '/rescue', color: '#ef4444' },
  { icon: '🐾', title: 'Adopt a Pet', desc: 'Give a rescued animal a loving forever home. Browse hundreds of animals.', link: '/adoption', color: '#f97316' },
  { icon: '🔍', title: 'Lost & Found', desc: 'Report lost pets or found animals. Our matching system connects owners.', link: '/lost-found', color: '#0ea5e9' },
  { icon: '🤝', title: 'Volunteer', desc: 'Join our network of rescue volunteers and make a difference in your community.', link: '/volunteers', color: '#a855f7' },
  { icon: '💬', title: 'Real-Time Chat', desc: 'Communicate directly with rescue teams and get live updates on rescues.', link: '/chat', color: '#22c55e' },
  { icon: '💝', title: 'Donate', desc: 'Support rescue operations and help us save more lives every day.', link: '/donate', color: '#ec4899' },
];

const Home = () => (
  <div>
    {/* Hero */}
    <section className="min-h-[90vh] flex items-center relative overflow-hidden px-6 py-20">
      {/* Background blobs */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.15), transparent 70%)' }} />
      <div className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)' }} />

      <div className="max-w-[1200px] mx-auto text-center relative z-10 fade-in">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4.5 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" style={{ animation: 'pulse-glow 2s infinite' }} />
          <span className="text-[13px] text-orange-500 font-semibold">Emergency Rescue Network — Active 24/7</span>
        </div>

        <h1 className="font-['Poppins',sans-serif] text-[clamp(40px,6vw,80px)] font-extrabold leading-[1.1] mb-6 text-slate-100">
          Every Animal Deserves<br />
          <span className="gradient-text">To Be Rescued</span>
        </h1>

        <p className="text-xl text-slate-400 max-w-[600px] mx-auto mb-10 leading-[1.7]">
          Connect with rescue teams, adopt animals in need, and join a community that puts animal welfare first.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/rescue" className="btn-primary px-8 py-3.5 text-base">
            🚨 Report Rescue <ArrowRight size={18} />
          </Link>
          <Link to="/adoption" className="btn-secondary px-8 py-3.5 text-base">
            <Heart size={18} /> Adopt a Pet
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-[800px] mx-auto mt-16">
          {stats.map((s) => (
            <div key={s.label} className="text-center py-5 px-3 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-[32px] font-['Poppins'] font-extrabold text-orange-500">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Features Grid */}
    <section className="px-6 py-20 bg-white/[0.01]">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-['Poppins'] text-[40px] font-extrabold text-slate-100 mb-3">
            Everything You Need
          </h2>
          <p className="text-slate-500 text-lg">A complete platform for animal rescue and welfare</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
          {features.map((f) => (
            <Link key={f.title} to={f.link} className="no-underline">
              <div className="glass-card p-7 h-full cursor-pointer">
                <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-[26px] mb-4" style={{ background: `${f.color}20` }}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-100 text-xl mb-2.5">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-[1.7]">{f.desc}</p>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold mt-4" style={{ color: f.color }}>
                  Learn more <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="px-6 py-20">
      <div className="max-w-[800px] mx-auto text-center bg-gradient-to-br from-orange-500/10 to-purple-500/10 border border-orange-500/20 rounded-[24px] px-10 py-[60px]">
        <h2 className="font-['Poppins'] text-[36px] font-extrabold text-slate-100 mb-4">
          See an injured animal? 🚨
        </h2>
        <p className="text-slate-400 text-lg mb-8">Report it now and our rescue teams will respond immediately</p>
        <Link to="/rescue" className="btn-primary px-10 py-4 text-lg">
          Report Now — It's Free
        </Link>
      </div>
    </section>
  </div>
);

export default Home;
