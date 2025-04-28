import React, { useEffect, useState } from 'react';
import { Message, AVAILABLE_MODELS } from '../types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Bot, User } from 'lucide-react';
import { useChatContext } from '../context/ChatContext';

interface MessageItemProps {
  message: Message;
  model: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, model }) => {
  const { streamingMessageId, streamingContent } = useChatContext();
  const [displayContent, setDisplayContent] = useState(message.content);
  const isUser = message.role === 'user';
  const modelInfo = AVAILABLE_MODELS.find(m => m.id === (message.model || model));
  const isStreaming = streamingMessageId === message.id;
  
  useEffect(() => {
    if (isStreaming) {
      setDisplayContent(streamingContent);
    } else {
      setDisplayContent(message.content);
    }
  }, [isStreaming, streamingContent, message.content]);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
      <div className={`flex gap-4 max-w-[70%] ${isUser ? 'bg-black dark:bg-gray-700 text-white flex-row-reverse' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
        <div className="flex-shrink-0">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center 
            ${isUser 
              ? 'bg-white dark:bg-gray-200 text-black' 
              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'}`}
          >
            {isUser ? <User size={16} /> : <Bot size={16} />}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          {!isUser && message.model && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Model: {modelInfo?.name || message.model}
            </div>
          )}
          <div className="markdown-body">
            {isUser ? (
              <div className="prose prose-sm prose-invert max-w-none">
                {displayContent}
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
                {displayContent}
              </ReactMarkdown>
            )}
            {isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-black dark:bg-white animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;