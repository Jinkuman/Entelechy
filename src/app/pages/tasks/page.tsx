// pages/tasks/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Filter } from "lucide-react";
import KanbanView from "../../components/ui/tasks/components/KanbanView";
import TableView from "../../components/ui/tasks/components/TableView";
import AddTaskSidebar from "../../components/ui/tasks/components/TaskSidebar";
import EditTaskSidebar from "@/app/components/ui/tasks/components/editTaskSidebar";
import { taskSchema } from "@/app/schemas/taskSchema";
import supabase from "@/lib/supabaseClient";
import { showCalendarToast } from "@/app/components/ui/calendar/components/CalendarToast";
import { showTaskToast } from "@/app/components/ui/tasks/components/TaskToast";
import type { z } from "zod";
import { FilterOptions } from "@/app/components/ui/tasks/components/TaskFilter";
import TaskFilter from "@/app/components/ui/tasks/components/TaskFilter";
import { useMemo } from "react";

// Add a utility function for error handling
const handleSupabaseError = (error: any): string => {
  console.error("Supabase error:", error);

  // Check if it's a Supabase error object
  if (error?.code && error?.message) {
    // Handle specific error codes
    switch (error.code) {
      case "23505": // Unique violation
        return "A task with this information already exists.";
      case "23503": // Foreign key violation
        return "Referenced record doesn't exist.";
      case "23502": // Not null violation
        const column =
          error.message.match(/column "([^"]+)"/)?.[1] || "A required field";
        return `${column} cannot be empty.`;
      case "42P01": // Undefined table
        return "Database configuration error: Table not found.";
      case "42703": // Undefined column
        return "Database configuration error: Column not found.";
      case "PGRST116": // Row level security violation
        return "You don't have permission to perform this action.";
      case "P0001": // Raised exception
        return error.message || "Database constraint violation.";
      default:
        if (error.message) {
          return `Database error: ${error.message}`;
        }
        return `Database error (${error.code})`;
    }
  }

  // Handle network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return "Network error: Unable to connect to the database.";
  }

  // Handle authentication errors
  if (error?.message?.includes("auth")) {
    return "Authentication error: Please sign in again.";
  }

  // Handle validation errors
  if (error?.name === "ValidationError" || error?.name === "ZodError") {
    return `Validation error: ${error.message}`;
  }

  // Generic error fallback
  return error?.message || "An unexpected error occurred.";
};

type Task = z.infer<typeof taskSchema>;

