import { useState, useRef, useEffect } from "react";
import { AlertCircle, Sparkles, Bot } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { aiService } from "../../services/ai";
import type { CreateTaskInput } from "../../types/task";

interface ChatMessage {
  id: string;
  message: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  onTaskCreate: (task: CreateTaskInput) => Promise<void>;
}

const INITIAL_MESSAGE = `👋 Hello! I'm your AI task assistant. I can help you:

- Create new tasks from natural language
- Generate task suggestions
- Summarize task descriptions

Try saying something like "Create a task to review the project proposal by next Friday" or "Suggest some tasks for improving team communication".`;

export function Chatbot({ onTaskCreate }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      message: INITIAL_MESSAGE,
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (message: string, isBot: boolean) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        message,
        isBot,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    setError(null);
    addMessage(message, false);

    try {
      const task = await aiService.processNaturalLanguageCommand(message);

      if (task) {
        await onTaskCreate(task);
        addMessage(
          `✨ I've created a new task for you:\n\nTitle: ${task.title}${
            task.dueDate
              ? `\nDue Date: ${new Date(task.dueDate).toLocaleDateString()}`
              : ""
          }${task.description ? `\nDescription: ${task.description}` : ""}`,
          true
        );
      } else {
        const suggestions = await aiService.generateTaskSuggestions(message);

        if (suggestions.length > 0) {
          const suggestionMessage = suggestions
            .map(
              (task) =>
                `- ${task.title}${
                  task.dueDate
                    ? ` (Due: ${new Date(task.dueDate).toLocaleDateString()})`
                    : ""
                }`
            )
            .join("\n");

          addMessage(
            `📋 Here are some task suggestions based on your input:\n\n${suggestionMessage}\n\nWould you like me to create any of these tasks for you? Just let me know which one!`,
            true
          );
        } else {
          const summary = await aiService.summarizeTaskDescription(message);
          addMessage(
            `📝 Here's a concise summary of what you said:\n\n${summary}\n\nWould you like me to create a task based on this?`,
            true
          );
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      addMessage(
        "❌ I apologize, but I encountered an error processing your request. Please try again.",
        true
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Task Assistant</h2>
            <p className="text-sm text-blue-100">
              Powered by AI to help manage your tasks
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg.message}
            isBot={msg.isBot}
            timestamp={msg.timestamp}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <div className="flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="w-4 h-4" />
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="p-4 border-t bg-white rounded-b-xl">
        <ChatInput
          onSend={handleSendMessage}
          disabled={isLoading}
          placeholder="Type / to start chatting..."
        />
      </div>
    </div>
  );
}
