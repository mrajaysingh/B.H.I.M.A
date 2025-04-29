import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, MessageSquare, Edit, Trash2, Settings, 
  ChevronDown, LogOut, HelpCircle, User2, X, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversationStore } from '../../store/conversationStore';
import ModelSelector from '../ui/ModelSelector';
import ConfirmDialog from '../ui/ConfirmDialog';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { 
    conversations, 
    activeConversationId, 
    createNewConversation,
    setActiveConversation,
    deleteConversation,
    updateConversationTitle 
  } = useConversationStore();
  
  const [showModels, setShowModels] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const modelSelectorRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelSelectorRef.current && !modelSelectorRef.current.contains(event.target as Node)) {
        setShowModels(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const handleDeleteClick = (conversationId: string) => {
    setConversationToDelete(conversationId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (conversationToDelete) {
      deleteConversation(conversationToDelete);
      setDeleteDialogOpen(false);
      setConversationToDelete(null);
    }
  };

  const startEditing = (conversation: { id: string; title: string }) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleTitleSubmit = () => {
    if (editingId && editTitle.trim()) {
      updateConversationTitle(editingId, editTitle.trim());
      setEditingId(null);
      setEditTitle('');
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditTitle('');
    }
  };
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Conversation"
        message="Are you sure you want to delete this conversation? This action cannot be undone."
      />

      {/* Sidebar */}
      <aside 
        className={`w-72 border-r dark:border-gray-700 bg-white dark:bg-gray-800 h-full flex flex-col fixed top-0 left-0 z-30 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-lg font-bold dark:text-white">B.H.I.M.A.</h1>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 dark:text-gray-200" />
          </button>
        </div>
        
        <div className="p-4">
          <button 
            onClick={createNewConversation}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>New Chat</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-hide px-3 py-2">
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div key={conversation.id} className="group relative">
                <button
                  onClick={() => setActiveConversation(conversation.id)}
                  className={`w-full text-left py-2 px-3 rounded-lg flex items-center space-x-3 group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-colors ${
                    activeConversationId === conversation.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <MessageSquare className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  {editingId === conversation.id ? (
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={handleTitleKeyDown}
                      onBlur={handleTitleSubmit}
                      className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-gray-800 dark:text-gray-200 p-0"
                      placeholder="Enter title..."
                    />
                  ) : (
                    <span className="truncate flex-1 text-gray-800 dark:text-gray-200">
                      {conversation.title}
                    </span>
                  )}
                </button>
                
                <div className="absolute right-2 top-1.5 flex sm:hidden group-hover:flex space-x-1">
                  {editingId === conversation.id ? (
                    <button 
                      className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-green-600 dark:text-green-400"
                      onClick={handleTitleSubmit}
                      title="Save title"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  ) : (
                    <button 
                      className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      title="Edit conversation title"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(conversation);
                      }}
                    >
                      <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  )}
                  <button 
                    className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Delete conversation"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(conversation.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Model display box above divider */}
        <div className="px-3 py-2">
          <div className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg text-center">
            <span className="text-sm font-medium">
              {activeConversation?.model?.name || 'No Model Selected'}
            </span>
          </div>
        </div>
        
        <div className="border-t dark:border-gray-700 p-4 space-y-2">
          <div className="relative" ref={modelSelectorRef}>
            <AnimatePresence>
              {showModels && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-y dark:border-gray-700 z-10 mb-1"
                >
                  <ModelSelector onSelect={() => setShowModels(false)} />
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={() => setShowModels(!showModels)}
              className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-800 dark:text-gray-200">Model</span>
              </div>
              <ChevronDown 
                className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ${
                  showModels ? 'transform rotate-180' : ''
                }`} 
              />
            </button>
          </div>

          <div className="relative z-20">
            <button className="w-full flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <User2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-800 dark:text-gray-200">Account</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <HelpCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-800 dark:text-gray-200">Help</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <LogOut className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-800 dark:text-gray-200">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar