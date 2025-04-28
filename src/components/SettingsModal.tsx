import React from 'react';
import { X } from 'lucide-react';
import ModelSelector from './ModelSelector';
import ThemeToggle from './ThemeToggle';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 h-full w-[400px] shadow-xl transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-8 overflow-y-auto h-[calc(100%-64px)]">
          {/* Model Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Model Selection</h3>
            <ModelSelector />
          </div>

          {/* Theme Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Appearance</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="text-sm">Dark Mode</span>
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Chat Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Chat Settings</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="text-sm">Auto-scroll to bottom</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">About</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>B.H.I.M.A v0.1.0</p>
              <p className="mt-1">An AI-powered chat interface built with React and TypeScript.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 