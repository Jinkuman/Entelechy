"use client";

import { useState, useRef, useEffect } from "react";
import { type Note } from "@/app/schemas/notesSchema";
import { updateNote, fetchUserNotes } from "../lib/notes-client";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

interface NoteEditorProps {
  note?: Note;
  userId: string;
  onClose: () => void;
  onNotesChange: (notes: Note[]) => void;
  index: number;
}

export function NoteEditor({
  note,
  userId,
  onClose,
  onNotesChange,
  index,
}: NoteEditorProps) {
  const [content, setContent] = useState(note?.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, []);

  const handleSave = async () => {
    if (!content.trim() || !note) return;

    setIsSaving(true);
    try {
      await updateNote(note.id, { content });
      // Refresh notes after update
      const updatedNotes = await fetchUserNotes(userId);
      onNotesChange(updatedNotes);
      onClose();
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-lg animate-scale-in"
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: "both",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900 dark:text-white">
          {note ? "Edit Note" : "New Note"}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving || !content.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
          >
            <CheckIcon className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Start writing your note..."
        className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-200"
      />

      <div className="flex items-center justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
        <span>Press Cmd+Enter to save, Esc to cancel</span>
        <span>{content.length} characters</span>
      </div>
    </div>
  );
}
