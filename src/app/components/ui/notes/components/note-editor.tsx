"use client";

import { useState, useRef, useEffect } from "react";
import { type Note } from "@/app/schemas/notesSchema";
import { updateNote, fetchUserNotes } from "../lib/notes-client";
import { TagInput } from "./tag-input";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { notesToastUtils } from "./notes-toast-utils";

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
  const [title, setTitle] = useState(note?.title || "");
  const [tags, setTags] = useState<string[]>(
    Array.isArray(note?.tags) ? note.tags : []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
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

    // Check if there are actual changes
    const hasChanges =
      note.content !== content ||
      note.title !== title ||
      JSON.stringify(note.tags || []) !== JSON.stringify(tags);

    // If no changes, just close without saving or showing toast
    if (!hasChanges) {
      handleClose();
      return;
    }

    setIsSaving(true);
    try {
      await updateNote(note.id, { content, tags, title });
      const updatedNotes = await fetchUserNotes(userId);
      onNotesChange(updatedNotes);

      // Show success toast
      notesToastUtils.noteUpdated(title || "Untitled Note");

      handleClose();
    } catch (error) {
      console.error("Failed to save note:", error);

      // Show error toast
      notesToastUtils.noteUpdateError();
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-lg transition-all duration-200 ${
        isClosing ? "animate-scale-out" : "animate-scale-in"
      }`}
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
            onClick={handleClose}
            className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Title Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Tags Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags
        </label>
        <TagInput tags={tags} onChange={setTags} placeholder="Add tags..." />
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
