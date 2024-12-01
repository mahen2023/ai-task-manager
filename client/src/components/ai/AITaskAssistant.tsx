import { useState } from "react";
import { AlertCircle, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { aiService } from "../../services/ai";
import type { CreateTaskInput } from "../../types/task";

interface AITaskAssistantProps {
  onTaskCreate: (task: CreateTaskInput) => Promise<void>;
}

export function AITaskAssistant({ onTaskCreate }: AITaskAssistantProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<CreateTaskInput[]>([]);

  const handleGenerateSuggestions = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const tasks = await aiService.generateTaskSuggestions(prompt);
      setSuggestions(tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNaturalLanguageCommand = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const task = await aiService.processNaturalLanguageCommand(prompt);
      if (task) {
        await onTaskCreate(task);
        setPrompt("");
        setSuggestions([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a task description or command..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button
          onClick={handleGenerateSuggestions}
          disabled={isLoading || !prompt.trim()}
          className="whitespace-nowrap"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Ideas
        </Button>
        <Button
          onClick={handleNaturalLanguageCommand}
          disabled={isLoading || !prompt.trim()}
          variant="outline"
          className="whitespace-nowrap"
        >
          Create Task
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <h3 className="font-medium text-gray-900">Suggested Tasks</h3>
          <div className="space-y-2">
            {suggestions.map((task, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => {
                  onTaskCreate(task);
                  setSuggestions([]);
                  setPrompt("");
                }}
              >
                <h4 className="font-medium">{task.title}</h4>
                {task.description && (
                  <p className="text-sm text-gray-600">{task.description}</p>
                )}
                {task.dueDate && (
                  <p className="text-sm text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
                {task.status && (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : task.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {task.status.replace("_", " ")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
