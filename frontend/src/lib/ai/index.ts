import { AIProvider } from './provider';
import { OpenAIProvider } from './openai';
import { MockAIProvider } from './mock';
import { env } from '@/lib/config/env';

let activeProvider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (activeProvider) {
    return activeProvider;
  }

  if (env.OPENAI_API_KEY && env.OPENAI_API_KEY.trim().length > 0) {
    activeProvider = new OpenAIProvider();
  } else {
    activeProvider = new MockAIProvider();
  }

  return activeProvider;
}

export * from './provider';
export { MockAIProvider } from './mock';
export { OpenAIProvider } from './openai';
