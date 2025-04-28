export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
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
  streamingMessageId: string | null;
  streamingContent: string;
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
    id: 'qwen/qwen2.5-vl-32b-instruct:free',
    name: 'Qwen 2.5 VL 32B',
    description: 'Visual language model with strong instruction following'
  },
  { 
    id: 'deepseek/deepseek-chat-v3-0324:free',
    name: 'DeepSeek Chat V3',
    description: 'Latest version of DeepSeek\'s chat model'
  },
  { 
    id: 'featherless/qwerky-72b:free',
    name: 'Qwerky 72B',
    description: 'Large-scale model with unique capabilities'
  },
  { 
    id: 'mistralai/mistral-small-3.1-24b-instruct:free',
    name: 'Mistral Small 3.1',
    description: 'Efficient instruction-following model from Mistral AI'
  },
  { 
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek R1',
    description: 'Advanced reasoning and analysis model'
  },
  { 
    id: 'deepseek/deepseek-r1-zero:free',
    name: 'DeepSeek R1 Zero',
    description: 'Specialized reasoning model from DeepSeek'
  },
  { 
    id: 'qwen/qwq-32b:free',
    name: 'QWQ 32B',
    description: 'Advanced language model from Qwen'
  },
  { 
    id: 'thudm/glm-4-32b:free', 
    name: 'GLM-4 32B', 
    description: 'Advanced multilingual model with strong reasoning capabilities'
  },
  { 
    id: 'agentica-org/deepcoder-14b-preview:free', 
    name: 'DeepCoder 14B', 
    description: 'Specialized model for code generation and analysis'
  },
  { 
    id: 'nvidia/llama-3.3-nemotron-super-49b-v1:free', 
    name: 'Nemotron Super 49B', 
    description: 'NVIDIA\'s powerful large language model'
  },
  { 
    id: 'nvidia/llama-3.1-nemotron-nano-8b-v1:free', 
    name: 'Nemotron Nano 8B', 
    description: 'Efficient and compact NVIDIA model'
  },
  { 
    id: 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free', 
    name: 'Nemotron Ultra 253B', 
    description: 'NVIDIA\'s ultra-scale language model'
  },
  { 
    id: 'meta-llama/llama-4-maverick:free', 
    name: 'Llama 4 Maverick', 
    description: 'Meta\'s advanced Llama 4 model variant'
  },
  { 
    id: 'meta-llama/llama-4-scout:free', 
    name: 'Llama 4 Scout', 
    description: 'Efficient and fast Llama 4 model'
  },
  { 
    id: 'deepseek/deepseek-v3-base:free', 
    name: 'DeepSeek V3', 
    description: 'Versatile base model for general tasks'
  }
];