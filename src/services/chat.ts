import { Message, StreamingHandlers } from '../types';
import { generateGeminiResponse, generateGeminiStreamingResponse } from '../utils/models/gemini';
import { generateOpenAIResponse, generateOpenAIStreamingResponse } from '../utils/models/openai';
import { isCodeRequest } from '../utils/formatters/codeFormatter';
import { getErrorMessage } from '../utils/errors/errorMessages';

const MODEL_HANDLERS = {
  'gpt': {
    generate: generateOpenAIResponse,
    stream: generateOpenAIStreamingResponse,
  },
  'gemini': {
    generate: generateGeminiResponse,
    stream: generateGeminiStreamingResponse,
  },
} as const;

const getModelType = (modelId: string): keyof typeof MODEL_HANDLERS | null => {
  if (modelId.startsWith('gpt')) return 'gpt';
  if (modelId.startsWith('gemini')) return 'gemini';
  return null;
};

export const generateResponse = async (
  message: string,
  modelId: string,
  previousMessages: Message[] = [],
  streamingHandlers?: StreamingHandlers
): Promise<string | null> => {
  try {
    const modelType = getModelType(modelId);
    if (!modelType) {
      const error = new Error("ይቅርታ፣ ያልታወቀ ሞዴል። እባክዎ ሌላ ሞዴል ይምረጡ።");
      streamingHandlers?.onError?.(error);
      return error.message;
    }

    const modelMessages = previousMessages.filter(msg => msg.modelId === modelId);
    const isCodeQuery = isCodeRequest(message);
    const handler = MODEL_HANDLERS[modelType];

    if (streamingHandlers) {
      try {
        streamingHandlers.onStart?.();
        await handler.stream(
          message,
          modelId,
          modelMessages,
          isCodeQuery,
          {
            ...streamingHandlers,
            onError: (error: any) => {
              console.error('Streaming error:', error);
              const errorMessage = getErrorMessage(error);
              streamingHandlers.onToken?.(errorMessage);
              streamingHandlers.onError?.(error);
              streamingHandlers.onComplete?.();
            }
          }
        );
        return null;
      } catch (error: any) {
        console.error('Error in streaming response:', error);
        const errorMessage = getErrorMessage(error);
        streamingHandlers.onToken?.(errorMessage);
        streamingHandlers.onError?.(error);
        streamingHandlers.onComplete?.();
        return null;
      }
    } else {
      return await handler.generate(message, modelId, modelMessages, isCodeQuery);
    }
  } catch (error: any) {
    console.error('Error generating response:', error);
    const errorMessage = getErrorMessage(error);
    streamingHandlers?.onError?.(error);
    return errorMessage;
  }
};