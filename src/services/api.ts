import OpenAI from 'openai';
import { Message } from '../types';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": window.location.href,
    "X-Title": "AI Chat Interface",
  },
  dangerouslyAllowBrowser: true
});

export async function sendMessageToAI(
  messages: Message[], 
  model: string = 'microsoft/mai-ds-r1:free',
  onChunk?: (chunk: string) => void
) {
  try {
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await openai.chat.completions.create({
      model: model,
      messages: formattedMessages,
      stream: true
    });

    let fullResponse = '';
    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
      onChunk?.(fullResponse);
    }

    return fullResponse;
  } catch (error) {
    console.error('Error sending message to AI:', error);
    throw error;
  }
}