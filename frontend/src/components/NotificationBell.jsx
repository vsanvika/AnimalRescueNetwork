import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../store/notificationStore';
import API from '../api/axios';

const NotificationBell = () => {
  const { notifications, unreadCount, markRead, markAllRead, setNotifications } = useNotificationStore();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/notifications')
      .then((res) => setNotifications(res.data.notifications))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleMarkAllRead = async () => {
    await API.put('/notifications/read-all');
    markAllRead();
  };

  const handleNotificationClick = async (n) => {
    if (!n.read) {
      await API.put(`/notifications/${n._id}/read`);
      markRead(n._id);
    }
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="bg-white/5 border border-white/10 rounded-[10px] px-2.5 py-[7px] cursor-pointer text-slate-400 relative flex items-center hover:bg-white/10 transition-colors">
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full w-[18px] h-[18px] text-[11px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-[340px] bg-slate-900 border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-[200] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
            <span className="font-bold text-slate-100">Notifications</span>
            {unreadCount > 0 && <button onClick={handleMarkAllRead} className="bg-transparent border-none text-orange-500 cursor-pointer text-xs font-semibold hover:text-orange-400">Mark all read</button>}
          </div>
          <div className="max-h-[360px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No notifications yet</div>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <div key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`px-5 py-3.5 border-b border-white/5 cursor-pointer transition-colors flex gap-3 items-start ${n.read ? 'bg-transparent hover:bg-white/5' : 'bg-orange-500/5 hover:bg-orange-500/10'}`}>
                  <span className="text-xl">
                    {n.type === 'rescue_update' ? '🚨' : n.type === 'adoption_update' ? '🐾' : n.type === 'new_message' ? '💬' : n.type === 'donation_success' ? '💝' : '🔔'}
                  </span>
                  <div className="flex-1">
                    <p className="text-[13px] text-slate-100 leading-[1.4]">{n.message}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-1" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
