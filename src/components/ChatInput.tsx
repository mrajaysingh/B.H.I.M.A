import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  currentPrompt: string;
  setCurrentPrompt: React.Dispatch<React.SetStateAction<string>>;
}

const PLACEHOLDERS = [
  "Cooking recipe",
  "Help in homework",
  "Why is this happening?",
  "Write me code...",
  "Talk to me...",
  "What's up...",
  "Tell me a fun fact",
  "Best movies to watch",
  "Explain AI in simple words",
  "Suggest me a project idea",
  "Motivate me today",
  "What can I learn new?",
  "Tell me a joke",
  "How to become rich?",
  "Give me life advice",
  "Who created the universe?",
  "What's trending today?",
  "Translate this to French",
  "Summarize this article",
  "Is time travel possible?",
  "Teach me something cool",
  "Debug this error",
  "Make me laugh",
  "Write a poem",
  "Generate a startup idea",
  "Tell me about black holes",
  "Create a story with me",
  "Give me a workout plan",
  "Make a to-do list",
  "What's the future of AI?",
  "Who am I?",
  "Best places to travel",
  "Write an email for me",
  "What is love?",
  "How do I start coding?",
  "Plan my day",
  "Teach me about hacking",
  "Give me a fun quiz",
  "What's the weather in Tokyo?",
  "What is quantum computing?",
  "Sing me a song",
  "Tell me something spooky",
  "Give me a random fact",
  "How do I stay focused?",
  "Write a romantic message",
  "What's in the news?",
  "How to meditate?",
  "Show me a magic trick",
  "Write a motivational quote",
  "What are dreams made of?",
  "Make a meme for me",
  "Help me sleep",
  "Let's play a game",
  "Hack like a pro",
  "What is the dark web?",
  "Can you predict the future?",
  "Build a website for me"
];

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  currentPrompt,
  setCurrentPrompt
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeedRef = useRef({ typing: 100, deleting: 50, pause: 2000 });

  useEffect(() => {
    if (currentPrompt) {
      setIsTyping(false);
      return;
    }

    let timeout: NodeJS.Timeout;
    const currentText = PLACEHOLDERS[placeholderIndex];

    const typeNextCharacter = () => {
      if (!isTyping) return;

      if (!isDeleting && currentPlaceholder.length < currentText.length) {
        setCurrentPlaceholder(currentText.substring(0, currentPlaceholder.length + 1));
        timeout = setTimeout(typeNextCharacter, typingSpeedRef.current.typing);
      } else if (!isDeleting && currentPlaceholder.length === currentText.length) {
        timeout = setTimeout(() => setIsDeleting(true), typingSpeedRef.current.pause);
      } else if (isDeleting && currentPlaceholder.length > 0) {
        setCurrentPlaceholder(currentPlaceholder.substring(0, currentPlaceholder.length - 1));
        timeout = setTimeout(typeNextCharacter, typingSpeedRef.current.deleting);
      } else if (isDeleting && currentPlaceholder.length === 0) {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
      }
    };

    timeout = setTimeout(typeNextCharacter, isDeleting ? typingSpeedRef.current.deleting : typingSpeedRef.current.typing);

    return () => clearTimeout(timeout);
  }, [currentPlaceholder, isDeleting, placeholderIndex, isTyping, currentPrompt]);

  useEffect(() => {
    if (currentPrompt && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [currentPrompt]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentPrompt(e.target.value);
    if (e.target.value === '') {
      setIsTyping(true);
      setIsDeleting(false);
      setCurrentPlaceholder('');
    }
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
      setIsTyping(true);
      setIsDeleting(false);
      setCurrentPlaceholder('');
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [currentPrompt]);

  return (
    <div className="relative">
      <div className="flex items-end border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus-within:ring-1 focus-within:ring-black dark:focus-within:ring-white focus-within:border-black dark:focus-within:border-white transition-colors">
        <textarea
          ref={textareaRef}
          value={currentPrompt}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={currentPlaceholder}
          disabled={isLoading}
          className="flex-1 max-h-[200px] py-3 pl-4 pr-12 resize-none border-0 bg-transparent focus:ring-0 focus:outline-none text-sm text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          rows={1}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !currentPrompt.trim()}
          className={`absolute right-3 bottom-3 p-1 rounded-md 
            ${isLoading || !currentPrompt.trim() 
              ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
              : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            } transition-colors`}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;