import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';

const typeEmoji = { dog: '🐕', cat: '🐈', bird: '🦜', rabbit: '🐇', other: '🐾' };

const AnimalCard = ({ animal }) => {
  const statusColor = { available: '#22c55e', pending: '#eab308', adopted: '#94a3b8' }[animal.status];

  return (
    <div className="glass-card overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-[200px]">
        {animal.images?.[0] ? (
          <img src={animal.images[0]} alt={animal.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-purple-500/20 flex items-center justify-center text-[60px]">
            {typeEmoji[animal.type] || '🐾'}
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: `${statusColor}20`, color: statusColor }}>
            {animal.status?.toUpperCase()}
          </span>
        </div>
        {animal.vaccinated && (
          <div className="absolute bottom-3 left-3 bg-green-500/15 text-green-500 px-2.5 py-1 rounded-full text-[11px] font-semibold">
            ✓ Vaccinated
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4.5 flex-1 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-100 text-lg">{animal.name}</h3>
          <span className="text-xl">{typeEmoji[animal.type]}</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          <span className="bg-white/5 px-2 py-0.5 rounded-md text-xs text-slate-400">{animal.breed}</span>
          <span className="bg-white/5 px-2 py-0.5 rounded-md text-xs text-slate-400">
            {animal.age < 12 ? `${animal.age}mo` : `${Math.floor(animal.age / 12)}yr`}
          </span>
          <span className="bg-white/5 px-2 py-0.5 rounded-md text-xs text-slate-400 capitalize">{animal.gender}</span>
        </div>

        <p className="text-[13px] text-slate-500 leading-relaxed flex-1">
          {animal.description?.slice(0, 90)}{animal.description?.length > 90 ? '...' : ''}
        </p>

        {animal.location && (
          <div className="flex items-center gap-1 text-slate-500 text-xs">
            <MapPin size={12} /> {animal.location}
          </div>
        )}

        <Link to={`/adoption/${animal._id}`} className="btn-primary text-center no-underline text-[13px] py-2 px-4 mt-1.5">
          <Heart size={14} /> Adopt Me
        </Link>
      </div>
    </div>
  );
};

export default AnimalCard;
