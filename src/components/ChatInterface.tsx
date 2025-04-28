import React, { useState, useRef, useEffect } from 'react';
import { useChatContext } from '../context/ChatContext';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Bot, ArrowUp } from 'lucide-react';
import { AVAILABLE_MODELS } from '../types';
import ThemeToggle from './ThemeToggle';

const ChatInterface: React.FC = () => {
  const { currentConversation, isLoading, sendMessage } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  const handleSendMessage = (content: string) => {
    if (content.trim()) {
      sendMessage(content.trim());
      setCurrentPrompt('');
      setAutoScroll(true);
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    // Debounce scroll handling
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      if (!scrollContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
      setAutoScroll(isAtBottom);
      setShowScrollTop(scrollTop > 200);
    }, 100);
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [currentConversation?.messages, autoScroll]);

  // Cleanup scroll timeout
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const hasMessages = currentConversation?.messages && currentConversation.messages.length > 0;
  const currentModel = AVAILABLE_MODELS.find(m => m.id === currentConversation?.model);

  return (
    <div className="flex flex-col h-full relative">
      {/* Chat Title */}
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Bot size={24} className="text-gray-600 dark:text-gray-300" />
          <h1 className="text-xl font-semibold">
            Chatting with {currentModel?.name || 'AI Assistant'}
          </h1>
        </div>
        <ThemeToggle />
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-hidden pb-40">
        {!hasMessages ? (
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center max-w-xl">
              <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Bot size={30} className="text-gray-600 dark:text-gray-300" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Ask me anything, from simple questions to complex problems. I'm here to help with explanations, creative content, code, and more.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                {[
                  "Explain quantum computing in simple terms",
                  "Write a poem about a moonlit forest",
                  "Create a JavaScript function to sort an array",
                  "Design a 1-week itinerary for Japan"
                ].map((example, index) => (
                  <button
                    key={index}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition-colors"
                    onClick={() => setCurrentPrompt(example)}
                  >
                    <span className="text-sm">{example}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="h-full overflow-y-auto px-6 py-4 space-y-6 will-change-scroll"
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <MessageList 
              messages={currentConversation.messages} 
              model={currentConversation.model} 
            />
            <div ref={messagesEndRef} className="h-px" />
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed right-6 bottom-32 z-30 p-3 bg-gray-900 dark:bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Floating Message Input Box */}
      <div className="absolute bottom-6 left-6 right-6 mx-auto max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
            currentPrompt={currentPrompt}
            setCurrentPrompt={setCurrentPrompt}
          />
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            AI responses may contain inaccuracies. Consider verifying important information.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;