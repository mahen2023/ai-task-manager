import { useState } from 'react';
import { aiService } from '../services/ai';
import type { CreateTaskInput } from '../types/task';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UseAIChatProps {
  onTaskCreate: (task: CreateTaskInput) => Promise<void>;
}

export function useAIChat({ onTaskCreate }: UseAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I can help you manage your tasks. Try asking me to create a task or summarize something.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, { role: 'user', content }]);

      const task = await aiService.processNaturalLanguageCommand(content);
      
      if (task) {
        await onTaskCreate(task);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `I've created a task: "${task.title}"`,
          },
        ]);
      } else {
        const summary = await aiService.summarizeTaskDescription(content);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: summary },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
  };
}