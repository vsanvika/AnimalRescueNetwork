import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';
import useChatStore from '../store/chatStore';
import useNotificationStore from '../store/notificationStore';

let socket = null;

const useSocket = () => {
  const { user } = useAuthStore();
  const { addMessage, setOnlineUsers, setTypingUser, clearTypingUser } = useChatStore();
  const { addNotification } = useNotificationStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!user || initialized.current) return;

    socket = io(import.meta.env.VITE_SOCKET_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`, {
      query: { userId: user._id },
      transports: ['websocket'],
    });

    initialized.current = true;

    socket.on('onlineUsers', (users) => setOnlineUsers(users));
    socket.on('newMessage', (message) => addMessage(message));
    socket.on('userTyping', ({ userId }) => setTypingUser(userId));
    socket.on('userStoppedTyping', () => clearTypingUser());
    socket.on('newNotification', (notification) => addNotification(notification));

    return () => {
      socket.disconnect();
      initialized.current = false;
    };
  }, [user]);

  return socket;
};

export { socket };
export default useSocket;
