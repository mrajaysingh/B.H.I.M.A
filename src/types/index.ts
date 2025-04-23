export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: number;
  updatedAt: number;
}

export interface ChatContextType {
  conversations: Conversation[];
  currentConversationId: string | null;
  currentConversation: Conversation | null;
  isLoading: boolean;
  createNewConversation: () => void;
  setCurrentConversationId: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  deleteConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
  setModel: (model: string) => void;
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string | null;
    index: number;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ModelOption {
  id: string;
  name: string;
  description?: string;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  { 
    id: 'microsoft/mai-ds-r1:free', 
    name: 'Microsoft MAI-DS-r1', 
    description: 'Latest Microsoft research model (free tier)'
  },
  { 
    id: 'google/gemma-7b-it:free', 
    name: 'Google Gemma 7B', 
    description: 'Google\'s efficient and capable model'
  },
  { 
    id: 'anthropic/claude-3-haiku:8k', 
    name: 'Claude 3 Haiku', 
    description: 'Fast and efficient Claude model'
  },
  { 
    id: 'openai/gpt-3.5-turbo:free', 
    name: 'GPT-3.5 Turbo', 
    description: 'Efficient GPT model by OpenAI'
  }
];