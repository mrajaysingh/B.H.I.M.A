import React, { useRef, useEffect } from 'react';
import { useConversationStore } from '../../store/conversationStore';
import MessageBubble from './MessageBubble';
import { motion } from 'framer-motion';
import { streamResponse } from '../../lib/openrouter';

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
  
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages.filter(m => m.role !== 'system') || [];
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleExampleClick = async (prompt: string) => {
    if (activeConversationId) {
      // Add user message
      addMessageToConversation(activeConversationId, {
        role: 'user',
        content: prompt
      });

      // Add initial thinking message
      addMessageToConversation(activeConversationId, {
        role: 'assistant',
        content: 'Thinking...'
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
      }
    }
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
                How can I help you today ?
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
          {messages.map((message, i) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.1, 0.5) }}
            >
              <MessageBubble message={message} />
            </motion.div>
          ))}
          <div ref={messagesEndRef} className="h-1" />
        </div>
      )}
    </div>
  );
};

export default ChatArea