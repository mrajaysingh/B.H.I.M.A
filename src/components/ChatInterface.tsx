import React, { useState, useRef, useEffect } from 'react';
import { useChatContext } from '../context/ChatContext';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Bot, User } from 'lucide-react';

const ChatInterface: React.FC = () => {
  const { currentConversation, isLoading, sendMessage } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');

  const handleSendMessage = (content: string) => {
    if (content.trim()) {
      sendMessage(content.trim());
      setCurrentPrompt('');
    }
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  // Safely check if we have messages
  const hasMessages = currentConversation?.messages && currentConversation.messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      {!hasMessages ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="text-center max-w-xl">
            <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Bot size={30} className="text-gray-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
            <p className="text-gray-600 mb-8">
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
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors"
                  onClick={() => setCurrentPrompt(example)}
                >
                  <span className="text-sm">{example}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <MessageList messages={currentConversation.messages} />
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="border-t border-gray-200 p-4">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          currentPrompt={currentPrompt}
          setCurrentPrompt={setCurrentPrompt}
        />
        <div className="mt-2 text-xs text-gray-500 text-center">
          AI responses may contain inaccuracies. Consider verifying important information.
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;