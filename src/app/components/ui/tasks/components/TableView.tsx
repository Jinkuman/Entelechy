// src/components/TableView.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Check,
  X,
  Edit,
  Trash2,
  Calendar,
  Flag,
  Tag,
  Clock,
} from "lucide-react";
import { taskSchema } from "@/app/schemas/taskSchema";
import {
  getImportanceColor,
  getStatusColor,
  formatStatusDisplay,
  formatImportanceDisplay,
} from "../utils/taskUtils";
import EditTaskSidebar from "./editTaskSidebar";
import type { z } from "zod";

type Task = z.infer<typeof taskSchema>;

interface TableViewProps {
  tasks: Task[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskClick?: (task: Task) => void;
}

const TableView = ({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onTaskClick,
}: TableViewProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);

  // Cycle through statuses: uncompleted -> in-progress -> completed -> uncompleted
  const cycleStatus = (currentStatus: Task["status"]): Task["status"] => {
    const statusCycle: Record<Task["status"], Task["status"]> = {
      uncompleted: "in_progress",
      in_progress: "completed",
      completed: "uncompleted",
    };
    return statusCycle[currentStatus] || "uncompleted";
  };

  const handleStatusToggle = (task: Task) => {
    const newStatus = cycleStatus(task.status);
    onTaskUpdate?.(task.id, { status: newStatus });
  };

  const handleTaskClick = (task: Task) => {
    // Call the onTaskClick prop if it exists
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    onTaskUpdate?.(taskId, updates);
  };

  const handleDeleteTask = (taskId: string) => {
    onTaskDelete?.(taskId);
    setIsEditSidebarOpen(false);
  };

  const getCheckboxIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <div className="h-2 w-2 bg-yellow-500 rounded-full" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="overflow-x-auto p-4">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-transparent border-b dark:border-gray-700">
              <th className="py-3 px-4 text-left font-medium text-gray-600 dark:text-gray-300 w-12">
                Status
              </th>
              <th className="py-3 px-4 text-left font-medium text-gray-600 dark:text-gray-300">
                Task
              </th>
              <th className="py-3 px-4 text-left font-medium text-gray-600 dark:text-gray-300">
                Priority
              </th>
              <th className="py-3 px-4 text-left font-medium text-gray-600 dark:text-gray-300">
                Importance
              </th>
              <th className="py-3 px-4 text-left font-medium text-gray-600 dark:text-gray-300">
                Category
              </th>
              <th className="py-3 px-4 text-left font-medium text-gray-600 dark:text-gray-300">
                Due Date
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {tasks.map((task, idx) => (
                <motion.tr
                  key={task.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  exit={{ opacity: 0 }}
                  whileHover={{
                    scale: 1.005,
                  }}
                  onClick={() => handleTaskClick(task)}
                >
                  <td
                    className="py-3 px-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <motion.button
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        task.status === "completed"
                          ? "bg-green-500 border-green-500"
                          : task.status === "in_progress"
                          ? "bg-yellow-500 border-yellow-500"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                      onClick={() => handleStatusToggle(task)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {getCheckboxIcon(task.status)}
                    </motion.button>
                  </td>
                  <td className="py-3 px-4 dark:text-white font-medium">
                    {task.title}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {formatStatusDisplay(task.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${getImportanceColor(
                        task.importance
                      )}`}
                    >
                      {formatImportanceDisplay(task.importance)}
                    </span>
                  </td>
                  <td className="py-3 px-4 dark:text-white">{task.category}</td>
                  <td className="py-3 px-4 dark:text-gray-300">
                    {task.dueDate instanceof Date
                      ? task.dueDate.toLocaleDateString()
                      : "No date"}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Use the EditTaskSidebar component */}
      <EditTaskSidebar
        isOpen={isEditSidebarOpen}
        onClose={() => setIsEditSidebarOpen(false)}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        task={selectedTask}
      />
    </>
  );
};

export default TableView;
