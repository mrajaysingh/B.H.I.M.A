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
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>('');

  useEffect(() => {
    const loadedConversations = getConversationsFromLocalStorage();
    setConversations(loadedConversations);
    
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

    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content,
      timestamp: Date.now()
    };

    const assistantMessage: Message = {
      id: nanoid(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      model: currentConversation.model // Store the current model with the message
    };

    setStreamingMessageId(assistantMessage.id);
    setStreamingContent('');

    const updatedMessages = [...currentConversation.messages, userMessage, assistantMessage];
    const updatedConversation = {
      ...currentConversation,
      messages: updatedMessages,
      updatedAt: Date.now(),
      title: updatedMessages.length === 2 ? content.slice(0, 30) + (content.length > 30 ? '...' : '') : currentConversation.title
    };

    updateConversation(updatedConversation);

    setIsLoading(true);
    try {
      const aiResponse = await sendMessageToAI(
        [...currentConversation.messages, userMessage],
        currentConversation.model,
        (chunk) => {
          setStreamingContent(chunk);
          
          const streamingConversation = {
            ...updatedConversation,
            messages: updatedMessages.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, content: chunk }
                : msg
            )
          };
          updateConversation(streamingConversation);
        }
      );

      const finalMessages = updatedMessages.map(msg => 
        msg.id === assistantMessage.id 
          ? { ...msg, content: aiResponse }
          : msg
      );

      const finalConversation = {
        ...updatedConversation,
        messages: finalMessages,
        updatedAt: Date.now()
      };

      updateConversation(finalConversation);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage = "Sorry, there was an error processing your request. Please try again.";
      const errorConversation = {
        ...updatedConversation,
        messages: updatedMessages.map(msg => 
          msg.id === assistantMessage.id 
            ? { ...msg, content: errorMessage }
            : msg
        ),
        updatedAt: Date.now()
      };

      updateConversation(errorConversation);
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
      setStreamingContent('');
    }
  };

  const deleteConversation = (id: string) => {
    deleteConversationUtil(id);
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
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
    streamingMessageId,
    streamingContent,
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