import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/Button";
import { TaskCard } from "../components/tasks/TaskCard";
import { TaskForm } from "../components/tasks/TaskForm";
import { AITaskAssistant } from "../components/ai/AITaskAssistant";
import { taskService } from "../services/task";
import { aiService } from "../services/ai"; // Import the AI service
import type { Task, CreateTaskInput } from "../types/task";
import { useAuthStore } from "../stores/auth";

export default function Tasks() {
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [summarizingTaskId, setSummarizingTaskId] = useState<string | null>(
    null
  ); // Track task being summarized
  const { user } = useAuthStore();
  const userId = user?.id;

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskService.getTasks,
  });

  const createMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: taskService.updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setSelectedTask(null);
      setIsFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleSubmit = async (data: CreateTaskInput) => {
    if (!userId) {
      console.error("User ID is not available.");
      return; // Prevent submission if user ID is missing
    }
    const taskData = { ...data, userId }; // Add userId to the task data

    if (selectedTask) {
      await updateMutation.mutateAsync({ id: selectedTask.id, ...data });
    } else {
      await createMutation.mutateAsync(taskData);
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleSummarize = async (task: Task) => {
    try {
      setSummarizingTaskId(task.id); // Indicate the task being summarized
      if (!task.description) {
        throw new Error("Task description is undefined.");
      }
      const summary = await aiService.summarizeTaskDescription(
        task.description
      );
      await updateMutation.mutateAsync({ id: task.id, description: summary });
    } catch (error) {
      console.error("Error summarizing task description:", error);
      alert("Failed to summarize the task description. Please try again.");
    } finally {
      setSummarizingTaskId(null); // Reset after summarizing
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <AITaskAssistant
        onTaskCreate={async (task: CreateTaskInput) => {
          await createMutation.mutateAsync(task);
        }}
      />

      {isFormOpen && (
        <div className="bg-white rounded-lg shadow p-6">
          <TaskForm
            task={selectedTask ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedTask(null);
            }}
          />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSummarize={() => handleSummarize(task)} // Pass summarization handler
            isSummarizing={summarizingTaskId === task.id} // Indicate summarizing status
          />
        ))}
      </div>
    </div>
  );
}
