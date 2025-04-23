import React, { createContext, useContext, useState, useEffect } from 'react';
import { Conversation, ChatContextType, Message } from '../types';
import { nanoid } from 'nanoid';
import { 
  saveConversation, 
  getConversationsFromLocalStorage, 
  createNewConversation as createNewConversationUtil,
  deleteConversation as deleteConversationUtil
} from '../services/history';
import { sendMessageToAI } from '../services/api';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load conversations from localStorage on initial render
  useEffect(() => {
    const loadedConversations = getConversationsFromLocalStorage();
    setConversations(loadedConversations);
    
    // Set current conversation to the most recent one, or create a new one if none exist
    if (loadedConversations.length > 0) {
      const mostRecent = loadedConversations.reduce((prev, current) => 
        current.updatedAt > prev.updatedAt ? current : prev
      );
      setCurrentConversationId(mostRecent.id);
    } else {
      const newConversation = createNewConversationUtil();
      setConversations([newConversation]);
      setCurrentConversationId(newConversation.id);
      saveConversation(newConversation);
    }
  }, []);

  // Get current conversation object
  const currentConversation = currentConversationId 
    ? conversations.find(conv => conv.id === currentConversationId) || null
    : null;

  const createNewConversation = () => {
    const newConversation = createNewConversationUtil();
    setConversations(prev => [...prev, newConversation]);
    setCurrentConversationId(newConversation.id);
    saveConversation(newConversation);
  };

  const updateConversation = (updatedConversation: Conversation) => {
    setConversations(prev => 
      prev.map(conv => conv.id === updatedConversation.id ? updatedConversation : conv)
    );
    saveConversation(updatedConversation);
  };

  const sendMessage = async (content: string) => {
    if (!currentConversation) return;

    // Add user message
    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content,
      timestamp: Date.now()
    };

    const updatedMessages = [...currentConversation.messages, userMessage];
    const updatedConversation = {
      ...currentConversation,
      messages: updatedMessages,
      updatedAt: Date.now(),
      title: updatedMessages.length === 1 ? content.slice(0, 30) + (content.length > 30 ? '...' : '') : currentConversation.title
    };

    // Update state with user message
    updateConversation(updatedConversation);

    // Send to AI and get response
    setIsLoading(true);
    try {
      const aiResponse = await sendMessageToAI(updatedMessages, currentConversation.model);
      
      // Add AI response
      const assistantMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: aiResponse || "Sorry, I couldn't generate a response.",
        timestamp: Date.now()
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      const finalConversation = {
        ...updatedConversation,
        messages: finalMessages,
        updatedAt: Date.now()
      };

      // Update state with AI response
      updateConversation(finalConversation);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: "Sorry, there was an error processing your request. Please try again.",
        timestamp: Date.now()
      };

      const errorConversation = {
        ...updatedConversation,
        messages: [...updatedMessages, errorMessage],
        updatedAt: Date.now()
      };

      updateConversation(errorConversation);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = (id: string) => {
    deleteConversationUtil(id);
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
    // If we deleted the current conversation, select another one or create new
    if (currentConversationId === id) {
      const remainingConversations = conversations.filter(conv => conv.id !== id);
      if (remainingConversations.length > 0) {
        setCurrentConversationId(remainingConversations[0].id);
      } else {
        createNewConversation();
      }
    }
  };

  const updateConversationTitle = (id: string, title: string) => {
    const conversation = conversations.find(conv => conv.id === id);
    if (conversation) {
      const updatedConversation = { 
        ...conversation, 
        title,
        updatedAt: Date.now()
      };
      updateConversation(updatedConversation);
    }
  };

  const setModel = (model: string) => {
    if (currentConversation) {
      const updatedConversation = {
        ...currentConversation,
        model,
        updatedAt: Date.now()
      };
      updateConversation(updatedConversation);
    }
  };

  const contextValue: ChatContextType = {
    conversations,
    currentConversationId,
    currentConversation,
    isLoading,
    createNewConversation,
    setCurrentConversationId,
    sendMessage,
    deleteConversation,
    updateConversationTitle,
    setModel
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};