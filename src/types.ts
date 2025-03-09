export interface Message {
  role: 'user' | 'assistant';
  content: string;
  modelId?: string;
  isStreaming?: boolean;
}

export interface Settings {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  language: 'am' | 'en';
  model: string;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
}

export interface StreamingHandlers {
  onStart?: () => void;
  onToken?: (token: string) => void;
  onComplete?: () => void;
  onError?: (error: any) => void;
}