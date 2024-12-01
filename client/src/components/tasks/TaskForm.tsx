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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskInput>({
    defaultValues: task
      ? {
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          status: task.status,
          userId: task.userId,
        }
      : undefined,
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
      <Input type="date" {...register("dueDate")} />
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
