import { useState } from 'react';
import { aiService } from '../services/ai';
import type { CreateTaskInput } from '../types/task';

export function useAISuggestions() {
  const [suggestions, setSuggestions] = useState<CreateTaskInput[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = async (prompt: string) => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const tasks = await aiService.generateTaskSuggestions(prompt);
      setSuggestions(tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    suggestions,
    isLoading,
    error,
    generateSuggestions,
  };
}