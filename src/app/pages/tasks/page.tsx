"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Filter,
  Search,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import KanbanView from "../../components/ui/tasks/components/KanbanView";
import TableView from "../../components/ui/tasks/components/TableView";
import AddTaskSidebar from "../../components/ui/tasks/components/TaskSidebar";
import EditTaskSidebar from "@/app/components/ui/tasks/components/editTaskSidebar";
import { taskSchema } from "@/app/schemas/taskSchema";
import supabase from "@/lib/supabaseClient";
import { tasksToasts } from "@/app/components/ui/toast-utils";
import type { z } from "zod";
import { FilterOptions } from "@/app/components/ui/tasks/components/TaskFilter";
import TaskFilter from "@/app/components/ui/tasks/components/TaskFilter";
import { useMemo } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

// Add a utility function for error handling
const handleSupabaseError = (error: any): string => {
  console.error("Supabase error:", error);

  if (error?.code && error?.message) {
    switch (error.code) {
      case "23505":
        return "A task with this information already exists.";
      case "23503":
        return "Referenced record doesn't exist.";
      case "23502":
        const column =
          error.message.match(/column "([^"]+)"/)?.[1] || "A required field";
        return `${column} cannot be empty.`;
      case "42P01":
        return "Database configuration error: Table not found.";
      case "42703":
        return "Database configuration error: Column not found.";
      case "PGRST116":
        return "You don't have permission to perform this action.";
      case "P0001":
        return error.message || "Database constraint violation.";
      default:
        if (error.message) {
          return `Database error: ${error.message}`;
        }
        return `Database error (${error.code})`;
    }
  }

  if (error instanceof TypeError && error.message.includes("fetch")) {
    return "Network error: Unable to connect to the database.";
  }

  if (error?.message?.includes("auth")) {
    return "Authentication error: Please sign in again.";
  }

  if (error?.name === "ValidationError" || error?.name === "ZodError") {
    return `Validation error: ${error.message}`;
  }

  return error?.message || "An unexpected error occurred.";
};

type Task = z.infer<typeof taskSchema>;

