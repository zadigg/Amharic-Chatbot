import { Message, StreamingHandlers } from '../../../types';
import { formatResponse } from '../../formatters/codeFormatter';
import { SystemPrompts } from '../../../constants/prompts';

const API_KEY = "AIzaSyBHYxMu9aL6Jw4xipbY5I5ZGWuaOm0zqao";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const formatMessages = (messages: Message[]): { role: string; parts: string[] }[] => {
  return messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [msg.content]
  }));
};

export const generateGeminiResponse = async (
  message: string,
  modelId: string,
  previousMessages: Message[] = [],
  isCodeQuery: boolean
): Promise<string> => {
  try {
    const systemPrompt = isCodeQuery ? SystemPrompts.Code.AM : SystemPrompts.Chat.AM;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error Details:", errorData);
      throw new Error(errorData.error?.message || 'API request failed');
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response candidates received');
    }

    const candidate = data.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      throw new Error('Invalid response format');
    }

    const generatedText = candidate.content.parts[0].text;
    if (!generatedText) {
      throw new Error('Empty response received');
    }

    return formatResponse(generatedText);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error.message?.includes("API key")) {
      return "ይቅርታ፣ የAPI ቁልፍ ችግር አለ። እባክዎ አስተዳዳሪውን ያነጋግሩ።";
    }
    if (error.message?.includes("quota") || error.message?.includes("rate")) {
      return "ይቅርታ፣ በአሁኑ ጊዜ ብዙ ጥያቄዎች አሉ። እባክዎ ጥቂት ቆይተው ይሞክሩ።";
    }
    if (error.message?.includes("available") || error.message?.includes("not found")) {
      return "ይቅርታ፣ አገልግሎቱ በአሁኑ ጊዜ አይገኝም። እባክዎ ቆይተው እንደገና ይሞክሩ።";
    }
    
    return "ይቅርታ፣ ችግር ተፈጥሯል። እባክዎ ቆይተው እንደገና ይሞክሩ።";
  }
};

export const generateGeminiStreamingResponse = async (
  message: string,
  modelId: string,
  previousMessages: Message[] = [],
  isCodeQuery: boolean,
  handlers: StreamingHandlers
): Promise<void> => {
  try {
    const systemPrompt = isCodeQuery ? SystemPrompts.Code.AM : SystemPrompts.Chat.AM;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response candidates received');
    }

    const candidate = data.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      throw new Error('Invalid response format');
    }

    const text = candidate.content.parts[0].text;
    if (!text) {
      throw new Error('Empty response received');
    }

    // Simulate streaming by sending chunks of text
    const chunks = text.split(' ');
    for (const chunk of chunks) {
      await new Promise(resolve => setTimeout(resolve, 50));
      handlers.onToken?.(chunk + ' ');
    }

    handlers.onComplete?.();
  } catch (error) {
    handlers.onError?.(error);
  }
};