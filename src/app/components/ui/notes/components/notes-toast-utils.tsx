// lib/notes-toast-utils.ts
import { notesToasts } from "@/app/components/ui/toast-utils";

// Utility functions for different note operations
export const notesToastUtils = {
  // Success toasts
  noteCreated: (noteTitle?: string) => {
    notesToasts.noteCreated(noteTitle || "Untitled Note");
  },

  noteUpdated: (noteTitle?: string) => {
    notesToasts.noteUpdated(noteTitle || "Untitled Note");
  },

  noteDeleted: (noteTitle?: string) => {
    notesToasts.noteDeleted(noteTitle || "Untitled Note");
  },

  noteSaved: (noteTitle?: string) => {
    notesToasts.noteUpdated(noteTitle || "Untitled Note");
  },

  // Error toasts
  noteCreateError: () => {
    notesToasts.noteError("create");
  },

  noteUpdateError: () => {
    notesToasts.noteError("update");
  },

  noteDeleteError: () => {
    notesToasts.noteError("delete");
  },

  noteSaveError: () => {
    notesToasts.noteError("save");
  },

  // Info toasts - using custom standardized toast for these
  noteRestored: (noteTitle?: string) => {
    import("@/app/components/ui/standardized-toast").then(
      ({ showStandardizedToast }) => {
        showStandardizedToast({
          title: "Note restored",
          description: noteTitle
            ? `"${noteTitle}" has been restored`
            : "Your note has been restored",
          type: "info",
          category: "notes",
        });
      }
    );
  },

  noteArchived: (noteTitle?: string) => {
    import("@/app/components/ui/standardized-toast").then(
      ({ showStandardizedToast }) => {
        showStandardizedToast({
          title: "Note archived",
          description: noteTitle
            ? `"${noteTitle}" has been archived`
            : "Your note has been archived",
          type: "info",
          category: "notes",
        });
      }
    );
  },

  noteDuplicated: (noteTitle?: string) => {
    notesToasts.noteCreated(`Copy of ${noteTitle || "Untitled Note"}`);
  },

  // Bulk operations
  bulkNotesDeleted: (count: number) => {
    import("@/app/components/ui/standardized-toast").then(
      ({ showStandardizedToast }) => {
        showStandardizedToast({
          title: `${count} notes deleted`,
          description: `Successfully deleted ${count} ${
            count === 1 ? "note" : "notes"
          }`,
          type: "delete",
          category: "notes",
        });
      }
    );
  },

  bulkNotesArchived: (count: number) => {
    import("@/app/components/ui/standardized-toast").then(
      ({ showStandardizedToast }) => {
        showStandardizedToast({
          title: `${count} notes archived`,
          description: `Successfully archived ${count} ${
            count === 1 ? "note" : "notes"
          }`,
          type: "info",
          category: "notes",
        });
      }
    );
  },
};
