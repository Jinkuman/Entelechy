"use client";

import { useState, useRef, useEffect } from "react";
import {
  PlusIcon,
  XMarkIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { createNote, fetchUserNotes } from "../lib/notes-client";
import { TagInput } from "./tag-input";
import { type Note } from "@/app/schemas/notesSchema";
import { notesToastUtils } from "./notes-toast-utils";

interface CreateNoteButtonProps {
  userId: string;
  onNotesChange: (notes: Note[]) => void;
}

export function CreateNoteButton({
  userId,
  onNotesChange,
}: CreateNoteButtonProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isCreating && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isCreating]);

  useEffect(() => {
    if (isCreating) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCreating]);

  const handleCreate = async () => {
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      await createNote(userId, { content, tags, title });
      const updatedNotes = await fetchUserNotes(userId);
      onNotesChange(updatedNotes);

      // Show success toast
      notesToastUtils.noteCreated(title);

      setContent("");
      setTitle("");
      setTags([]);
      handleClose();
    } catch (error) {
      console.error("Failed to create note:", error);

      // Show error toast
      notesToastUtils.noteCreateError();
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsCreating(false);
      setIsClosing(false);
      setContent("");
      setTitle("");
      setTags([]);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleCreate();
    }
  };

  if (isCreating) {
    return (
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300 ${
          isClosing ? "animate-fade-out" : "animate-fade-in"
        }`}
        onClick={handleClose}
      >
        <div
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl transition-all duration-300 ${
            isClosing ? "animate-scale-out-large" : "animate-scale-in-large"
          }`}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <DocumentTextIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Create New Note
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Capture your thoughts and ideas
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Title Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title (optional)
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <TagInput
                tags={tags}
                onChange={setTags}
                placeholder="Add tags to organize your note..."
              />
            </div>

            {/* Note Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content
              </label>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your note..."
                className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{content.length} characters</span>
              <span>
                {content.split(/\s+/).filter((word) => word.length > 0).length}{" "}
                words
              </span>
              <span>Press Cmd+Enter to save</span>
            </div>
            <button
              onClick={handleCreate}
              disabled={isSaving || !content.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed font-medium"
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
