import React from 'react';
import { useChatContext } from '../context/ChatContext';
import { AVAILABLE_MODELS } from '../types';

const ModelSelector: React.FC = () => {
  const { currentConversation, setModel } = useChatContext();
  
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModel(e.target.value);
  };

  return (
    <div className="w-full">
      <select
        value={currentConversation?.model || AVAILABLE_MODELS[0].id}
        onChange={handleModelChange}
        className="w-full text-sm rounded-md border-gray-300 py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
      >
        {AVAILABLE_MODELS.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      
      {currentConversation?.model && (
        <p className="mt-1 text-xs text-gray-500">
          {AVAILABLE_MODELS.find(m => m.id === currentConversation.model)?.description || ''}
        </p>
      )}
    </div>
  );
};

export default ModelSelector;