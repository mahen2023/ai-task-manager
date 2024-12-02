import { format } from "date-fns";
import { Pencil, Trash2, RefreshCcw } from "lucide-react";
import { Button } from "../ui/Button";
import type { Task } from "../../types/task";

export interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => Promise<void>;
  onSummarize: () => Promise<void>;
  isSummarizing: boolean;
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
};

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onSummarize,
  isSummarizing,
}: TaskCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {task.description && (
        <p className="text-sm text-gray-600">{task.description}</p>
      )}
      <div className="flex justify-between items-center">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusColors[task.status]
          }`}
        >
          {task.status.replace("_", " ")}
        </span>
        {task.dueDate && (
          <span className="text-sm text-gray-500">
            Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
          </span>
        )}
      </div>
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onSummarize}
          disabled={isSummarizing}
        >
          {isSummarizing ? (
            <div className="flex items-center space-x-2">
              <RefreshCcw className="animate-spin h-4 w-4" />
              <span>Summarizing...</span>
            </div>
          ) : (
            "Summarize"
          )}
        </Button>
      </div>
    </div>
  );
}
