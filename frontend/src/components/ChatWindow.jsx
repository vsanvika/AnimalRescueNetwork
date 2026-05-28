import { useEffect, useRef, useState } from 'react';
import { Send, Loader } from 'lucide-react';
import useChatStore from '../store/chatStore';
import useAuthStore from '../store/authStore';
import { socket } from '../hooks/useSocket';
import API from '../api/axios';

const ChatWindow = ({ conversation }) => {
  const { user } = useAuthStore();
  const { messages, setMessages, typingUser } = useChatStore();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  const otherParticipant = conversation?.participants?.find((p) => p._id !== user._id);

  useEffect(() => {
    if (!conversation) return;
    setLoading(true);
    socket?.emit('joinConversation', conversation._id);
    API.get(`/chat/messages/${conversation._id}`)
      .then((res) => setMessages(res.data))
      .finally(() => setLoading(false));
  }, [conversation?._id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    socket?.emit('sendMessage', { conversationId: conversation._id, senderId: user._id, content: text });
    socket?.emit('stopTyping', { conversationId: conversation._id });
    setText('');
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    socket?.emit('typing', { conversationId: conversation._id, userId: user._id });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket?.emit('stopTyping', { conversationId: conversation._id });
    }, 1500);
  };

  const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!conversation) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-600">
      <span className="text-[48px]">💬</span>
      <p className="text-base font-semibold">Select a conversation to start chatting</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
        {otherParticipant?.profilePicture
          ? <img src={otherParticipant.profilePicture} className="w-[38px] h-[38px] rounded-full object-cover" alt="" />
          : <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm">{otherParticipant?.name?.[0]}</div>
        }
        <div>
          <p className="font-semibold text-slate-100 text-[15px]">{otherParticipant?.name}</p>
          <p className="text-[11px] text-orange-500 capitalize">{otherParticipant?.role?.replace('_', ' ')}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
        {loading && <div className="text-center text-slate-500"><Loader size={20} className="spinner" /></div>}
        {messages.map((msg) => {
          const isMe = msg.sender._id === user._id || msg.sender === user._id;
          return (
            <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[70%]">
                <div className={`px-3.5 py-2.5 text-sm text-slate-100 leading-relaxed ${isMe ? 'rounded-[18px_18px_4px_18px] bg-gradient-to-br from-orange-500 to-orange-600' : 'rounded-[18px_18px_18px_4px] bg-white/10'}`}>
                  {msg.content}
                </div>
                <p className={`text-[10px] text-slate-600 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                  {formatTime(msg.createdAt)} {isMe && (msg.seen ? '✓✓' : '✓')}
                </p>
              </div>
            </div>
          );
        })}
        {typingUser && typingUser !== user._id && (
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 rounded-[18px_18px_18px_4px] bg-white/10 text-slate-400 text-sm">
              <span>typing</span>
              <span className="inline-flex gap-0.5 ml-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-1 h-1 rounded-full bg-slate-400 inline-block" style={{ animation: `pulse-glow 1s ${i * 0.2}s infinite` }} />
                ))}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="px-5 py-4 border-t border-white/10 flex gap-2.5">
        <input
          value={text}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="input-field flex-1"
        />
        <button type="submit" className="btn-primary px-4 py-2.5">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
