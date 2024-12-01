import { useQuery } from '@tanstack/react-query';
import { taskService } from '../services/task';
import { TaskCard } from '../components/tasks/TaskCard';

export default function Dashboard() {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.getTasks,
  });

  const recentTasks = tasks.slice(0, 3);
  const pendingTasks = tasks.filter((task) => task.status === 'PENDING').length;
  const completedTasks = tasks.filter(
    (task) => task.status === 'COMPLETED'
  ).length;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{tasks.length}</p>
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
}