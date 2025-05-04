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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900"
          >
            <Preloader />
          </motion.div>
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col h-full"
          >
            <Header 
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
              isSidebarOpen={isSidebarOpen} 
            />
            
            <div className="flex-1 flex overflow-hidden">
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-lg"
                  >
                    <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex-1 flex flex-col">
                <ChatArea />
                <FloatingInput />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;