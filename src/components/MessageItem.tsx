import React from 'react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Bot, User } from 'lucide-react';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-4 ${isUser ? 'bg-white' : 'bg-gray-50'} p-4 rounded-lg`}>
      <div className="flex-shrink-0">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center 
          ${isUser ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
      </div>
      
      <div className="flex-1 min-w-0 markdown-body">
        {isUser ? (
          <div className="prose prose-sm max-w-none">
            {message.content}
          </div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={coldarkDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default MessageItem;