import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, MessageSquare, List, LayoutGrid } from "lucide-react";
import { Button } from "../components/ui/Button";
import { TaskCard } from "../components/tasks/TaskCard";
import { TaskForm } from "../components/tasks/TaskForm";
import { AITaskAssistant } from "../components/ai/AITaskAssistant";
import { taskService } from "../services/task";
import { aiService } from "../services/ai"; // Import the AI service
import type { Task, CreateTaskInput } from "../types/task";
import { useAuthStore } from "../stores/auth";

import { Chatbot } from "../components/ai/Chatbot";

export default function Tasks() {
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [summarizingTaskId, setSummarizingTaskId] = useState<string | null>(
    null
  ); // Track task being summarized
  const { user } = useAuthStore();
  const userId = user?.id;
  const [showChatbot, setShowChatbot] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<
    "all" | "pending" | "in_progress" | "completed"
  >("all");

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

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status.toLowerCase() === filter;
  });

  // return (
  //   <div className="space-y-6">
  //     <div className="flex justify-between items-center">
  //       <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
  //       {/* <Button onClick={() => setIsFormOpen(true)}>
  //         <Plus className="h-4 w-4 mr-2" />
  //         New Task
  //       </Button> */}
  //       <div className="flex gap-2">
  //         <Button
  //           onClick={() => setShowChatbot(!showChatbot)}
  //           variant="outline"
  //         >
  //           {showChatbot ? "Hide Assistant" : "Show Assistant"}
  //         </Button>
  //         <Button onClick={() => setIsFormOpen(true)}>
  //           <Plus className="h-4 w-4 mr-2" />
  //           New Task
  //         </Button>
  //       </div>
  //     </div>

  //     <AITaskAssistant
  //       onTaskCreate={async (task: CreateTaskInput) => {
  //         await createMutation.mutateAsync(task);
  //       }}
  //     />

  //     {isFormOpen && (
  //       <div className="bg-white rounded-lg shadow p-6">
  //         <TaskForm
  //           task={selectedTask ?? undefined}
  //           onSubmit={handleSubmit}
  //           onCancel={() => {
  //             setIsFormOpen(false);
  //             setSelectedTask(null);
  //           }}
  //         />
  //       </div>
  //     )}

  //     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  //       {tasks.map((task) => (
  //         <TaskCard
  //           key={task.id}
  //           task={task}
  //           onEdit={handleEdit}
  //           onDelete={handleDelete}
  //           onSummarize={() => handleSummarize(task)} // Pass summarization handler
  //           isSummarizing={summarizingTaskId === task.id} // Indicate summarizing status
  //         />
  //       ))}
  //     </div>

  //     {showChatbot && (
  //       <div className="lg:col-span-1">
  //         <Chatbot
  //           onTaskCreate={async (task: CreateTaskInput) => {
  //             await createMutation.mutateAsync(task);
  //           }}
  //         />
  //       </div>
  //     )}
  //   </div>
  // );

  // return (
  //   <div className="space-y-6">
  //     <div className="flex justify-between items-center">
  //       <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
  //       <div className="flex gap-2">
  //         <Button
  //           onClick={() => setShowChatbot(!showChatbot)}
  //           variant="outline"
  //           className="gap-2"
  //         >
  //           <MessageSquare className="h-4 w-4" />
  //           {showChatbot ? "Hide Assistant" : "Show Assistant"}
  //         </Button>
  //         <Button onClick={() => setIsFormOpen(true)} className="gap-2">
  //           <Plus className="h-4 w-4" />
  //           New Task
  //         </Button>
  //       </div>
  //     </div>

  //     <div className="grid gap-6 lg:grid-cols-3">
  //       <div
  //         className={`space-y-6 ${
  //           showChatbot ? "lg:col-span-2" : "lg:col-span-3"
  //         }`}
  //       >
  //         <AITaskAssistant
  //           onTaskCreate={async (task: CreateTaskInput) => {
  //             await createMutation.mutateAsync(task);
  //           }}
  //         />

  //         {isFormOpen && (
  //           <div className="bg-white rounded-lg shadow-lg p-6">
  //             <TaskForm
  //               task={selectedTask ?? undefined}
  //               onSubmit={handleSubmit}
  //               onCancel={() => {
  //                 setIsFormOpen(false);
  //                 setSelectedTask(null);
  //               }}
  //             />
  //           </div>
  //         )}

  //         <div className="grid gap-4 sm:grid-cols-2">
  //           {tasks.map((task) => (
  //             <TaskCard
  //               key={task.id}
  //               task={task}
  //               onEdit={handleEdit}
  //               onDelete={handleDelete}
  //               onSummarize={() => handleSummarize(task)} // Pass summarization handler
  //               isSummarizing={summarizingTaskId === task.id} // Indicate summarizing status
  //             />
  //           ))}
  //           {tasks.length === 0 && (
  //             <div className="sm:col-span-2 bg-gray-50 rounded-lg p-8 text-center">
  //               <p className="text-gray-600">
  //                 No tasks yet. Create one to get started!
  //               </p>
  //             </div>
  //           )}
  //         </div>
  //       </div>

  //       {showChatbot && (
  //         <div className="lg:col-span-1 relative">
  //           <div className="lg:sticky lg:top-6">
  //             <Chatbot
  //               onTaskCreate={async (task: CreateTaskInput) => {
  //                 await createMutation.mutateAsync(task);
  //               }}
  //             />
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div
        className={`flex-1 overflow-y-auto p-6 transition-all ${
          showChatbot ? "pr-[400px]" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and organize your tasks efficiently
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                <Button
                  variant={filter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className="text-sm"
                >
                  All
                </Button>
                <Button
                  variant={filter === "pending" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("pending")}
                  className="text-sm"
                >
                  Pending
                </Button>
                <Button
                  variant={filter === "in_progress" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("in_progress")}
                  className="text-sm"
                >
                  In Progress
                </Button>
                <Button
                  variant={filter === "completed" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("completed")}
                  className="text-sm"
                >
                  Completed
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setView(view === "grid" ? "list" : "grid")}
                  className="h-9 w-9"
                >
                  {view === "grid" ? (
                    <List className="h-4 w-4" />
                  ) : (
                    <LayoutGrid className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChatbot(!showChatbot)}
                  className="gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  {showChatbot ? "Hide Assistant" : "Show Assistant"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsFormOpen(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Task
                </Button>
              </div>
            </div>
          </div>

          <AITaskAssistant
            onTaskCreate={async (task: CreateTaskInput) => {
              await createMutation.mutateAsync(task);
            }}
          />

          {isFormOpen && (
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
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

          <div
            className={`grid gap-4 ${
              view === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                view={view}
              />
            ))}
            {filteredTasks.length === 0 && (
              <div className="col-span-full bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-600">
                  {filter === "all"
                    ? "No tasks yet. Create one to get started!"
                    : `No ${filter.replace("_", " ")} tasks found.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showChatbot && (
        <div className="fixed right-0 top-16 bottom-0 w-[400px] border-l border-gray-200 bg-white shadow-lg">
          <Chatbot
            onTaskCreate={async (task: CreateTaskInput) => {
              await createMutation.mutateAsync(task);
            }}
          />
        </div>
      )}
    </div>
  );
}
