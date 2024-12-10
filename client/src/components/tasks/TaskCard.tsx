// import { format } from "date-fns";
// import {
//   Pencil,
//   Trash2,
//   Calendar,
//   CheckCircle2,
//   RefreshCcw,
// } from "lucide-react";
// import { Button } from "../ui/Button";
// import type { Task } from "../../types/task";

// interface TaskCardProps {
//   task: Task;
//   onEdit: (task: Task) => void;
//   onDelete: (id: string) => void;
//   onSummarize?: () => void;
//   isSummarizing?: boolean;
//   view?: "grid" | "list";
// }

// const statusColors = {
//   PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
//   IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
//   COMPLETED: "bg-green-100 text-green-800 border-green-200",
// };

// const statusIcons = {
//   PENDING: CheckCircle2,
//   IN_PROGRESS: CheckCircle2,
//   COMPLETED: CheckCircle2,
// };

// export function TaskCard({
//   task,
//   onEdit,
//   onDelete,
//   onSummarize,
//   isSummarizing,
//   view = "grid",
// }: TaskCardProps) {
//   const StatusIcon = statusIcons[task.status];

//   return (
//     <div
//       className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
//         view === "list" ? "p-4" : "p-6"
//       }`}
//     >
//       <div
//         className={view === "list" ? "flex items-center gap-4" : "space-y-4"}
//       >
//         <div
//           className={`flex-1 ${
//             view === "list" ? "flex items-center gap-4" : "space-y-4"
//           }`}
//         >
//           <div className="flex-1">
//             <h3 className="font-medium text-gray-900">{task.title}</h3>
//             {task.description && view === "grid" && (
//               <p className="mt-1 text-sm text-gray-600 line-clamp-2">
//                 {task.description}
//               </p>
//             )}
//           </div>

//           <div
//             className={`flex ${
//               view === "list" ? "items-center gap-4" : "flex-wrap gap-2"
//             }`}
//           >
//             <span
//               className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
//                 statusColors[task.status]
//               }`}
//             >
//               <StatusIcon className="w-3 h-3 mr-1" />
//               {task.status.replace("_", " ")}
//             </span>

//             {task.dueDate && (
//               <span className="inline-flex items-center text-xs text-gray-500">
//                 <Calendar className="w-3 h-3 mr-1" />
//                 {format(new Date(task.dueDate), "MMM d, yyyy")}
//               </span>
//             )}
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
//             <Pencil className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => onDelete(task.id)}
//             className="text-red-600 hover:text-red-700"
//           >
//             <Trash2 className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={onSummarize}
//             disabled={isSummarizing}
//           >
//             {isSummarizing ? (
//               <div className="flex items-center space-x-2">
//                 <RefreshCcw className="animate-spin h-4 w-4" />
//                 <span>Summarizing...</span>
//               </div>
//             ) : (
//               "Summarize"
//             )}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
import { format } from "date-fns";
import { Pencil, Trash2, Calendar, CheckCircle2, EyeIcon } from "lucide-react";
import { Button } from "../ui/Button";
import type { Task } from "../../types/task";
import { useState } from "react";
import { Modal } from "../ui/Modal"; // Assume a Modal component is available

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  view?: "grid" | "list";
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
};

const statusIcons = {
  PENDING: CheckCircle2,
  IN_PROGRESS: CheckCircle2,
  COMPLETED: CheckCircle2,
};

export function TaskCard({
  task,
  onEdit,
  onDelete,
  view = "grid",
}: TaskCardProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  const StatusIcon = statusIcons[task.status];

  return (
    <>
      <div
        className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
          view === "list" ? "p-4" : "p-6"
        }`}
      >
        <div
          className={view === "list" ? "flex items-center gap-4" : "space-y-4"}
        >
          <div
            className={`flex-1 ${
              view === "list" ? "flex items-center gap-4" : "space-y-4"
            }`}
          >
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{task.title}</h3>
              {task.description && view === "grid" && (
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>

            <div
              className={`flex ${
                view === "list" ? "items-center gap-4" : "flex-wrap gap-2"
              }`}
            >
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  statusColors[task.status]
                }`}
              >
                <StatusIcon className="w-3 h-3 mr-1" />
                {task.status.replace("_", " ")}
              </span>

              {task.dueDate && (
                <div className="inline-flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>
                    <strong>Due Date:</strong>{" "}
                    {format(new Date(task.dueDate), "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(true)}
            >
              {/* <EyeIcon className="h-4 w-4" /> */}
              View
            </Button>
          </div>
        </div>
      </div>

      {/* Modal for viewing task details */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <div>
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xl font-semibold text-gray-900">
                {task.title}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="mt-4 space-y-4">
              {/* Description */}
              {task.description && (
                <p className="text-gray-600 text-sm">{task.description}</p>
              )}

              {/* Status and Due Date */}
              <div className="flex flex-col space-y-2">
                {/* Status */}
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                    statusColors[task.status]
                  }`}
                >
                  <StatusIcon className="w-4 h-4 mr-2" />
                  {task.status.replace("_", " ")}
                </span>

                {/* Due Date */}
                {task.dueDate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>
                      <strong className="text-gray-700">Due Date:</strong>{" "}
                      {format(new Date(task.dueDate), "MMM d, yyyy")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="px-4 py-2 text-sm"
                onClick={() => setModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
