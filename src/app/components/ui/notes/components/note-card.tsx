"use client";

import { useState } from "react";
import { type Note } from "@/app/schemas/notesSchema";
import { deleteNote, fetchUserNotes } from "../lib/notes-client";
import { getRelativeTime, truncateText, extractTitle } from "../lib/utils";
import { NoteEditor } from "./note-editor";
import { NoteViewer } from "./note-viewer";
import { TagBadge } from "./tag-badge";
import {
  PencilIcon,
  TrashIcon,
  EllipsisVerticalIcon,
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
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Ensure tags is always an array
  const noteTags = Array.isArray(note.tags) ? note.tags : [];

  const handleDelete = async () => {
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

  if (isEditing) {
    return (
      <NoteEditor
        note={note}
        userId={userId}
        onClose={() => setIsEditing(false)}
        onNotesChange={onNotesChange}
        index={index}
      />
    );
  }

  return (
    <>
      <div
        className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 animate-fade-in-up"
        style={{
          animationDelay: `${index * 50}ms`,
          animationFillMode: "both",
        }}
        onClick={() => setIsViewing(true)}
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
            {extractTitle(note.content)}
          </h3>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <EllipsisVerticalIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsViewing(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <EyeIcon className="h-4 w-4" />
                  View
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                    setShowMenu(false);
                  }}
                  disabled={isDeleting}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                >
                  <TrashIcon className="h-4 w-4" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-4">
          {truncateText(note.content)}
        </p>

        {/* Tags - with safety check */}
        {noteTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {noteTags.slice(0, 3).map((tag, tagIndex) => (
              <TagBadge key={`${tag}-${tagIndex}`} tag={tag} />
            ))}
            {noteTags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{noteTags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{getRelativeTime(note.updated_at)}</span>
          {note.related_type && (
            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded-full">
              {note.related_type}
            </span>
          )}
        </div>
      </div>

      {isViewing && (
        <NoteViewer
          note={note}
          userId={userId}
          onClose={() => setIsViewing(false)}
          onNotesChange={onNotesChange}
        />
      )}
    </>
  );
}
