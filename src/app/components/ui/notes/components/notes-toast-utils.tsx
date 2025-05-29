// lib/notes-toast-utils.ts
import { showNotesToast } from "./notes-toast";

// Utility functions for different note operations
export const notesToastUtils = {
  // Success toasts
  noteCreated: (noteTitle?: string) => {
    showNotesToast({
      title: "Note created successfully",
      description: noteTitle
        ? `"${noteTitle}" has been added to your notes`
        : "Your note has been added",
      type: "success",
    });
  },

  noteUpdated: (noteTitle?: string) => {
    showNotesToast({
      title: "Note updated successfully",
      description: noteTitle
        ? `"${noteTitle}" has been updated`
        : "Your note has been updated",
      type: "edit",
    });
  },

  noteDeleted: (noteTitle?: string) => {
    showNotesToast({
      title: "Note deleted",
      description: noteTitle
        ? `"${noteTitle}" has been removed from your notes`
        : "Your note has been deleted",
      type: "delete",
    });
  },

  noteSaved: (noteTitle?: string) => {
    showNotesToast({
      title: "Note saved",
      description: noteTitle
        ? `"${noteTitle}" has been saved`
        : "Your note has been saved",
      type: "success",
    });
  },

  // Error toasts
  noteCreateError: () => {
    showNotesToast({
      title: "Failed to create note",
      description: "There was an error creating your note. Please try again.",
      type: "error",
    });
  },

  noteUpdateError: () => {
    showNotesToast({
      title: "Failed to update note",
      description: "There was an error updating your note. Please try again.",
      type: "error",
    });
  },

  noteDeleteError: () => {
    showNotesToast({
      title: "Failed to delete note",
      description: "There was an error deleting your note. Please try again.",
      type: "error",
    });
  },

  noteSaveError: () => {
    showNotesToast({
      title: "Failed to save note",
      description: "There was an error saving your note. Please try again.",
      type: "error",
    });
  },

  // Info toasts
  noteRestored: (noteTitle?: string) => {
    showNotesToast({
      title: "Note restored",
      description: noteTitle
        ? `"${noteTitle}" has been restored`
        : "Your note has been restored",
      type: "info",
    });
  },

  noteArchived: (noteTitle?: string) => {
    showNotesToast({
      title: "Note archived",
      description: noteTitle
        ? `"${noteTitle}" has been archived`
        : "Your note has been archived",
      type: "info",
    });
  },

  noteDuplicated: (noteTitle?: string) => {
    showNotesToast({
      title: "Note duplicated",
      description: noteTitle
        ? `Copy of "${noteTitle}" has been created`
        : "Your note has been duplicated",
      type: "success",
    });
  },

  // Bulk operations
  bulkNotesDeleted: (count: number) => {
    showNotesToast({
      title: `${count} notes deleted`,
      description: `Successfully deleted ${count} ${
        count === 1 ? "note" : "notes"
      }`,
      type: "delete",
    });
  },

  bulkNotesArchived: (count: number) => {
    showNotesToast({
      title: `${count} notes archived`,
      description: `Successfully archived ${count} ${
        count === 1 ? "note" : "notes"
      }`,
      type: "info",
    });
  },
};