const TasksPage = () => {
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [addSidebarOpen, setAddSidebarOpen] = useState(false);
  const [editSidebarOpen, setEditSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    importance: [],
    status: [],
  });

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
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
  }, [tasks, filters]);

  // Group filtered tasks by status for Kanban view
  const tasksByStatus: Record<string, Task[]> = {
    uncompleted: filteredTasks.filter((task) => task.status === "uncompleted"),
    in_progress: filteredTasks.filter((task) => task.status === "in_progress"),
    completed: filteredTasks.filter((task) => task.status === "completed"),
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.search ||
    filters.importance.length > 0 ||
    filters.status.length > 0;

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle drag and drop in Kanban view
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const taskId = result.draggableId;

    if (source.droppableId !== destination.droppableId) {
      // Map the droppableId to the correct status value for the database
      const statusMapping: Record<string, string> = {
        uncompleted: "uncompleted",
        in_progress: "in_progress",
        completed: "completed",
      };

      // Get the correct status value for the database
      const newStatus = statusMapping[destination.droppableId];

      // Get a user-friendly status name for the toast message
      const statusDisplayName = {
        uncompleted: "Uncompleted",
        in_progress: "In Progress",
        completed: "Completed",
      }[newStatus];

      console.log(
        `Moving task ${taskId} from ${source.droppableId} to ${destination.droppableId} (DB status: ${newStatus})`
      );

      // Find the task being moved to get its title
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

        // Show success toast with the enhanced toast
        showTaskToast({
          title: `Task status updated`,
          description: `"${taskTitle}" moved to ${statusDisplayName}`,
          type: "success",
          duration: 3000, // 3 seconds
        });
      } catch (err) {
        console.error("Error updating task status:", err);
        showTaskToast({
          title: "Failed to update task status",
          description: handleSupabaseError(err),
          type: "error",
          duration: 5000, // 5 seconds for errors
        });
        // Revert the optimistic update
        fetchTasks();
      }
    }
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
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
      // Get the current user
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

      // Validate task data before sending to Supabase
      try {
        // Create a partial schema for the new task data
        const partialTaskSchema = taskSchema.omit({
          id: true,
          user_id: true,
          created_at: true,
          updated_at: true,
        });

        // Validate the data
        partialTaskSchema.parse(newTaskData);
      } catch (validationError) {
        throw {
          message: "Task data validation failed",
          details: validationError,
          code: "VALIDATION_ERROR",
        };
      }

      const now = new Date().toISOString();

      // Prepare the data for insertion
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

      // Insert the new task into Supabase
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

      // Refresh the task list
      fetchTasks();

      showCalendarToast({
        title: "Task added successfully",
        type: "success",
      });

      return true; // Return success for the sidebar to handle
    } catch (err) {
      const errorMessage = handleSupabaseError(err);

      showCalendarToast({
        title: "Failed to add task",
        description: errorMessage,
        type: "error",
      });

      return false; // Return failure for the sidebar to handle
    }
  };

  // Similarly enhance error handling for update and delete operations
  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      // Validate the task ID
      if (!taskId || typeof taskId !== "string") {
        throw {
          message: "Invalid task ID",
          code: "INVALID_ID",
        };
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

      // Prepare the data for Supabase
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
        // Convert dueDate to due_date for Supabase
        ...(updates.dueDate !== undefined && {
          due_date: updates.dueDate ? updates.dueDate.toISOString() : null,
        }),
      };

      // Remove frontend-specific fields that don't exist in the database
      if ("dueDate" in updateData) {
        delete updateData.dueDate;
      }

      // Update in Supabase
      const { error: updateError } = await supabase
        .from("tasks")
        .update(updateData)
        .eq("id", taskId);

      if (updateError) {
        throw updateError;
      }

      return true; // Return success for the sidebar to handle
    } catch (err) {
      const errorMessage = handleSupabaseError(err);

      showCalendarToast({
        title: "Failed to update task",
        description: errorMessage,
        type: "error",
      });

      // Revert the optimistic update
      fetchTasks();
      return false; // Return failure for the sidebar to handle
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      // Validate the task ID
      if (!taskId || typeof taskId !== "string") {
        throw {
          message: "Invalid task ID",
          code: "INVALID_ID",
        };
      }

      // Optimistically update UI
      setTasks((prev) => prev.filter((task) => task.id !== taskId));

      // Delete from Supabase
      const { error: deleteError } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (deleteError) {
        throw deleteError;
      }

      showCalendarToast({
        title: "Task deleted successfully",
        type: "success",
      });

      return true; // Return success for the sidebar to handle
    } catch (err) {
      const errorMessage = handleSupabaseError(err);

      showCalendarToast({
        title: "Failed to delete task",
        description: errorMessage,
        type: "error",
      });

      // Revert the optimistic update
      fetchTasks();
      return false; // Return failure for the sidebar to handle
    }
  };

  // Enhanced fetchTasks with more detailed logging
  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching tasks...");

      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      console.log("Auth response:", { user, error: userError });

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

      // Fetch tasks for the current user
      console.log("Fetching tasks for user:", user.id);
      const { data, error: fetchError } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      console.log("Tasks response:", {
        count: data?.length,
        error: fetchError,
      });

      if (fetchError) {
        throw fetchError;
      }

      if (!data) {
        throw {
          message: "No data returned from the database",
          code: "NO_DATA",
        };
      }

      // Parse the data through Zod schema to ensure type safety
      try {
        console.log("Parsing task data...");
        const parsedTasks = data.map((task) => {
          console.log("Processing task:", task.id);
          return {
            ...task,
            created_at: new Date(task.created_at),
            updated_at: new Date(task.updated_at),
            dueDate: task.due_date ? new Date(task.due_date) : null,
          };
        });

        console.log("Setting tasks state with parsed data");
        setTasks(parsedTasks);
      } catch (parseError) {
        console.error("Parse error:", parseError);
        throw {
          message: "Failed to parse task data",
          details: parseError,
          code: "PARSE_ERROR",
        };
      }
    } catch (err) {
      console.error("Error in fetchTasks:", err);
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);

      showCalendarToast({
        title: "Error loading tasks",
        description: errorMessage,
        type: "error",
      });
    } finally {
      console.log("Fetch tasks completed, setting isLoading to false");
      setIsLoading(false);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setEditSidebarOpen(true);
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
            className={`flex items-center gap-2 px-4 py-2 border rounded shadow-sm transition-colors ${
              hasActiveFilters
                ? "bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                : "bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
            onClick={toggleFilterSidebar}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter size={16} />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="ml-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {(filters.search ? 1 : 0) +
                  filters.importance.length +
                  filters.status.length}
              </span>
            )}
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
            onClick={toggleAddSidebar}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Plus size={24} />
          </motion.button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Kanban / Table */}
      {!isLoading && !error && (
        <motion.div
          className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            width:
              addSidebarOpen || editSidebarOpen
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
              tasks={tasks}
              onTaskUpdate={handleUpdateTask}
              onTaskDelete={handleDeleteTask}
              onTaskClick={handleTaskClick}
            />
          )}
        </motion.div>
      )}

      {/* Add Task Sidebar */}
      <AddTaskSidebar
        isOpen={addSidebarOpen}
        onClose={toggleAddSidebar}
        onAddTask={handleAddTask}
      />

      {/* Edit Task Sidebar */}
      <EditTaskSidebar
        isOpen={editSidebarOpen}
        onClose={() => setEditSidebarOpen(false)}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        task={selectedTask}
      />
      {/* Filter Sidebar */}
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
