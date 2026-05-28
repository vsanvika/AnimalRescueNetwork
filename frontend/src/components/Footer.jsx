import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-[#0a0f1e]/95 border-t border-white/10 px-6 pt-10 pb-6 mt-auto">
    <div className="max-w-[1200px] mx-auto">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-2xl">🐾</span>
            <span className="font-['Poppins',sans-serif] font-bold text-lg text-slate-100">
              Animal<span className="text-orange-500">Rescue</span>
            </span>
          </div>
          <p className="text-slate-500 text-[13px] leading-[1.7]">
            Connecting compassionate people with animals in need. Every rescue matters.
          </p>
        </div>
        <div>
          <h4 className="text-slate-100 font-semibold mb-3 text-sm">Quick Links</h4>
          {[['Report Animal', '/rescue'], ['Adopt a Pet', '/adoption'], ['Lost & Found', '/lost-found'], ['Volunteer', '/volunteers']].map(([label, to]) => (
            <Link key={to} to={to} className="block text-slate-500 no-underline text-[13px] mb-2 transition-colors duration-200 hover:text-orange-500">
              {label}
            </Link>
          ))}
        </div>
        <div>
          <h4 className="text-slate-100 font-semibold mb-3 text-sm">Emergency</h4>
          <p className="text-orange-500 font-semibold text-xl mb-1">1800-RESCUE</p>
          <p className="text-slate-500 text-[13px]">24/7 Animal Emergency Hotline</p>
        </div>
      </div>
      <div className="border-t border-white/5 pt-5 text-center text-slate-600 text-xs">
        © 2026 AnimalRescue Network. Built with ❤️ for animals everywhere.
      </div>
    </div>
  </footer>
);

export default Footer;
