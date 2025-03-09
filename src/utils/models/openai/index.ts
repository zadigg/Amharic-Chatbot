import OpenAI from "openai";
import { Message, StreamingHandlers } from '../../../types';
import { SystemPrompts } from '../../../constants/prompts';

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

export const formatMessages = (messages: Message[]): { role: string; content: string }[] => {
  return messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));
};

export const generateOpenAIResponse = async (
  message: string,
  modelId: string,
  previousMessages: Message[] = [],
  isCodeQuery: boolean
): Promise<string> => {
  const systemPrompt = isCodeQuery ? SystemPrompts.Code.AM : SystemPrompts.Chat.AM;

  const completion = await openai.chat.completions.create({
    model: modelId,
    messages: [
      { role: 'system', content: systemPrompt },
      ...formatMessages([...previousMessages, { role: 'user', content: message }])
    ],
    temperature: 0.7,
    max_tokens: 2048,
  });

  return completion.choices[0]?.message?.content || "ይቅርታ፣ ምላሽ ማግኘት አልቻልኩም።";
};

export const generateOpenAIStreamingResponse = async (
  message: string,
  modelId: string,
  previousMessages: Message[] = [],
  isCodeQuery: boolean,
  handlers: StreamingHandlers
): Promise<void> => {
  try {
    const systemPrompt = isCodeQuery ? SystemPrompts.Code.AM : SystemPrompts.Chat.AM;

    const stream = await openai.chat.completions.create({
      model: modelId,
      messages: [
        { role: 'system', content: systemPrompt },
        ...formatMessages([...previousMessages, { role: 'user', content: message }])
      ],
      temperature: 0.7,
      max_tokens: 2048,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        handlers.onToken?.(content);
      }
    }

    handlers.onComplete?.();
  } catch (error) {
    handlers.onError?.(error);
  }
};