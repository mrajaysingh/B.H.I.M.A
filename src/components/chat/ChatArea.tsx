import React, { useRef, useEffect, useState } from 'react';
import { useConversationStore } from '../../store/conversationStore';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Message } from '../../types';
import { streamResponse } from '../../lib/openrouter';
import { Copy, RefreshCw, Check } from 'lucide-react';

interface ExamplePrompt {
  title: string;
  prompt: string;
}

const examplePrompts: ExamplePrompt[] = [
  {
    title: "Explain quantum computing in simple terms",
    prompt: "Can you explain quantum computing in simple terms that a beginner would understand?"
  },
  {
    title: "Write a poem about a moonlit forest",
    prompt: "Write a beautiful and atmospheric poem about a forest bathed in moonlight."
  },
  {
    title: "Create a JavaScript function to sort an array",
    prompt: "Help me create an efficient JavaScript function to sort an array of numbers."
  },
  {
    title: "Design a 1-week itinerary for Japan",
    prompt: "Can you help me create a detailed 1-week travel itinerary for visiting Japan?"
  }
];

const ChatArea: React.FC = () => {
  const { 
    activeConversationId, 
    conversations, 
    addMessageToConversation,
    updateLastMessage 
  } = useConversationStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages.filter(m => m.role !== 'system') || [];
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isMessageComplete = (message: Message) => {
    return message.role === 'assistant' && 
           message.content !== '...' && 
           message.content !== 'I apologize, but I encountered an error. Please try again.';
  };

  const handleExampleClick = async (prompt: string) => {
    if (activeConversationId) {
      // Add user message
      addMessageToConversation(activeConversationId, {
        role: 'user',
        content: prompt
      });

      // Add initial response message
      addMessageToConversation(activeConversationId, {
        role: 'assistant',
        content: '...'
      });

      try {
        let aiResponse = '';
        const model = activeConversation?.model?.id || 'microsoft/mai-ds-r1:free';
        const messages = [
          ...activeConversation?.messages || [],
          { role: 'user', content: prompt }
        ].map(m => ({ role: m.role, content: m.content }));
        
        // Stream the response
        for await (const chunk of streamResponse(messages, model)) {
          if (chunk.choices[0]?.delta?.content) {
            aiResponse += chunk.choices[0].delta.content;
            
            // Update the response message with accumulated response
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
      }
    }
  };
  
  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleRegenerateResponse = async (messageId: string) => {
    if (!activeConversationId) return;

    // Find the user message that prompted this response
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1 || messageIndex === 0) return;

    const userMessage = messages[messageIndex - 1];
    if (userMessage.role !== 'user') return;

    // Remove the current response
    const updatedMessages = messages.filter(m => m.id !== messageId);
    
    // Add new response message
    addMessageToConversation(activeConversationId, {
      role: 'assistant',
      content: '...'
    });

    try {
      let aiResponse = '';
      const model = activeConversation?.model?.id || 'microsoft/mai-ds-r1:free';
      const messages = [
        ...activeConversation?.messages.filter(m => m.id !== messageId) || [],
        { role: 'user', content: userMessage.content }
      ].map(m => ({ role: m.role, content: m.content }));
      
      // Stream the response
      for await (const chunk of streamResponse(messages, model)) {
        if (chunk.choices[0]?.delta?.content) {
          aiResponse += chunk.choices[0].delta.content;
          
          // Update the response message with accumulated response
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
    }
  };
  
  const formatMessage = (message: Message) => {
    if (message.role === 'user') {
      return message.content;
    }
    
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                customStyle={{ margin: '1em 0', padding: '1em', borderRadius: '0.5em' }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-sm" {...props}>
                {children}
              </code>
            );
          },
          p: ({ children }) => (
            <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>
          ),
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold mb-3 mt-5">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="mb-1">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
              {children}
            </td>
          ),
        }}
      >
        {message.content}
      </ReactMarkdown>
    );
  };
  
  if (!activeConversation) {
    return <div className="flex-1 flex items-center justify-center">
      <p className="text-gray-500 dark:text-gray-400">No conversation selected</p>
    </div>;
  }
  
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-6 pb-32 md:pb-40">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center">
          <div className="max-w-2xl w-full text-center space-y-6 md:space-y-8 px-2">
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white leading-tight">
                How can I help you today?
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                Ask me anything, from simple questions to complex problems. I'm here to help with explanations, creative content, code, and more.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-2">
              {examplePrompts.map((example, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleExampleClick(example.prompt)}
                  className="text-left p-3 md:p-4 rounded-xl border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-800 dark:text-gray-200 text-sm md:text-base"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {example.title}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}
                >
                  {formatMessage(message)}
                  
                  {message.role === 'assistant' && isMessageComplete(message) && (
                    <div className="flex justify-end mt-2 space-x-2">
                      <motion.button
                        onClick={() => handleCopyMessage(message.content, message.id)}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title={copiedMessageId === message.id ? "Copied!" : "Copy message"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <AnimatePresence mode="wait">
                          {copiedMessageId === message.id ? (
                            <motion.div
                              key="check"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Check className="h-4 w-4 text-green-500" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="copy"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                      <button
                        onClick={() => handleRegenerateResponse(message.id)}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Regenerate response"
                      >
                        <RefreshCw className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-1" />
        </div>
      )}
    </div>
  );
};

export default ChatArea;