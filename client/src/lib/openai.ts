import OpenAI from 'openai';

let openaiInstance: OpenAI | null = null;

export function getOpenAIInstance(): OpenAI {
  if (!openaiInstance) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error(
        'OpenAI API key is missing. Please add VITE_OPENAI_API_KEY to your .env file.'
      );
    }

    openaiInstance = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  return openaiInstance;
}