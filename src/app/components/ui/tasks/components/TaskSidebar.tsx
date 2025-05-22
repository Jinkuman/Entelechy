// src/components/AddTaskSidebar.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Tag } from "lucide-react";
import { taskSchema } from "@/app/schemas/taskSchema";
import type { z } from "zod";

type Task = z.infer<typeof taskSchema>;
type TaskStatus = Task["status"];
type TaskImportance = Task["importance"];

interface AddTaskSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (
    task: Omit<Task, "id" | "created_at" | "updated_at" | "user_id">
  ) => void;
}

const AddTaskSidebar = ({
  isOpen,
  onClose,
  onAddTask,
}: AddTaskSidebarProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("uncompleted");
  const [importance, setImportance] = useState<TaskImportance>("medium");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = () => {
    onAddTask({
      title,
      description,
      status,
      importance,
      category,
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setStatus("uncompleted");
    setImportance("medium");
    setCategory("");
    setDueDate("");

    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
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
                Add New Task
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
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Task Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Task Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter task title"
                />
              </div>

              {/* Status Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="uncompleted">Uncompleted</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Importance */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Importance
                </label>
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
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
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
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Due Date
                </label>
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
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  rows={4}
                  placeholder="Add task description"
                ></textarea>
              </div>
            </motion.div>

            {/* Submit Button */}
            <div className="mt-auto pt-6">
              <motion.button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Create Task
              </motion.button>
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

export default AddTaskSidebar;
