import { create } from 'zustand';
import { 
  ConversationData, 
  MessageData, 
  MessageFilterType, 
  NotificationSound,
  OnlineStatus,
  MessageStatus,
  ContactSharingStatus
} from '../types/communication';
import { MessageType } from '../types/enums';

interface CommunicationStore {
  // Conversation state
  currentConversationId: string | null;
  conversations: ConversationData[];
  messages: Record<string, MessageData[]>;
  
  // Real-time state
  activeTypingUsers: string[];
  onlineUsers: string[];
  lastSeenTimestamps: Record<string, string>;
  
  // UI state
  messageFilter: MessageFilterType;
  searchQuery: string;
  unreadMessageCount: number;
  
  // Settings
  notificationSound: NotificationSound;
  isNotificationMuted: boolean;
  contactSharedUsers: string[];
  blockedUsers: string[];
  
  // Actions
  setCurrentConversation: (conversationId: string | null) => void;
  addConversation: (conversation: ConversationData) => void;
  updateConversation: (conversationId: string, updates: Partial<ConversationData>) => void;
  
  addMessage: (message: MessageData) => void;
  updateMessage: (messageId: string, updates: Partial<MessageData>) => void;
  markMessageAsRead: (messageId: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  
  setTypingStatus: (userId: string, isTyping: boolean) => void;
  setOnlineStatus: (userId: string, status: OnlineStatus) => void;
  updateLastSeen: (userId: string, timestamp: string) => void;
  
  setMessageFilter: (filter: MessageFilterType) => void;
  setSearchQuery: (query: string) => void;
  
  shareContact: (userId: string) => void;
  revokeContactSharing: (userId: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  
  archiveConversation: (conversationId: string) => void;
  muteConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  
  updateUnreadCount: () => void;
}

export const useCommunicationStore = create<CommunicationStore>((set, get) => ({
  // Initial state
  currentConversationId: null,
  conversations: [],
  messages: {},
  activeTypingUsers: [],
  onlineUsers: [],
  lastSeenTimestamps: {},
  messageFilter: MessageFilterType.ALL,
  searchQuery: '',
  unreadMessageCount: 0,
  notificationSound: NotificationSound.DEFAULT,
  isNotificationMuted: false,
  contactSharedUsers: [],
  blockedUsers: [],

  // Actions
  setCurrentConversation: (conversationId) => set({ currentConversationId: conversationId }),
  
  addConversation: (conversation) => set((state) => ({
    conversations: [conversation, ...state.conversations]
  })),
  
  updateConversation: (conversationId, updates) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conv.id === conversationId ? { ...conv, ...updates } : conv
    )
  })),
  
  addMessage: (message) => set((state) => {
    const conversationMessages = state.messages[message.conversationId] || [];
    const updatedMessages = {
      ...state.messages,
      [message.conversationId]: [...conversationMessages, message]
    };
    
    // Update conversation's last message
    const updatedConversations = state.conversations.map(conv =>
      conv.id === message.conversationId
        ? { 
            ...conv, 
            lastMessage: message, 
            updatedAt: message.timestamp,
            unreadCount: message.senderId !== 'user_123' ? conv.unreadCount + 1 : conv.unreadCount
          }
        : conv
    );
    
    return {
      messages: updatedMessages,
      conversations: updatedConversations
    };
  }),
  
  updateMessage: (messageId, updates) => set((state) => {
    const updatedMessages = { ...state.messages };
    
    Object.keys(updatedMessages).forEach(conversationId => {
      updatedMessages[conversationId] = updatedMessages[conversationId].map(msg =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      );
    });
    
    return { messages: updatedMessages };
  }),
  
  markMessageAsRead: (messageId) => {
    get().updateMessage(messageId, { isRead: true, status: MessageStatus.READ });
  },
  
  markConversationAsRead: (conversationId) => set((state) => {
    const conversationMessages = state.messages[conversationId] || [];
    const updatedMessages = {
      ...state.messages,
      [conversationId]: conversationMessages.map(msg => ({ ...msg, isRead: true }))
    };
    
    const updatedConversations = state.conversations.map(conv =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    );
    
    return {
      messages: updatedMessages,
      conversations: updatedConversations
    };
  }),
  
  setTypingStatus: (userId, isTyping) => set((state) => ({
    activeTypingUsers: isTyping
      ? [...state.activeTypingUsers.filter(id => id !== userId), userId]
      : state.activeTypingUsers.filter(id => id !== userId)
  })),
  
  setOnlineStatus: (userId, status) => set((state) => ({
    onlineUsers: status === OnlineStatus.ONLINE
      ? [...state.onlineUsers.filter(id => id !== userId), userId]
      : state.onlineUsers.filter(id => id !== userId)
  })),
  
  updateLastSeen: (userId, timestamp) => set((state) => ({
    lastSeenTimestamps: { ...state.lastSeenTimestamps, [userId]: timestamp }
  })),
  
  setMessageFilter: (filter) => set({ messageFilter: filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  shareContact: (userId) => set((state) => ({
    contactSharedUsers: [...state.contactSharedUsers.filter(id => id !== userId), userId]
  })),
  
  revokeContactSharing: (userId) => set((state) => ({
    contactSharedUsers: state.contactSharedUsers.filter(id => id !== userId)
  })),
  
  blockUser: (userId) => set((state) => ({
    blockedUsers: [...state.blockedUsers.filter(id => id !== userId), userId],
    contactSharedUsers: state.contactSharedUsers.filter(id => id !== userId)
  })),
  
  unblockUser: (userId) => set((state) => ({
    blockedUsers: state.blockedUsers.filter(id => id !== userId)
  })),
  
  archiveConversation: (conversationId) => {
    get().updateConversation(conversationId, { isArchived: true });
  },
  
  muteConversation: (conversationId) => {
    get().updateConversation(conversationId, { isMuted: true });
  },
  
  deleteConversation: (conversationId) => set((state) => ({
    conversations: state.conversations.filter(conv => conv.id !== conversationId),
    messages: Object.fromEntries(
      Object.entries(state.messages).filter(([id]) => id !== conversationId)
    ),
    currentConversationId: state.currentConversationId === conversationId 
      ? null 
      : state.currentConversationId
  })),
  
  updateUnreadCount: () => set((state) => {
    const totalUnread = state.conversations.reduce((total, conv) => total + conv.unreadCount, 0);
    return { unreadMessageCount: totalUnread };
  })
}));