import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import ChatArea from '../chat/ChatArea';
import FloatingInput from '../chat/FloatingInput';
import Header from './Header';
import Preloader from '../ui/Preloader';
import { useSettingsStore } from '../../store/settingsStore';
import { useConversationStore } from '../../store/conversationStore';

const AppLayout: React.FC = () => {
  const { settings } = useSettingsStore();
  const { activeConversationId, createNewConversation } = useConversationStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create a new conversation if none exists
  useEffect(() => {
    if (!activeConversationId) {
      createNewConversation();
    }
  }, [activeConversationId, createNewConversation]);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loader for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Preloader />
          </motion.div>
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`h-screen flex flex-col md:flex-row overflow-hidden ${
              settings.theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'
            }`}
          >
            <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
            
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
              <ChatArea />
              <FloatingInput />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppLayout;