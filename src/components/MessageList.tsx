import React from 'react';
import { Message } from '../types';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: Message[];
  model: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, model }) => {
  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} model={model} />
      ))}
    </div>
  );
};

export default MessageList;