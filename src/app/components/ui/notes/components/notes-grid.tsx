"use client";

import { type Note } from "@/app/schemas/notesSchema";
import { NoteCard } from "./note-card";

interface NotesGridProps {
  notes: Note[];
  userId: string;
  onNotesChange: (notes: Note[]) => void;
}

export function NotesGrid({ notes, userId, onNotesChange }: NotesGridProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 text-lg">
          No notes found
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Create your first note to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {notes.map((note, index) => (
        <NoteCard
          key={note.id}
          note={note}
          index={index}
          userId={userId}
          onNotesChange={onNotesChange}
        />
      ))}
    </div>
  );
}
