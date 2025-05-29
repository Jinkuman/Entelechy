"use client";

import { useState } from "react";
import { type Note } from "@/app/schemas/notesSchema";
import { deleteNote, fetchUserNotes } from "../lib/notes-client";
import { formatDate } from "../lib/utils";
import { TagBadge } from "./tag-badge";
import { NoteViewer } from "./note-viewer";
import { NoteEditor } from "./note-editor";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

interface NoteCardProps {
  note: Note;
  index: number;
  userId: string;
  onNotesChange: (notes: Note[]) => void;
}

export function NoteCard({
  note,
  index,
  userId,
  onNotesChange,
}: NoteCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this note?")) return;

    setIsDeleting(true);
    try {
      await deleteNote(note.id);
      const updatedNotes = await fetchUserNotes(userId);
      onNotesChange(updatedNotes);
    } catch (error) {
      console.error("Failed to delete note:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    setShowEditor(true);
  };

  const handleView = () => {
    setShowViewer(true);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200 cursor-pointer animate-scale-in ${
          isDeleting ? "opacity-50 pointer-events-none" : ""
        }`}
        style={{
          animationDelay: `${index * 50}ms`,
          animationFillMode: "both",
        }}
        onClick={handleView}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1">
              {note.title || "Untitled Note"}
            </h3>

            {/* Date */}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(note.updated_at)}
            </p>
          </div>

          {/* Actions Dropdown */}
          <div className="relative ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors duration-200"
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                  }}
                />
                <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(false);
                      setShowViewer(true);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-t-lg flex items-center gap-2"
                  >
                    <EyeIcon className="h-4 w-4" />
                    View
                  </button>
                  <button
                    onClick={handleEdit}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg flex items-center gap-2"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content Preview */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
            {truncateText(note.content, 150)}
          </p>
        </div>

        {/* Tags */}
        {Array.isArray(note.tags) && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {note.tags.slice(0, 3).map((tag, tagIndex) => (
              <TagBadge key={`${tag}-${tagIndex}`} tag={tag} />
            ))}
            {note.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                +{note.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
          <span>{note.content.length} chars</span>
          <span>
            {note.content.split(/\s+/).filter((word) => word.length > 0).length}{" "}
            words
          </span>
        </div>
      </div>

      {/* Modals */}
      {showViewer && (
        <NoteViewer
          note={note}
          userId={userId}
          onClose={() => setShowViewer(false)}
          onNotesChange={onNotesChange}
        />
      )}

      {showEditor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl">
            <NoteEditor
              note={note}
              userId={userId}
              onClose={() => setShowEditor(false)}
              onNotesChange={onNotesChange}
              index={0}
            />
          </div>
        </div>
      )}
    </>
  );
}
