// src/components/EditTaskSidebar.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Tag } from "lucide-react";
import { taskSchema } from "@/app/schemas/taskSchema";
import type { z } from "zod";

type Task = z.infer<typeof taskSchema>;
type TaskStatus = Task["status"];
type TaskImportance = Task["importance"];

interface EditTaskSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  task: Task | null;
}

const EditTaskSidebar = ({
  isOpen,
  onClose,
  onUpdateTask,
  onDeleteTask,
  task,
}: EditTaskSidebarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("uncompleted");
  const [importance, setImportance] = useState<TaskImportance>("medium");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
      setImportance(task.importance);
      setCategory(task.category || "");
      setDueDate(
        task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
      );
    }
  }, [task]);

  const handleSave = () => {
    if (task) {
      onUpdateTask(task.id, {
        title,
        description,
        status,
        importance,
        category,
        dueDate: dueDate ? new Date(dueDate) : null,
      });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (task) {
      onDeleteTask(task.id);
      onClose();
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (task) {
      // Reset form to original values
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
      setImportance(task.importance);
      setCategory(task.category || "");
      setDueDate(
        task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
      );
      setIsEditing(false);
    }
  };

  const getImportanceColor = (imp: TaskImportance) => {
    switch (imp) {
      case "low":
        return "text-green-600 dark:text-green-400";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400";
      case "high":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusColor = (stat: TaskStatus) => {
    switch (stat) {
      case "completed":
        return "text-green-600 dark:text-green-400";
      case "in_progress":
        return "text-blue-600 dark:text-blue-400";
      case "uncompleted":
        return "text-gray-600 dark:text-gray-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && task && (
          <motion.div
            className="fixed top-0 right-0 h-full w-1/3 bg-white dark:bg-gray-800 shadow-xl border-l dark:border-gray-700 p-6 z-40 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-between items-center mb-6">
              <motion.h2
                className="text-xl font-semibold dark:text-white"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {isEditing ? "Edit Task" : "Task Details"}
              </motion.h2>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                whileHover={{
                  scale: 1.1,
                }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={20} className="dark:text-white" />
              </motion.button>
            </div>

            <motion.div
              className="space-y-6 flex-1 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Task Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Task Title
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter task title"
                  />
                ) : (
                  <div className="text-lg font-medium dark:text-white">
                    {title}
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                {isEditing ? (
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="uncompleted">Uncompleted</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                ) : (
                  <div className={`font-medium ${getStatusColor(status)}`}>
                    {status === "in_progress"
                      ? "In Progress"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                )}
              </div>

              {/* Importance */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Importance
                </label>
                {isEditing ? (
                  <div className="flex gap-3">
                    <motion.button
                      className={`flex-1 py-2 border rounded-md ${
                        importance === "low"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-white dark:bg-gray-700 dark:text-white"
                      }`}
                      onClick={() => setImportance("low")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Low
                    </motion.button>
                    <motion.button
                      className={`flex-1 py-2 border rounded-md ${
                        importance === "medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          : "bg-white dark:bg-gray-700 dark:text-white"
                      }`}
                      onClick={() => setImportance("medium")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Medium
                    </motion.button>
                    <motion.button
                      className={`flex-1 py-2 border rounded-md ${
                        importance === "high"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          : "bg-white dark:bg-gray-700 dark:text-white"
                      }`}
                      onClick={() => setImportance("high")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      High
                    </motion.button>
                  </div>
                ) : (
                  <div
                    className={`font-medium ${getImportanceColor(importance)}`}
                  >
                    {importance.charAt(0).toUpperCase() + importance.slice(1)}
                  </div>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                {isEditing ? (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-10 px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter category"
                    />
                  </div>
                ) : (
                  <div className="flex items-center dark:text-white">
                    {category ? (
                      <>
                        <Tag size={16} className="mr-2 text-gray-500" />
                        {category}
                      </>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        No category
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Due Date
                </label>
                {isEditing ? (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full pl-10 px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                ) : (
                  <div className="flex items-center dark:text-white">
                    {dueDate ? (
                      <>
                        <Calendar size={16} className="mr-2 text-gray-500" />
                        {new Date(dueDate).toLocaleDateString()}
                      </>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        No due date
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                {isEditing ? (
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    rows={4}
                    placeholder="Add task description"
                  ></textarea>
                ) : (
                  <div className="dark:text-white whitespace-pre-wrap">
                    {description || (
                      <span className="text-gray-500 dark:text-gray-400">
                        No description
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-between">
              {isEditing ? (
                <>
                  <motion.button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-800"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Save
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-800"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Delete
                  </motion.button>
                  <motion.button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Edit
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay when sidebar is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default EditTaskSidebar;
