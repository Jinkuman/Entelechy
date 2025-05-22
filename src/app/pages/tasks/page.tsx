// pages/tasks/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Filter } from "lucide-react";
import KanbanView from "../../components/ui/tasks/components/KanbanView";
import TableView from "../../components/ui/tasks/components/TableView";
import AddTaskSidebar from "../../components/ui/tasks/components/TaskSidebar";
import { taskSchema } from "@/app/schemas/taskSchema";
import type { z } from "zod";

type Task = z.infer<typeof taskSchema>;

// Mock tasks data
const initialTasks: Task[] = [
  {
    id: "task-1",
    user_id: "user-1",
    title: "Update dashboard UI design",
    description: "",
    status: "uncompleted",
    importance: "high",
    category: "Website Redesign",
    dueDate: new Date("2025-04-19"),
    created_at: new Date(),
    updated_at: new Date(),
  },
  // Add the rest of your mock tasks here with the correct schema
  // ...
];

const TasksPage = () => {
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Group tasks by status for Kanban view
  const tasksByStatus: Record<string, Task[]> = {
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
            ? { ...task, status: destination.droppableId as Task["status"] }
            : task
        )
      );
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAddTask = (
    newTaskData: Omit<Task, "id" | "created_at" | "updated_at" | "user_id">
  ) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      user_id: "user-1", // Mock user ID
      created_at: new Date(),
      updated_at: new Date(),
      ...newTaskData,
    };

    setTasks((prev) => [...prev, newTask]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative transition-colors duration-300">
      {/* Header and view toggle */}
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          className="text-2xl font-bold dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Tasks
        </motion.h1>
        <div className="flex items-center gap-4">
          {/* Filter Button */}
          <motion.button
            className="flex items-center gap-2 px-4 py-2 border rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter size={16} />
            <span>Filter</span>
          </motion.button>

          {/* View Toggle */}
          <motion.div
            className="flex border rounded overflow-hidden shadow-sm dark:border-gray-700"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              className={`px-4 py-2 ${
                viewMode === "table"
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "bg-white dark:bg-gray-800"
              } dark:text-white`}
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
                viewMode === "kanban"
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "bg-white dark:bg-gray-800"
              } dark:text-white`}
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
        className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          width: sidebarOpen ? "calc(100% - 33.333%)" : "100%",
          transition: "width 0.3s ease-in-out",
        }}
      >
        {viewMode === "kanban" ? (
          <KanbanView
            tasksByStatus={tasksByStatus}
            handleDragEnd={handleDragEnd}
          />
        ) : (
          <TableView tasks={tasks} />
        )}
      </motion.div>

      {/* Add Task Sidebar */}
      <AddTaskSidebar
        isOpen={sidebarOpen}
        onClose={toggleSidebar}
        onAddTask={handleAddTask}
      />
    </div>
  );
};

export default TasksPage;
