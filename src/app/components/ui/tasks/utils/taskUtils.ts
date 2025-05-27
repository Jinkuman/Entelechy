// src/utils/taskUtils.ts
import { taskSchema } from "@/app/schemas/taskSchema";
import type { z } from "zod";

type Task = z.infer<typeof taskSchema>;
type TaskStatus = Task["status"];
type TaskImportance = Task["importance"];

export const getImportanceColor = (importance: TaskImportance) => {
  switch (importance) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

export const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "in_progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "uncompleted":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

export const formatStatusDisplay = (status: TaskStatus) => {
  if (status === "in_progress") return "In Progress";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const formatImportanceDisplay = (importance: TaskImportance) =>
  importance.charAt(0).toUpperCase() + importance.slice(1);
