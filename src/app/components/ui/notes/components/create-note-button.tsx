"use client";

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { createNote, fetchUserNotes } from "../lib/notes-client";
import { type Note } from "@/app/schemas/notesSchema";

interface CreateNoteButtonProps {
  userId: string;
  onNotesChange: (notes: Note[]) => void;
}

export function CreateNoteButton({
  userId,
  onNotesChange,
}: CreateNoteButtonProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async () => {
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      await createNote(userId, { content });
      // Refresh notes after creation
      const updatedNotes = await fetchUserNotes(userId);
      onNotesChange(updatedNotes);
      setContent("");
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isCreating) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Create New Note
            </h3>
            <button
              onClick={() => {
                setIsCreating(false);
                setContent("");
              }}
              className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
            >
              ✕
            </button>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your note..."
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-200"
            autoFocus
          />

          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {content.length} characters
            </span>
            <button
              onClick={handleCreate}
              disabled={isSaving || !content.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            >
              {isSaving ? "Creating..." : "Create Note"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsCreating(true)}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
    >
      <PlusIcon className="h-5 w-5" />
      New Note
    </button>
  );
}
