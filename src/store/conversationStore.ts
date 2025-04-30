import { create } from 'zustand';
import { Conversation, Message, AIModel } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_MODELS } from '../lib/openrouter';

interface ConversationState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  
  // Actions
  setActiveConversation: (id: string) => void;
  createNewConversation: () => string;
  addMessageToConversation: (conversationId: string, message: Omit<Message, 'id' | 'createdAt'>) => void;
  updateLastMessage: (conversationId: string, message: Omit<Message, 'id'>) => void;
  updateConversationTitle: (conversationId: string, title: string) => void;
  deleteConversation: (conversationId: string) => void;
  clearConversations: () => void;
  updateConversationModel: (conversationId: string, model: AIModel) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: [],
  activeConversationId: null,
  isLoading: false,
  
  setActiveConversation: (id) => set({ activeConversationId: id }),
  
  createNewConversation: () => {
    const newId = uuidv4();
    const timestamp = Date.now();
    
    const newConversation: Conversation = {
      id: newId,
      title: 'New Conversation',
      messages: [
        {
          id: uuidv4(),
          role: 'system',
          content: 'You are a highly knowledgeable and precise assistant. Always provide factually correct, up-to-date, and clearly explained answers. When answering, prioritize clarity, conciseness, and logical flow. If a question requires context, ask for it before answering. Do not guess or fabricate information — if unsure or if information is unavailable, clearly state that. When possible, cite trusted sources, and always double-check facts.',
          createdAt: timestamp
        }
      ],
      model: DEFAULT_MODELS[0],
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      activeConversationId: newId
    }));
    
    return newId;
  },
  
  addMessageToConversation: (conversationId, messageData) => {
    set((state) => {
      const timestamp = Date.now();
      const newMessage: Message = {
        id: uuidv4(),
        ...messageData,
        createdAt: timestamp
      };
      
      const updatedConversations = state.conversations.map(conversation => {
        if (conversation.id === conversationId) {
          // Update conversation title if it's still the default and this is the first user message
          let title = conversation.title;
          if (title === 'New Conversation' && messageData.role === 'user') {
            title = messageData.content.slice(0, 30) + (messageData.content.length > 30 ? '...' : '');
          }
          
          return {
            ...conversation,
            messages: [...conversation.messages, newMessage],
            title,
            updatedAt: timestamp
          };
        }
        return conversation;
      });
      
      return { conversations: updatedConversations };
    });
  },

  updateLastMessage: (conversationId, messageData) => {
    set((state) => {
      const updatedConversations = state.conversations.map(conversation => {
        if (conversation.id === conversationId) {
          const messages = [...conversation.messages];
          if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === messageData.role) {
              messages[messages.length - 1] = {
                ...messageData,
                id: lastMessage.id,
                createdAt: lastMessage.createdAt
              };
            }
          }
          return {
            ...conversation,
            messages,
            updatedAt: Date.now()
          };
        }
        return conversation;
      });
      
      return { conversations: updatedConversations };
    });
  },
  
  updateConversationTitle: (conversationId, title) => {
    set((state) => ({
      conversations: state.conversations.map(conversation => 
        conversation.id === conversationId 
          ? { ...conversation, title, updatedAt: Date.now() } 
          : conversation
      )
    }));
  },
  
  deleteConversation: (conversationId) => {
    set((state) => {
      const updatedConversations = state.conversations.filter(c => c.id !== conversationId);
      let activeId = state.activeConversationId;
      
      // If we deleted the active conversation, select another one or null
      if (activeId === conversationId) {
        activeId = updatedConversations.length > 0 ? updatedConversations[0].id : null;
      }
      
      return {
        conversations: updatedConversations,
        activeConversationId: activeId
      };
    });
  },
  
  clearConversations: () => set({ conversations: [], activeConversationId: null }),

  updateConversationModel: (conversationId, model) => {
    set((state) => ({
      conversations: state.conversations.map(conversation =>
        conversation.id === conversationId
          ? { ...conversation, model, updatedAt: Date.now() }
          : conversation
      )
    }));
  }
}));
