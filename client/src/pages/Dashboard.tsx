import { useQuery } from "@tanstack/react-query";
import { taskService } from "../services/task";
import { TaskCard } from "../components/tasks/TaskCard";
import { TaskForm } from "../components/tasks/TaskForm";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task, CreateTaskInput } from "../types/task";
import { aiService } from "../services/ai";
import { Modal } from "../components/ui/Modal";

export default function Dashboard() {
  const queryClient = useQueryClient();

  // Fetch tasks with proper error handling
  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await taskService.getTasks();
      if (!response || !Array.isArray(response)) {
        throw new Error("Invalid task data");
      }
      return response;
    },
    // onError: (error) => {
    //   console.error("Error fetching tasks:", error);
    // },
  });

  // State management
  const [summarizingTaskId, setSummarizingTaskId] = useState<string | null>(
    null
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const recentTasks = tasks.slice(0, 3);
  const pendingTasks = tasks.filter((task) => task.status === "PENDING").length;
  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  // Mutation for updating tasks
  const updateMutation = useMutation({
    mutationFn: taskService.updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setSelectedTask(null);
      setIsFormOpen(false);
    },
    onError: (error) => {
      console.error("Error updating task:", error);
      alert("Failed to update the task. Please try again.");
    },
  });

  // Mutation for deleting tasks
  const deleteMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
      alert("Failed to delete the task. Please try again.");
    },
  });

  // Handle task form submission
  const handleSubmit = async (data: CreateTaskInput) => {
    if (selectedTask) {
      await updateMutation.mutateAsync({ id: selectedTask.id, ...data });
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
      setSummarizingTaskId(task.id);
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
      setSummarizingTaskId(null);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading tasks. Please try again later.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {tasks.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Pending Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {pendingTasks}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Completed Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {completedTasks}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Tasks
        </h2>
        {/* {isFormOpen && (
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
        )} */}
        <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
          <div className="space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedTask ? "Edit Task" : "New Task"}
              </h2>
              {/* <button
                  className="text-gray-500 hover:text-gray-800"
                  onClick={() => setIsFormOpen(false)}
                  aria-label="Close"
                >
                  ×
                </button> */}
            </div>

            {/* Task Form */}
            <TaskForm
              task={selectedTask ?? undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedTask(null);
              }}
            />
          </div>
        </Modal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentTasks.map((task) => (
            <TaskCard
              key={task.id} // Ensure task.id is unique
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSummarize={() => handleSummarize(task)}
              isSummarizing={summarizingTaskId === task.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
