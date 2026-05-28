import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
    <div className="text-[80px] mb-5">🐾</div>
    <h1 className="font-['Poppins'] text-[80px] font-extrabold text-orange-500 leading-none">404</h1>
    <h2 className="font-['Poppins'] text-[28px] font-bold text-slate-100 mb-3">Page Not Found</h2>
    <p className="text-slate-500 text-base mb-8 max-w-[400px]">Looks like this page wandered off. Let's get you back on track.</p>
    <Link to="/" className="btn-primary px-8 py-3 text-base">Back to Home</Link>
  </div>
);

export default NotFound;
