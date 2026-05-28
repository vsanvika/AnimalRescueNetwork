const asyncHandler = require('express-async-handler');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @desc  Get or create conversation
// @route POST /api/chat/conversation
const getOrCreateConversation = asyncHandler(async (req, res) => {
  const { participantId } = req.body;

  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, participantId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, participantId],
    });
  }

  await conversation.populate('participants', 'name profilePicture role');
  res.json(conversation);
});

// @desc  Get all conversations for current user
// @route GET /api/chat/conversations
const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate('participants', 'name profilePicture role')
    .sort({ lastMessageAt: -1 });
  res.json(conversations);
});

// @desc  Get messages for a conversation
// @route GET /api/chat/messages/:conversationId
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({ conversationId: req.params.conversationId })
    .populate('sender', 'name profilePicture')
    .sort({ createdAt: 1 });
  res.json(messages);
});

// @desc  Send message (HTTP fallback)
// @route POST /api/chat/messages
const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, content } = req.body;
  const message = await Message.create({ conversationId, sender: req.user._id, content });
  await Conversation.findByIdAndUpdate(conversationId, { lastMessage: content, lastMessageAt: new Date() });
  await message.populate('sender', 'name profilePicture');
  res.status(201).json(message);
});

module.exports = { getOrCreateConversation, getConversations, getMessages, sendMessage };
