import { create } from 'zustand';

const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  onlineUsers: [],
  typingUser: null,

  setConversations: (conversations) => set({ conversations }),

  setActiveConversation: (conversation) => set({ activeConversation: conversation, messages: [] }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      conversations: state.conversations.map((c) =>
        c._id === message.conversationId
          ? { ...c, lastMessage: message.content, lastMessageAt: message.createdAt }
          : c
      ),
    })),

  setOnlineUsers: (users) => set({ onlineUsers: users }),

  setTypingUser: (userId) => set({ typingUser: userId }),

  clearTypingUser: () => set({ typingUser: null }),

  isUserOnline: (userId) => get().onlineUsers.includes(userId),
}));

export default useChatStore;
