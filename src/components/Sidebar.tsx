import React, { useState } from 'react';
import { useChatContext } from '../context/ChatContext';
import { PlusCircle, MessageSquare, Trash2, Edit2, X, Settings } from 'lucide-react';
import ModelSelector from './ModelSelector';

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { 
    conversations, 
    currentConversationId, 
    createNewConversation, 
    setCurrentConversationId,
    deleteConversation,
    updateConversationTitle
  } = useChatContext();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);

  const handleEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveEdit = (id: string) => {
    if (editTitle.trim()) {
      updateConversationTitle(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSaveEdit(id);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  // Sort conversations by updatedAt (newest first)
  const sortedConversations = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="flex flex-col h-full bg-gray-50 text-primary-900">
      {/* Header with new chat button */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-semibold">AI Chat</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Settings size={20} />
          </button>
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-200 transition-colors"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* New chat button */}
      <button
        onClick={createNewConversation}
        className="mx-4 mt-4 mb-2 py-2 px-4 bg-white border border-gray-300 rounded-md flex items-center space-x-2 hover:bg-gray-100 transition-all"
      >
        <PlusCircle size={18} />
        <span>New chat</span>
      </button>

      {showSettings && (
        <div className="mx-4 mb-4 bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <h3 className="text-sm font-medium mb-2">Model Selection</h3>
          <ModelSelector />
        </div>
      )}

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto pt-2">
        <h2 className="px-4 mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
          Conversations
        </h2>
        
        <ul className="space-y-1 px-2">
          {sortedConversations.length === 0 ? (
            <li className="px-2 py-3 text-sm text-gray-500">No conversations yet</li>
          ) : (
            sortedConversations.map((conv) => (
              <li key={conv.id} className={`
                relative rounded-md 
                ${currentConversationId === conv.id ? 'bg-gray-200' : 'hover:bg-gray-100'}
                transition-colors
              `}>
                {editingId === conv.id ? (
                  <div className="p-2 flex">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => handleSaveEdit(conv.id)}
                      onKeyDown={(e) => handleKeyDown(e, conv.id)}
                      className="flex-1 min-w-0 px-2 py-1 text-sm rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div 
                    className="p-2 cursor-pointer flex items-start group"
                    onClick={() => setCurrentConversationId(conv.id)}
                  >
                    <MessageSquare className="flex-shrink-0 h-5 w-5 mt-0.5 mr-3 text-gray-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{conv.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(conv.updatedAt)}</p>
                    </div>
                    <div className="ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(conv.id, conv.title);
                        }}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                        className="p-1 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Footer with version */}
      <div className="p-4 text-xs text-gray-500 border-t border-gray-200">
        AI Chat Interface v0.1.0
      </div>
    </div>
  );
};

export default Sidebar;