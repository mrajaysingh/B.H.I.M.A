import React, { useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { useConversationStore } from '../../store/conversationStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIModel } from '../../types';

interface ModelSelectorProps {
  onSelect?: () => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ onSelect }) => {
  const { availableModels } = useSettingsStore();
  const { activeConversationId, conversations, updateConversationModel } = useConversationStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const currentModel = availableModels[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? availableModels.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === availableModels.length - 1 ? 0 : prev + 1));
  };

  const handleSelectModel = () => {
    if (activeConversationId && currentModel) {
      updateConversationModel(activeConversationId, currentModel);
      onSelect?.();
    }
  };

  return (
    <div className="w-full flex items-center justify-between px-3 py-2 h-[72px]">
      <button
        onClick={handlePrevious}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>

      <motion.button
        key={currentModel.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        onClick={handleSelectModel}
        className={`flex-1 p-2 mx-2 rounded-lg transition-colors overflow-hidden ${
          activeConversation?.model?.id === currentModel.id
            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        <div className="text-center">
          <div className="font-medium text-gray-900 dark:text-white truncate">
            {currentModel.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {currentModel.provider} • {Math.round(currentModel.contextLength / 1000)}K ctx
          </div>
        </div>
      </motion.button>

      <button
        onClick={handleNext}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  );
};

export default ModelSelector;