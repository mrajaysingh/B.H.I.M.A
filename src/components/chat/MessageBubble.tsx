import React from 'react';
import { Message } from '../../types';
import { User2, Bot } from 'lucide-react';
import CodeBlock from '../ui/CodeBlock';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  // Function to detect and parse code blocks
  const renderContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(
          <p key={lastIndex} className="whitespace-pre-wrap break-words">
            {content.slice(lastIndex, match.index)}
          </p>
        );
      }

      // Add code block
      const language = match[1] || 'plaintext';
      const code = match[2].trim();
      parts.push(
        <CodeBlock key={match.index} code={code} language={language} />
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(
        <p key={lastIndex} className="whitespace-pre-wrap break-words">
          {content.slice(lastIndex)}
        </p>
      );
    }

    return parts.length > 0 ? parts : <p className="whitespace-pre-wrap break-words">{content}</p>;
  };

  return (
    <div className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className={`p-2 rounded-full ${
        message.role === 'user' 
          ? 'bg-indigo-600 text-white' 
          : 'bg-gray-200 dark:bg-gray-700'
      }`}>
        {message.role === 'user' ? (
          <User2 className="h-5 w-5" />
        ) : (
          <Bot className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        )}
      </div>
      
      <div className={`flex-1 space-y-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block max-w-[90%] sm:max-w-[85%] rounded-2xl px-3 py-2 ${
          message.role === 'user'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
        }`}>
          {renderContent(message.content)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;