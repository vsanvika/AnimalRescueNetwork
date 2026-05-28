const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Notification = require('../models/Notification');

// Track online users: userId -> socketId
const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      onlineUsers.set(userId, socket.id);
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
      console.log(`🟢 User connected: ${userId}`);
    }

    // ─── Join a conversation room ───────────────────────────────────────────
    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
    });

    // ─── Send a message ────────────────────────────────────────────────────
    socket.on('sendMessage', async ({ conversationId, senderId, content }) => {
      try {
        const message = await Message.create({ conversationId, sender: senderId, content });
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: content,
          lastMessageAt: new Date(),
        });
        const populated = await message.populate('sender', 'name profilePicture');
        io.to(conversationId).emit('newMessage', populated);
      } catch (err) {
        socket.emit('error', err.message);
      }
    });

    // ─── Typing indicator ──────────────────────────────────────────────────
    socket.on('typing', ({ conversationId, userId }) => {
      socket.to(conversationId).emit('userTyping', { userId });
    });

    socket.on('stopTyping', ({ conversationId }) => {
      socket.to(conversationId).emit('userStoppedTyping');
    });

    // ─── Mark messages as seen ────────────────────────────────────────────
    socket.on('markSeen', async ({ conversationId, userId }) => {
      await Message.updateMany(
        { conversationId, sender: { $ne: userId }, seen: false },
        { seen: true }
      );
      io.to(conversationId).emit('messagesSeen', { conversationId, userId });
    });

    // ─── Send notification to specific user ───────────────────────────────
    socket.on('sendNotification', async ({ recipientId, type, message, link }) => {
      try {
        const notification = await Notification.create({ recipient: recipientId, type, message, link });
        const recipientSocket = onlineUsers.get(recipientId);
        if (recipientSocket) {
          io.to(recipientSocket).emit('newNotification', notification);
        }
      } catch (err) {
        console.error('Notification error:', err.message);
      }
    });

    // ─── Disconnect ────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
      console.log(`🔴 User disconnected: ${userId}`);
    });
  });
};

module.exports = { socketHandler, onlineUsers };
