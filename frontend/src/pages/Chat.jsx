import { useEffect, useState } from 'react';
import { MessageCircle, Search } from 'lucide-react';
import API from '../api/axios';
import useAuthStore from '../store/authStore';
import useChatStore from '../store/chatStore';
import ChatWindow from '../components/ChatWindow';

const Chat = () => {
  const { user } = useAuthStore();
  const { conversations, setConversations, activeConversation, setActiveConversation } = useChatStore();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('conversations');

  useEffect(() => {
    API.get('/chat/conversations').then(({ data }) => { setConversations(data); setLoading(false); });
    API.get('/auth/users').then(({ data }) => setUsers(data));
  }, []);

  const startChat = async (participantId) => {
    try {
      const { data } = await API.post('/chat/conversation', { participantId });
      if (!conversations.find(c => c._id === data._id)) {
        setConversations([data, ...conversations]);
      }
      setActiveConversation(data);
      setTab('conversations');
    } catch (e) {}
  };

  const getOtherParticipant = (conv) => conv.participants?.find(p => p._id !== user?._id);

  const timeAgo = (date) => {
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  const filteredUsers = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      <div className="page-header mb-6">
        <h1 className="font-['Poppins'] text-[32px] font-extrabold text-slate-100 mb-2">💬 Messages</h1>
        <p className="text-slate-400">Real-time chat with rescue teams and admins</p>
      </div>

      <div className="grid grid-cols-[320px_1fr] gap-5 h-[580px]">
        {/* Sidebar */}
        <div className="glass-card flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex px-3 pt-3 gap-1">
            {['conversations', 'newChat'].map(t => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 p-2 rounded-lg border-none cursor-pointer text-[13px] font-semibold transition-all duration-200 ${tab === t ? 'bg-orange-500/15 text-orange-500' : 'bg-transparent text-slate-500'}`}>
                {t === 'conversations' ? 'Chats' : 'New Chat'}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="p-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input className="input-field pl-9 py-2 text-[13px]"
                placeholder={tab === 'conversations' ? 'Search chats...' : 'Search users...'}
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {tab === 'conversations' ? (
              loading ? <div className="p-5 text-center text-slate-500">Loading...</div> :
              conversations.length === 0 ? <div className="p-[30px] text-center text-slate-500 text-[13px]">No conversations yet.<br />Start a new chat!</div> :
              conversations.filter(c => {
                const other = getOtherParticipant(c);
                return other?.name?.toLowerCase().includes(search.toLowerCase());
              }).map(conv => {
                const other = getOtherParticipant(conv);
                const isActive = activeConversation?._id === conv._id;
                return (
                  <div key={conv._id} onClick={() => setActiveConversation(conv)} className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-all duration-200 border-l-[3px] ${isActive ? 'bg-orange-500/10 border-orange-500' : 'bg-transparent border-transparent'}`}>
                    <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm shrink-0">
                      {other?.name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-0.5">
                        <p className="font-semibold text-slate-100 text-sm">{other?.name}</p>
                        <span className="text-[11px] text-slate-500">{timeAgo(conv.lastMessageAt)}</span>
                      </div>
                      <p className="text-xs text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">{conv.lastMessage || 'No messages yet'}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              filteredUsers.map(u => (
                <div key={u._id} onClick={() => startChat(u._id)} className="px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors hover:bg-white/5">
                  <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-sky-500 to-green-500 flex items-center justify-center font-bold text-white text-sm">
                    {u.name?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100 text-sm">{u.name}</p>
                    <p className="text-[11px] text-slate-500 capitalize">{u.role?.replace('_', ' ')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="glass-card overflow-hidden flex flex-col">
          <ChatWindow conversation={activeConversation} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
