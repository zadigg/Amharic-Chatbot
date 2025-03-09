import { AIModel } from '../types';

export const availableModels: AIModel[] = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4 Mini',
    description: 'OpenAI GPT-4 Mini model'
  },
  {
    id: 'gemini-2.0-flash-lite-preview-02-05',
    name: 'Gemini 2.0 Flash',
    description: 'Fast and efficient Amharic language model'
  }
];

export const getModelById = (modelId: string): AIModel => {
  return availableModels.find(model => model.id === modelId) || availableModels[0];
};