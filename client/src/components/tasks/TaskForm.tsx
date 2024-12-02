import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import type { CreateTaskInput, Task } from "../../types/task";

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskInput) => Promise<void>;
  onCancel: () => void;
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const todayDate = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

  const formatDate = (date: string | Date) => {
    if (!date) return todayDate; // Default to today if no date
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split("T")[0]; // Convert to 'YYYY-MM-DD'
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskInput>({
    defaultValues: task
      ? {
          title: task.title,
          description: task.description,
          dueDate: formatDate(task.dueDate ?? todayDate), // Format `dueDate` for the date input
          status: task.status,
          userId: task.userId,
        }
      : {
          dueDate: todayDate, // Use today's date for create mode
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        placeholder="Task title"
        error={errors.title?.message}
        {...register("title", { required: "Title is required" })}
      />
      <textarea
        className="w-full rounded-md border border-gray-300 p-2 text-sm"
        placeholder="Description (optional)"
        rows={3}
        {...register("description")}
      />
      <Input
        type="date"
        error={errors.dueDate?.message}
        {...register("dueDate", { required: "Due date is required" })}
      />
      <select
        className="w-full rounded-md border border-gray-300 p-2 text-sm"
        {...register("status")}
      >
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
