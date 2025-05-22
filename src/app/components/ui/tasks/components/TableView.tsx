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
import type { z } from "zod";

type Task = z.infer<typeof taskSchema>;

interface TableViewProps {
  tasks: Task[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
}

const TableView = ({ tasks, onTaskUpdate, onTaskDelete }: TableViewProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Cycle through statuses: uncompleted -> in-progress -> completed -> uncompleted
  const cycleStatus = (currentStatus: Task["status"]): Task["status"] => {
    const statusCycle: Record<Task["status"], Task["status"]> = {
      uncompleted: "in-progress",
      "in-progress": "completed",
      completed: "uncompleted",
    };
    return statusCycle[currentStatus] || "uncompleted";
  };

  const handleStatusToggle = (task: Task) => {
    const newStatus = cycleStatus(task.status);
    onTaskUpdate?.(task.id, { status: newStatus });
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const closeSidebar = () => {
    setSelectedTask(null);
  };

  const handleEdit = () => {
    // Implement edit functionality
    console.log("Edit task:", selectedTask?.id);
  };

  const handleDelete = () => {
    if (selectedTask) {
      onTaskDelete?.(selectedTask.id);
      setSelectedTask(null);
    }
  };

  const getCheckboxIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-600" />;
      case "in-progress":
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
            <tr className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
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
                          : task.status === "in-progress"
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

      {/* View Task Sidebar */}
      <AnimatePresence>
        {selectedTask && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold dark:text-white">
                    View Task
                  </h2>
                  <button
                    onClick={closeSidebar}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 dark:text-gray-400" />
                  </button>
                </div>

                {/* Task Details */}
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-gray-900 dark:text-white font-medium">
                        {selectedTask.title}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedTask.description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-gray-900 dark:text-white">
                          {selectedTask.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Status
                    </label>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                          selectedTask.status
                        )}`}
                      >
                        {formatStatusDisplay(selectedTask.status)}
                      </span>
                    </div>
                  </div>

                  {/* Importance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Flag className="inline h-4 w-4 mr-1" />
                      Importance
                    </label>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getImportanceColor(
                          selectedTask.importance
                        )}`}
                      >
                        {formatImportanceDisplay(selectedTask.importance)}
                      </span>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Tag className="inline h-4 w-4 mr-1" />
                      Category
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-gray-900 dark:text-white">
                        {selectedTask.category}
                      </p>
                    </div>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Due Date
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-gray-900 dark:text-white">
                        {selectedTask.dueDate instanceof Date
                          ? selectedTask.dueDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "No due date set"}
                      </p>
                    </div>
                  </div>

                  {/* Creation Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Created
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {selectedTask.created_at instanceof Date
                          ? selectedTask.created_at.toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex gap-3">
                  <motion.button
                    onClick={handleEdit}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Task
                  </motion.button>
                  <motion.button
                    onClick={handleDelete}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Task
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default TableView;
