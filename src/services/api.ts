import OpenAI from 'openai';
import { Message } from '../types';

const OPENROUTER_API_KEY = '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';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": window.location.href,
    "X-Title": "AI Chat Interface",
  },
  dangerouslyAllowBrowser: true
});

export async function sendMessageToAI(messages: Message[], model: string = 'microsoft/mai-ds-r1:free') {
  try {
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await openai.chat.completions.create({
      model: model,
      messages: formattedMessages,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error sending message to AI:', error);
    throw error;
  }
}