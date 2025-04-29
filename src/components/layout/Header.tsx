import React from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { motion } from 'framer-motion';
import { useConversationStore } from '../../store/conversationStore';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { settings, toggleTheme } = useSettingsStore();
  const { activeConversationId, conversations } = useConversationStore();
  
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  
  return (
    <header className="h-16 border-b dark:border-gray-700 flex items-center justify-between px-4 md:pl-6 md:pr-8">
      {/* Mobile menu toggle */}
      <button 
        onClick={onToggleSidebar}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5 dark:text-gray-200" />
        ) : (
          <Menu className="h-5 w-5 dark:text-gray-200" />
        )}
      </button>
      
      {/* Conversation title */}
      <div className="flex-1 md:ml-4">
        <h1 className="text-lg font-medium truncate dark:text-white">
          {activeConversation?.title || 'New Conversation'}
        </h1>
      </div>
      
      {/* Theme toggle */}
      <motion.button 
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        onClick={toggleTheme}
        whileTap={{ scale: 0.9 }}
      >
        {settings.theme === 'dark' ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-gray-600" />
        )}
      </motion.button>
    </header>
  );
};

export default Header