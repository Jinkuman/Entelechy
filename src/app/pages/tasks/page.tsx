// pages/tasks/page.tsx
"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Filter,
  X,
  Calendar,
  Clock,
  Tag,
  AlertCircle,
} from "lucide-react";

const TasksPage = () => {
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock tasks data (assignee field still present but not used in UI)
  const [tasks, setTasks] = useState<
    {
      id: string;
      title: string;
      status: "uncompleted" | "in-progress" | "completed";
      importance: "low" | "medium" | "high";
      category: string;
      dueDate: string;
    }[]
  >([
    {
      id: "task-1",
      title: "Update dashboard UI design",
      status: "uncompleted",
      importance: "high",
      category: "Website Redesign",
      dueDate: "Apr 19, 2025",
    },
    {
      id: "task-2",
      title: "Review analytics report",
      status: "in-progress",
      importance: "medium",
      category: "Marketing",
      dueDate: "Apr 19, 2025",
    },
    {
      id: "task-3",
      title: "Send invoice to client",
      status: "in-progress",
      importance: "low",
      category: "Finance",
      dueDate: "Apr 20, 2025",
    },
    {
      id: "task-4",
      title: "Prepare project presentation",
      status: "completed",
      importance: "high",
      category: "Client Work",
      dueDate: "Apr 18, 2025",
    },
    {
      id: "task-5",
      title: "Research new product features",
      status: "uncompleted",
      importance: "medium",
      category: "Product Development",
      dueDate: "Apr 22, 2025",
    },
    {
      id: "task-6",
      title: "Fix navigation menu bug",
      status: "completed",
      importance: "high",
      category: "Website Redesign",
      dueDate: "Apr 17, 2025",
    },
    {
      id: "task-7",
      title: "Conduct user testing",
      status: "uncompleted",
      importance: "medium",
      category: "UX Research",
      dueDate: "Apr 24, 2025",
    },
    {
      id: "task-8",
      title: "Design marketing materials",
      status: "in-progress",
      importance: "low",
      category: "Marketing",
      dueDate: "Apr 21, 2025",
    },
  ]);

  // Group tasks by status for Kanban view
  const tasksByStatus: Record<string, typeof tasks> = {
    uncompleted: tasks.filter((task) => task.status === "uncompleted"),
    "in-progress": tasks.filter((task) => task.status === "in-progress"),
    completed: tasks.filter((task) => task.status === "completed"),
  };

  // Handle drag and drop
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const taskId = result.draggableId;
    if (source.droppableId !== destination.droppableId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, status: destination.droppableId }
            : task
        )
      );
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getImportanceDisplay = (importance: string) =>
    importance.charAt(0).toUpperCase() + importance.slice(1);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      {/* Header and view toggle */}
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Tasks
        </motion.h1>
        <div className="flex items-center gap-4">
          {/* Filter Button */}
          <motion.button
            className="flex items-center gap-2 px-4 py-2 border rounded bg-white shadow-sm hover:bg-gray-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter size={16} />
            <span>Filter</span>
          </motion.button>

          {/* View Toggle */}
          <motion.div
            className="flex border rounded overflow-hidden shadow-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              className={`px-4 py-2 ${
                viewMode === "table" ? "bg-gray-100" : "bg-white"
              }`}
              onClick={() => setViewMode("table")}
            >
              <span className="flex items-center gap-2">
                {/* Table icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="3" y1="15" x2="21" y2="15" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                  <line x1="15" y1="3" x2="15" y2="21" />
                </svg>
                Table view
              </span>
            </button>
            <button
              className={`px-4 py-2 ${
                viewMode === "kanban" ? "bg-gray-100" : "bg-white"
              }`}
              onClick={() => setViewMode("kanban")}
            >
              <span className="flex items-center gap-2">
                {/* Kanban icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="5" height="18" rx="1" />
                  <rect x="10" y="3" width="5" height="18" rx="1" />
                  <rect x="17" y="3" width="5" height="18" rx="1" />
                </svg>
                Kanban board
              </span>
            </button>
          </motion.div>

          <motion.button
            className="cursor-pointer rounded-full p-3 bg-blue-600 text-white shadow-lg"
            onClick={toggleSidebar}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Plus size={24} />
          </motion.button>
        </div>
      </div>

      {/* Kanban / Table */}
      <motion.div
        className="bg-white border rounded-lg shadow-sm dark:bg-gray-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          width: sidebarOpen ? "calc(100% - 33.333%)" : "100%",
          transition: "width 0.3s ease-in-out",
        }}
      >
        {viewMode === "kanban" ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 p-4">
              {(["uncompleted", "in-progress", "completed"] as const).map(
                (statusKey, idx) => (
                  <motion.div
                    key={statusKey}
                    className="flex-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * idx }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">
                        {statusKey === "uncompleted"
                          ? "Uncompleted"
                          : statusKey === "in-progress"
                          ? "In Progress"
                          : "Completed"}
                      </h3>
                      <motion.span
                        className="bg-gray-200 rounded-full px-2 py-0.5 text-sm"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {tasksByStatus[statusKey].length}
                      </motion.span>
                    </div>
                    <Droppable droppableId={statusKey}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="bg-gray-50 min-h-[24rem] rounded p-2"
                        >
                          <AnimatePresence>
                            {tasksByStatus[statusKey].map((task, index) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-white p-4 rounded mb-2 shadow-sm border hover:shadow-md transition-shadow duration-200"
                                    style={{
                                      ...provided.draggableProps.style,
                                      transition:
                                        "transform 0.2s, box-shadow 0.2s",
                                    }}
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-medium">
                                        {task.title}
                                      </h4>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span
                                        className={`text-xs px-2 py-1 rounded ${getImportanceColor(
                                          task.importance
                                        )}`}
                                      >
                                        {getImportanceDisplay(task.importance)}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {task.dueDate}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </AnimatePresence>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </motion.div>
                )
              )}
            </div>
          </DragDropContext>
        ) : (
          <div className="overflow-x-auto p-4">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-3 px-4 text-left font-medium text-gray-600">
                    Task
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">
                    Importance
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">
                    Category
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {tasks.map((task, idx) => (
                    <motion.tr
                      key={task.id}
                      className="border-b hover:bg-gray-50"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      exit={{ opacity: 0 }}
                      whileHover={{
                        backgroundColor: "rgba(243, 244, 246, 0.5)",
                      }}
                    >
                      <td className="py-3 px-4">{task.title}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            task.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : task.status === "in-progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {task.status === "in-progress"
                            ? "In Progress"
                            : task.status.charAt(0).toUpperCase() +
                              task.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${getImportanceColor(
                            task.importance
                          )}`}
                        >
                          {getImportanceDisplay(task.importance)}
                        </span>
                      </td>
                      <td className="py-3 px-4">{task.category}</td>
                      <td className="py-3 px-4">{task.dueDate}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Sidebar for adding tasks */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed top-0 right-0 h-full w-1/3 bg-white shadow-xl border-l p-6 z-40 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-between items-center mb-6">
              <motion.h2
                className="text-xl font-semibold"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Add New Task
              </motion.h2>
              <motion.button
                onClick={toggleSidebar}
                className="p-2 rounded-full hover:bg-gray-100"
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(243, 244, 246, 1)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={20} />
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
                <label className="block text-sm font-medium text-gray-700">
                  Task Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title"
                />
              </div>

              {/* Status Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="uncompleted">Uncompleted</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Importance */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Importance
                </label>
                <div className="flex gap-3">
                  <motion.button
                    className="flex-1 py-2 border rounded-md bg-green-100 text-green-800"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Low
                  </motion.button>
                  <motion.button
                    className="flex-1 py-2 border rounded-md bg-yellow-100 text-yellow-800"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Medium
                  </motion.button>
                  <motion.button
                    className="flex-1 py-2 border rounded-md bg-red-100 text-red-800"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    High
                  </motion.button>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter category"
                  />
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Add task description"
                ></textarea>
              </div>
            </motion.div>

            {/* Submit Button */}
            <div className="mt-auto pt-6">
              <motion.button
                className="w-full bg-blue-600 text-white py-3 rounded-md font-medium"
                whileHover={{ scale: 1.03, backgroundColor: "#2563EB" }}
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
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TasksPage;
