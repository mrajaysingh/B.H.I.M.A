export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  attachments?: Attachment[];
  createdAt: number;
};

export type Attachment = {
  id: string;
  type: 'image' | 'pdf';
  url: string;
  name: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  model: AIModel;
  createdAt: number;
  updatedAt: number;
};

export type AIModel = {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  inputPrice: number;
  outputPrice: number;
};

export type Theme = 'light' | 'dark';

export type Settings = {
  theme: Theme;
  animations: boolean;
  fontSize: 'small' | 'medium' | 'large';
  apiKey?: string;
};