import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { useChatContext } from './context/ChatContext';
import { Menu } from 'lucide-react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const { currentConversation } = useChatContext();

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-white text-black overflow-hidden">
      {/* Mobile menu button */}
      <button 
        className="md:hidden fixed z-20 top-4 left-4 p-2 bg-white border border-gray-200 rounded-md shadow-sm"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300 md:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      
      <div 
        className={`fixed md:static w-[280px] z-20 h-full bg-gray-50 border-r border-gray-200 transition-transform duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <main className="flex-1 relative">
          <ChatInterface />
        </main>
      </div>
    </div>
  );
}

export default App;