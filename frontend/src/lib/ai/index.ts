import { AIProvider } from './provider';
import { GeminiProvider } from './gemini';
import { OpenAIProvider } from './openai';
import { MockAIProvider } from './mock';
import { env } from '@/lib/config/env';

let activeProvider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (activeProvider) {
    return activeProvider;
  }

  if (env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim().length > 0) {
    activeProvider = new GeminiProvider();
  } else if (env.OPENAI_API_KEY && env.OPENAI_API_KEY.trim().length > 0) {
    activeProvider = new OpenAIProvider();
  } else {
    activeProvider = new MockAIProvider();
  }

  return activeProvider;
}

export * from './provider';
export { GeminiProvider } from './gemini';
export { MockAIProvider } from './mock';
export { OpenAIProvider } from './openai';
