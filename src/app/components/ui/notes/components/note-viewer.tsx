"use client";

import { useState, useEffect } from "react";
import { type Note } from "@/app/schemas/notesSchema";
import { updateNote, fetchUserNotes } from "../lib/notes-client";
import { formatDate } from "../lib/utils";
import { TagBadge } from "./tag-badge";
import { TagInput } from "./tag-input";
import {
  XMarkIcon,
  PencilIcon,
  CheckIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

interface NoteViewerProps {
  note: Note;
  userId: string;
  onClose: () => void;
  onNotesChange: (notes: Note[]) => void;
}

export function NoteViewer({
  note,
  userId,
  onClose,
  onNotesChange,
}: NoteViewerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [title, setTitle] = useState(note.title || ""); // Fixed typo and added fallback
  const [tags, setTags] = useState<string[]>(
    Array.isArray(note.tags) ? note.tags : []
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateNote(note.id, { content, tags, title });
      const updatedNotes = await fetchUserNotes(userId);
      onNotesChange(updatedNotes);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (isEditing) {
        setIsEditing(false);
        setContent(note.content);
        setTitle(note.title || "");
        setTags(Array.isArray(note.tags) ? note.tags : []);
      } else {
        handleClose();
      }
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && isEditing) {
      handleSave();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300 ${
        isClosing ? "animate-fade-out" : "animate-fade-in"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transition-all duration-300 ${
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
                {isEditing ? "Edit Note" : note.title || "Untitled Note"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isEditing
                  ? "Make your changes"
                  : `Created ${formatDate(note.created_at)}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !content.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  <CheckIcon className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setContent(note.content);
                    setTitle(note.title || "");
                    setTags(Array.isArray(note.tags) ? note.tags : []);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <PencilIcon className="h-4 w-4" />
                Edit
              </button>
            )}

            <button
              onClick={handleClose}
              className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Title Section - Only show in edit mode */}
          {isEditing && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
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
          )}

          {/* Tags Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags:
              </span>
            </div>

            {isEditing ? (
              <TagInput
                tags={tags}
                onChange={setTags}
                placeholder="Add tags..."
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? (
                  tags.map((tag, tagIndex) => (
                    <TagBadge key={`${tag}-${tagIndex}`} tag={tag} />
                  ))
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No tags
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Note Content */}
          <div className="flex-1 p-6 overflow-auto">
            {isEditing ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note..."
                className="w-full h-full min-h-[400px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-200"
                autoFocus
              />
            ) : (
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-gray-900 dark:text-white leading-relaxed">
                  {note.content}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span>Created: {formatDate(note.created_at)}</span>
              <span>Updated: {formatDate(note.updated_at)}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{content.length} characters</span>
              <span>
                {content.split(/\s+/).filter((word) => word.length > 0).length}{" "}
                words
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
