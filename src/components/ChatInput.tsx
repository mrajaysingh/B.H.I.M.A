import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  currentPrompt: string;
  setCurrentPrompt: React.Dispatch<React.SetStateAction<string>>;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  currentPrompt,
  setCurrentPrompt
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when currentPrompt changes (for example prompts)
  useEffect(() => {
    if (currentPrompt && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [currentPrompt]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentPrompt(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!isLoading && currentPrompt.trim()) {
      onSendMessage(currentPrompt);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [currentPrompt]);

  return (
    <div className="relative">
      <div className="flex items-end border border-gray-300 bg-white rounded-lg focus-within:ring-1 focus-within:ring-black focus-within:border-black transition-colors">
        <textarea
          ref={textareaRef}
          value={currentPrompt}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Message AI..."
          disabled={isLoading}
          className="flex-1 max-h-[200px] py-3 pl-4 pr-12 resize-none border-0 bg-transparent focus:ring-0 focus:outline-none text-sm"
          rows={1}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !currentPrompt.trim()}
          className={`absolute right-3 bottom-3 p-1 rounded-md 
            ${isLoading || !currentPrompt.trim() 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-black hover:bg-gray-100'
            } transition-colors`}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;