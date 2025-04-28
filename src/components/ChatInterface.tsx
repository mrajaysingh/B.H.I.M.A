import React, { useState, useRef, useEffect } from 'react';
import { useChatContext } from '../context/ChatContext';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Bot, ArrowUp, Menu } from 'lucide-react';
import { AVAILABLE_MODELS } from '../types';
import ThemeToggle from './ThemeToggle';
import ReactMarkdown from 'react-markdown';
import { SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { remarkGfm } from 'remark-gfm';

const ChatInterface: React.FC = () => {
  const { currentConversation, isLoading, sendMessage } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="flex flex-col h-[100dvh] bg-white dark:bg-gray-900">
      {/* Header - Fixed at top */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-2">
          <h1 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            B.H.I.M.A
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md text-black dark:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Messages - Scrollable area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 pb-44 sm:pb-56 md:pb-64 lg:pb-72 xl:pb-80">
        {currentConversation?.messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[90%] sm:max-w-[80%] rounded-lg p-3 sm:p-4 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="overflow-x-auto">
                        <SyntaxHighlighter
                          language={match[1]}
                          style={atomOneDark}
                          customStyle={{
                            backgroundColor: 'transparent',
                            padding: 0,
                            margin: 0,
                            fontSize: '0.875rem',
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code
                        className={`${
                          message.role === 'user'
                            ? 'bg-blue-700/50 dark:bg-blue-900/50'
                            : 'bg-gray-200 dark:bg-gray-700'
                        } px-1 py-0.5 rounded text-sm`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  p: ({ children }) => (
                    <p className="text-sm sm:text-base leading-relaxed">{children}</p>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-xl sm:text-2xl font-bold my-2">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg sm:text-xl font-bold my-2">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base sm:text-lg font-bold my-2">{children}</h3>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-sm sm:text-base">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-2 italic">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[90%] sm:max-w-[80%] rounded-lg p-3 sm:p-4 bg-gray-100 dark:bg-gray-800">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Message Input Box as Overlay Centered */}
      <div className="fixed inset-0 z-40 flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
        {/* Centered Input Box */}
        <div className="relative z-50 max-w-xl w-full mx-auto p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              currentPrompt={currentPrompt}
              setCurrentPrompt={setCurrentPrompt}
            />
            <div className="px-4 pb-3 text-xs text-gray-500 dark:text-gray-400 text-center">
              AI responses may contain inaccuracies. Consider verifying important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;