"use client";

import { useState, useEffect } from "react";
import { type Note } from "@/app/schemas/notesSchema";

export function useNotes(initialNotes: Note[]) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>(initialNotes);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNotes(notes);
      return;
    }

    const filtered = notes.filter((note) =>
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNotes(filtered);
  }, [notes, searchQuery]);

  return {
    notes,
    setNotes,
    searchQuery,
    setSearchQuery,
    filteredNotes,
  };
}
