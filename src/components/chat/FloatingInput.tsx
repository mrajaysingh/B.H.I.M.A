import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, PaperclipIcon, Globe, Lightbulb, Image, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversationStore } from '../../store/conversationStore';
import { streamResponse } from '../../lib/openrouter';
import { Message } from '../../types';
import { useTypingEffect } from '../../hooks/useTypingEffect';

const THINKING_PROMPT = `You are a highly intelligent, thoughtful, and articulate AI assistant. Your responses must reflect deep reasoning, clear logic, and emotional intelligence. Always consider the user's intent, context, and possible implications before responding. Never rush to answer—pause mentally to think critically, like a philosopher, scientist, or engineer would.

- Break down complex questions into parts before answering.
- Ask clarifying questions if anything is ambiguous.
- Provide structured, layered, and well-justified explanations.
- Think in terms of root causes, long-term effects, and nuanced trade-offs.
- When relevant, give real-world analogies or examples to aid understanding.
- If unsure, say so with humility and suggest where or how the user might find the answer.
- Do not assume the user wants the most common answer—ask what they're trying to achieve.

Your tone should be respectful, calm, and insightful. Prioritize truth, logic, and helpfulness over speed or brevity. You are not here to impress; you are here to understand and assist meaningfully.`;

const FloatingInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [showAttachOptions, setShowAttachOptions] = useState(false);
  const [hasThinkingPromptSent, setHasThinkingPromptSent] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const attachOptionsRef = useRef<HTMLDivElement>(null);
  const placeholder = useTypingEffect();
  
  const { 
    activeConversationId, 
    conversations,
    addMessageToConversation,
    updateLastMessage 
  } = useConversationStore();

  // Handle click outside for attach options
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (attachOptionsRef.current && !attachOptionsRef.current.contains(event.target as Node)) {
        setShowAttachOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  
  const handleThinkingToggle = () => {
    if (!isThinking && !hasThinkingPromptSent && activeConversationId) {
      // Send thinking prompt when activating thinking mode for the first time
      addMessageToConversation(activeConversationId, {
        role: 'system',
        content: THINKING_PROMPT
      });
      setHasThinkingPromptSent(true);
    }
    setIsThinking(!isThinking);
  };
  
  const handleSendMessage = async () => {
    if (!message.trim() || isStreaming || !activeConversationId) return;
    
    const userMessage: Omit<Message, 'id' | 'createdAt'> = {
      role: 'user',
      content: message
    };
    
    // Add user message
    addMessageToConversation(activeConversationId, userMessage);
    setMessage('');
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    // Show thinking state
    setIsStreaming(true);
    setIsThinking(true);
    
    // Add initial thinking message
    const thinkingMessage: Omit<Message, 'id' | 'createdAt'> = {
      role: 'assistant',
      content: 'Thinking...'
    };
    addMessageToConversation(activeConversationId, thinkingMessage);
    
    try {
      let aiResponse = '';
      const model = activeConversation?.model?.id || 'microsoft/mai-ds-r1:free';
      const messages = [
        ...activeConversation?.messages || [],
        { role: 'user', content: message }
      ].map(m => ({ role: m.role, content: m.content }));
      
      // Stream the response
      for await (const chunk of streamResponse(messages, model)) {
        if (chunk.choices[0]?.delta?.content) {
          aiResponse += chunk.choices[0].delta.content;
          
          // Update the thinking message with accumulated response
          updateLastMessage(activeConversationId, {
            role: 'assistant',
            content: aiResponse,
            createdAt: Date.now()
          });
        }
      }
    } catch (error) {
      console.error('Error streaming response:', error);
      updateLastMessage(activeConversationId, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        createdAt: Date.now()
      });
    } finally {
      setIsStreaming(false);
      setIsThinking(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Auto-resize textarea as user types
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Reset height to auto so that it can shrink if needed
    e.target.style.height = 'auto';
    
    // Set the height to scroll height to accommodate the content
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };
  
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-0 w-full max-w-3xl px-4 pb-4 md:pb-6 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900 pt-6">
      <div className="relative">
        <AnimatePresence>
          {showAttachOptions && (
            <motion.div 
              ref={attachOptionsRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex space-x-2"
            >
              <button 
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Image className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
              <button 
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <FileText className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 flex items-end">
          <div className="flex-1 p-3">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={isThinking ? "I'm thinking about this..." : placeholder}
              rows={1}
              disabled={isStreaming || isThinking}
              className="w-full resize-none bg-transparent border-0 focus:ring-0 focus:outline-none p-0 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-70 placeholder:truncate"
              style={{ 
                minHeight: '24px',
                maxHeight: '200px',
                overflow: 'hidden'
              }}
            />
          </div>
          
          <div className="flex items-center p-2 space-x-1">
            <button 
              onClick={() => setShowAttachOptions(!showAttachOptions)}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Attach files"
            >
              <PaperclipIcon className="h-5 w-5" />
            </button>
            
            <button 
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Web search"
            >
              <Globe className="h-5 w-5" />
            </button>
            
            <button 
              onClick={handleThinkingToggle}
              className={`p-2 rounded-full transition-colors ${
                isThinking 
                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' 
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="Thinking mode"
            >
              <Lightbulb className="h-5 w-5" />
            </button>
            
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isStreaming}
              className="p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600"
              title="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
          Messages are processed using NeutalNetwork V-99.58
        </div>
      </div>
    </div>
  );
};

export default FloatingInput