const TasksPage = () => {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [addSidebarOpen, setAddSidebarOpen] = useState(false);
  const [editSidebarOpen, setEditSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quickSearch, setQuickSearch] = useState("");

  // Check for URL parameters to open sidebar
  useEffect(() => {
    const openParam = searchParams.get("open");
    if (openParam === "add-task") {
      setAddSidebarOpen(true);
    }
  }, [searchParams]);

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    importance: [],
    status: [],
  });

  // Combine quick search with filters
  const combinedSearch = quickSearch || filters.search;

  // Filter tasks based on current filters and quick search
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search filter (quick search takes priority)
      if (combinedSearch) {
        const searchLower = combinedSearch.toLowerCase();
        const matchesSearch =
          task.title.toLowerCase().includes(searchLower) ||
          (task.description &&
            task.description.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Importance filter
      if (filters.importance.length > 0) {
        if (!filters.importance.includes(task.importance)) return false;
      }

      // Status filter
      if (filters.status.length > 0) {
        if (!filters.status.includes(task.status)) return false;
      }

      return true;
    });
  }, [tasks, filters, combinedSearch]);

  // Group filtered tasks by status for Kanban view
  const tasksByStatus: Record<string, Task[]> = {
    uncompleted: filteredTasks.filter((task) => task.status === "uncompleted"),
    in_progress: filteredTasks.filter((task) => task.status === "in_progress"),
    completed: filteredTasks.filter((task) => task.status === "completed"),
  };

  // Check if any filters are active
  const hasActiveFilters =
    combinedSearch ||
    filters.importance.length > 0 ||
    filters.status.length > 0;

  // Task statistics
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const overdue = tasks.filter(
      (t) =>
        t.dueDate &&
        new Date(t.dueDate) < new Date() &&
        t.status !== "completed"
    ).length;

    return { total, completed, inProgress, overdue };
  }, [tasks]);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle drag and drop in Kanban view
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const taskId = result.draggableId;

    if (source.droppableId !== destination.droppableId) {
      const statusMapping: Record<string, string> = {
        uncompleted: "uncompleted",
        in_progress: "in_progress",
        completed: "completed",
      };

      const newStatus = statusMapping[destination.droppableId];
      const movedTask = tasks.find((task) => task.id === taskId);
      const taskTitle = movedTask?.title || "Task";

      // Optimistically update UI
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: newStatus as Task["status"],
                updated_at: new Date(),
              }
            : task
        )
      );

      // Update in Supabase
      try {
        const { error } = await supabase
          .from("tasks")
          .update({
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq("id", taskId);

        if (error) {
          console.error("Supabase update error:", error);
          throw error;
        }
      } catch (err) {
        console.error("Error updating task status:", err);
        tasksToasts.taskError("update status", handleSupabaseError(err));
        fetchTasks();
      }
    }
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setQuickSearch(""); // Clear quick search when applying filters
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      importance: [],
      status: [],
    });
    setQuickSearch("");
  };

  const toggleFilterSidebar = () => {
    setFilterOpen(!filterOpen);
  };

  const toggleAddSidebar = () => {
    setAddSidebarOpen(!addSidebarOpen);
  };

  const handleAddTask = async (
    newTaskData: Omit<Task, "id" | "created_at" | "updated_at" | "user_id">
  ) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw {
          message: "Failed to get current user",
          details: userError.message,
          code: "AUTH_ERROR",
        };
      }

      if (!user) {
        throw {
          message: "You must be logged in to add tasks",
          code: "NO_USER",
        };
      }

      try {
        const partialTaskSchema = taskSchema.omit({
          id: true,
          user_id: true,
          created_at: true,
          updated_at: true,
        });
        partialTaskSchema.parse(newTaskData);
      } catch (validationError) {
        throw {
          message: "Task data validation failed",
          details: validationError,
          code: "VALIDATION_ERROR",
        };
      }

      const now = new Date().toISOString();

      const taskToInsert = {
        user_id: user.id,
        title: newTaskData.title,
        description: newTaskData.description || "",
        status: newTaskData.status,
        importance: newTaskData.importance,
        category: newTaskData.category || "",
        due_date: newTaskData.dueDate
          ? newTaskData.dueDate.toISOString()
          : null,
        created_at: now,
        updated_at: now,
      };

      const { data, error: insertError } = await supabase
        .from("tasks")
        .insert(taskToInsert)
        .select();

      if (insertError) {
        throw insertError;
      }

      if (!data || data.length === 0) {
        throw {
          message: "Task was created but no data was returned",
          code: "NO_DATA_RETURNED",
        };
      }

      fetchTasks();
      tasksToasts.taskCreated(newTaskData.title);
      return true;
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      tasksToasts.taskError("create", errorMessage);
      return false;
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      if (!taskId || typeof taskId !== "string") {
        throw {
          message: "Invalid task ID",
          code: "INVALID_ID",
        };
      }

      const taskToUpdate = tasks.find((task) => task.id === taskId);
      const taskTitle = taskToUpdate?.title || "Task";

      const hasChanges = Object.keys(updates).some((key) => {
        if (key === "dueDate") {
          const currentDueDate = taskToUpdate?.dueDate;
          const newDueDate = updates.dueDate;

          if (!currentDueDate && !newDueDate) return false;
          if (!currentDueDate && newDueDate) return true;
          if (currentDueDate && !newDueDate) return true;

          return currentDueDate?.getTime() !== newDueDate?.getTime();
        }

        return taskToUpdate?.[key as keyof Task] !== updates[key as keyof Task];
      });

      if (!hasChanges) {
        return true;
      }

      // Optimistically update UI
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                ...updates,
                updated_at: new Date(),
              }
            : task
        )
      );

      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
        ...(updates.dueDate !== undefined && {
          due_date: updates.dueDate ? updates.dueDate.toISOString() : null,
        }),
      };

      if ("dueDate" in updateData) {
        delete updateData.dueDate;
      }

      const { error: updateError } = await supabase
        .from("tasks")
        .update(updateData)
        .eq("id", taskId);

      if (updateError) {
        throw updateError;
      }

      tasksToasts.taskUpdated(taskTitle);
      return true;
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      tasksToasts.taskError("update", errorMessage);
      fetchTasks();
      return false;
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const taskToDelete = tasks.find((task) => task.id === taskId);
      const taskTitle = taskToDelete?.title || "Task";

      const { error } = await supabase.from("tasks").delete().eq("id", taskId);

      if (error) {
        throw error;
      }

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      tasksToasts.taskDeleted(taskTitle);
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      tasksToasts.taskError("delete", errorMessage);
    }
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw {
          message: "Failed to get current user",
          details: userError.message,
          code: "AUTH_ERROR",
        };
      }

      if (!user) {
        throw {
          message: "You must be logged in to view tasks",
          code: "NO_USER",
        };
      }

      const { data, error: fetchError } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      if (!data) {
        throw {
          message: "No data returned from the database",
          code: "NO_DATA",
        };
      }

      try {
        const parsedTasks = data.map((task) => {
          return {
            ...task,
            created_at: new Date(task.created_at),
            updated_at: new Date(task.updated_at),
            dueDate: task.due_date ? new Date(task.due_date) : null,
          };
        });

        setTasks(parsedTasks);
      } catch (parseError) {
        throw {
          message: "Failed to parse task data",
          details: parseError,
          code: "PARSE_ERROR",
        };
      }
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      tasksToasts.taskError("fetch", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setEditSidebarOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              Tasks
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Manage and track your tasks efficiently
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
              <Input
                placeholder="Quick search..."
                value={quickSearch}
                onChange={(e: any) => setQuickSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {/* Filter Button */}
            <Button
              variant={hasActiveFilters ? "default" : "outline"}
              onClick={toggleFilterSidebar}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter
              {hasActiveFilters && (
                <span className="ml-1 bg-white/20 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {(combinedSearch ? 1 : 0) +
                    filters.importance.length +
                    filters.status.length}
                </span>
              )}
            </Button>

            <motion.button
              className="cursor-pointer rounded-full p-3 bg-blue-600 text-white shadow-lg"
              onClick={toggleAddSidebar}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Plus size={24} />
            </motion.button>
          </div>
        </div>

        {/* Task Statistics */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 bg-zinc-500 rounded-full"></div>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Total
              </span>
            </div>
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">
              {taskStats.total}
            </span>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Completed
              </span>
            </div>
            <span className="text-2xl font-bold text-green-600">
              {taskStats.completed}
            </span>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                In Progress
              </span>
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {taskStats.inProgress}
            </span>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Overdue
              </span>
            </div>
            <span className="text-2xl font-bold text-red-600">
              {taskStats.overdue}
            </span>
          </div>
        </motion.div>

        {/* Active Filters Display */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              className="flex items-center gap-2 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Showing {filteredTasks.length} of {tasks.length} tasks
              </span>
              {combinedSearch && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs rounded">
                  Search: "{combinedSearch}"
                </span>
              )}
              {filters.importance.length > 0 && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs rounded">
                  Importance: {filters.importance.join(", ")}
                </span>
              )}
              {filters.status.length > 0 && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs rounded">
                  Status: {filters.status.join(", ")}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="ml-auto text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Clear all
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Toggle */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="text-sm text-zinc-600 dark:text-zinc-400 mr-2">
            View:
          </span>
          <div className="flex border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "kanban"
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                  : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
              }`}
              onClick={() => setViewMode("kanban")}
            >
              Kanban
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                  : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
              }`}
              onClick={() => setViewMode("table")}
            >
              Table
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          className="flex justify-center items-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="text-zinc-600 dark:text-zinc-400">
              Loading tasks...
            </span>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <motion.div
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <strong className="font-medium">Error:</strong>
            <span>{error}</span>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && !error && tasks.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-zinc-400 mb-4">
            <Calendar className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-600 dark:text-zinc-400 mb-2">
              No tasks yet
            </h3>
            <p className="text-zinc-500 dark:text-zinc-500 mb-6">
              Get started by creating your first task
            </p>
            <Button onClick={toggleAddSidebar} className="gap-2">
              <Plus className="h-4 w-4" />
              Create your first task
            </Button>
          </div>
        </motion.div>
      )}

      {/* No Results State */}
      {!isLoading &&
        !error &&
        hasActiveFilters &&
        filteredTasks.length === 0 &&
        tasks.length > 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              width: filterOpen ? "calc(100% - 33.333%)" : "100%",
              transition: "width 0.3s ease-in-out",
            }}
          >
            <div className="text-zinc-400 mb-4">
              <Search className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                No tasks match your filters
              </h3>
              <p className="text-zinc-500 dark:text-zinc-500 mb-6">
                Try adjusting your search criteria or filters
              </p>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear all filters
              </Button>
            </div>
          </motion.div>
        )}

      {/* Main Content */}
      {!isLoading &&
        !error &&
        (hasActiveFilters ? filteredTasks.length > 0 : tasks.length > 0) && (
          <motion.div
            className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              width:
                addSidebarOpen || editSidebarOpen || filterOpen
                  ? "calc(100% - 33.333%)"
                  : "100%",
              transition: "width 0.3s ease-in-out",
            }}
          >
            {viewMode === "kanban" ? (
              <KanbanView
                tasksByStatus={tasksByStatus}
                handleDragEnd={handleDragEnd}
                onTaskClick={handleTaskClick}
              />
            ) : (
              <TableView
                tasks={filteredTasks}
                onTaskUpdate={handleUpdateTask}
                onTaskDelete={handleDeleteTask}
                onTaskClick={handleTaskClick}
              />
            )}
          </motion.div>
        )}

      {/* Sidebars */}
      <AddTaskSidebar
        isOpen={addSidebarOpen}
        onClose={toggleAddSidebar}
        onAddTask={handleAddTask}
      />

      <EditTaskSidebar
        isOpen={editSidebarOpen}
        onClose={() => setEditSidebarOpen(false)}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        task={selectedTask}
      />

      <TaskFilter
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </div>
  );
};

export default TasksPage;
