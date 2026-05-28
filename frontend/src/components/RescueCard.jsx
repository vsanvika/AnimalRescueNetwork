import { Link } from 'react-router-dom';
import { MapPin, AlertCircle, Clock } from 'lucide-react';

const emergencyColors = { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e' };
const statusLabels = { pending: 'Pending', accepted: 'Accepted', in_progress: 'In Progress', rescued: 'Rescued', closed: 'Closed' };
const animalEmoji = { dog: '🐕', cat: '🐈', bird: '🦅', cow: '🐄', horse: '🐎', other: '🐾' };

const RescueCard = ({ report }) => {
  const badgeClass = {
    pending: 'badge-pending', accepted: 'badge-accepted',
    in_progress: 'badge-progress', rescued: 'badge-rescued', closed: 'badge-closed',
  }[report.status] || 'badge-pending';

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const hrs = Math.floor(diff / 3600000);
    if (hrs < 1) return `${Math.floor(diff / 60000)}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="glass-card p-5 flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2.5">
          <div className="w-[44px] h-[44px] rounded-xl bg-orange-500/10 flex items-center justify-center text-[22px]">
            {animalEmoji[report.animalType] || '🐾'}
          </div>
          <div>
            <h3 className="font-bold text-slate-100 capitalize text-base">{report.animalType}</h3>
            <p className="text-xs text-slate-500">by {report.reportedBy?.name}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`badge ${badgeClass}`}>{statusLabels[report.status]}</span>
          <span className={`badge`} style={{ background: `${emergencyColors[report.emergencyLevel]}20`, color: emergencyColors[report.emergencyLevel] }}>
            {report.emergencyLevel?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Image */}
      {report.image && (
        <img src={report.image} alt="rescue" className="w-full h-[160px] object-cover rounded-[10px]" />
      )}

      {/* Description */}
      <p className="text-[13px] text-slate-400 leading-[1.6]">
        {report.description?.slice(0, 120)}{report.description?.length > 120 ? '...' : ''}
      </p>

      {/* Footer */}
      <div className="flex justify-between items-center border-t border-white/5 pt-3">
        <div className="flex items-center gap-1 text-slate-500 text-xs">
          <MapPin size={12} />
          <span>{report.location?.address || 'Location not set'}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-500 text-xs">
          <Clock size={12} />
          <span>{timeAgo(report.createdAt)}</span>
        </div>
      </div>

      <Link to={`/rescue/${report._id}`} className="btn-primary text-center no-underline text-[13px] py-[9px] px-4">
        View Details
      </Link>
    </div>
  );
};

export default RescueCard;
