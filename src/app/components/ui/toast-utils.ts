import { showStandardizedToast } from "./standardized-toast";

// Calendar Toast Utilities
export const calendarToasts = {
  eventCreated: (title: string) => {
    showStandardizedToast({
      title: "Event created",
      description: `"${title}" has been added to your calendar`,
      type: "success",
      category: "calendar",
    });
  },

  eventUpdated: (title: string) => {
    showStandardizedToast({
      title: "Event updated",
      description: `"${title}" has been modified`,
      type: "edit",
      category: "calendar",
    });
  },

  eventDeleted: (title: string) => {
    showStandardizedToast({
      title: "Event deleted",
      description: `"${title}" has been removed from your calendar`,
      type: "delete",
      category: "calendar",
    });
  },

  eventError: (action: string, error?: string) => {
    showStandardizedToast({
      title: `Failed to ${action} event`,
      description: error || "Please try again",
      type: "error",
      category: "calendar",
    });
  },
};

// Notes Toast Utilities
export const notesToasts = {
  noteCreated: (title: string) => {
    showStandardizedToast({
      title: "Note created",
      description: `"${title}" has been saved`,
      type: "success",
      category: "notes",
    });
  },

  noteUpdated: (title: string) => {
    showStandardizedToast({
      title: "Note updated",
      description: `"${title}" has been modified`,
      type: "edit",
      category: "notes",
    });
  },

  noteDeleted: (title: string) => {
    showStandardizedToast({
      title: "Note deleted",
      description: `"${title}" has been removed`,
      type: "delete",
      category: "notes",
    });
  },

  noteError: (action: string, error?: string) => {
    showStandardizedToast({
      title: `Failed to ${action} note`,
      description: error || "Please try again",
      type: "error",
      category: "notes",
    });
  },
};

// Tasks Toast Utilities
export const tasksToasts = {
  taskCreated: (title: string) => {
    showStandardizedToast({
      title: "Task created",
      description: `"${title}" has been added to your tasks`,
      type: "success",
      category: "tasks",
    });
  },

  taskUpdated: (title: string) => {
    showStandardizedToast({
      title: "Task updated",
      description: `"${title}" has been modified`,
      type: "edit",
      category: "tasks",
    });
  },

  taskDeleted: (title: string) => {
    showStandardizedToast({
      title: "Task deleted",
      description: `"${title}" has been removed`,
      type: "delete",
      category: "tasks",
    });
  },

  taskError: (action: string, error?: string) => {
    showStandardizedToast({
      title: `Failed to ${action} task`,
      description: error || "Please try again",
      type: "error",
      category: "tasks",
    });
  },
};
