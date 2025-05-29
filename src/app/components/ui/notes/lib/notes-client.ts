"use client";

import supabase from "@/lib/supabaseClient";
import {
  type CreateNote,
  type UpdateNote,
  type DatabaseNote,
  type NotesStats,
} from "./types";
import { type Note } from "@/app/schemas/notesSchema";

export async function fetchUserNotes(userId: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch notes: ${error.message}`);
  }

  // Transform database notes to our Note type
  return (data as DatabaseNote[]).map((note) => ({
    id: note.id,
    user_id: note.user_id,
    content: note.content,
    related_type: note.related_type,
    related_id: note.related_id,
    created_at: note.created_at,
    updated_at: note.updated_at,
  }));
}

export async function createNote(
  userId: string,
  noteData: CreateNote
): Promise<Note> {
  const { data, error } = await supabase
    .from("notes")
    .insert([
      {
        user_id: userId,
        content: noteData.content,
        related_type: noteData.related_type || null,
        related_id: noteData.related_id || null,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create note: ${error.message}`);
  }

  return data as Note;
}

export async function updateNote(
  noteId: string,
  noteData: UpdateNote
): Promise<Note> {
  const { data, error } = await supabase
    .from("notes")
    .update({
      content: noteData.content,
      related_type: noteData.related_type || null,
      related_id: noteData.related_id || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", noteId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update note: ${error.message}`);
  }

  return data as Note;
}

export async function deleteNote(noteId: string): Promise<void> {
  const { error } = await supabase.from("notes").delete().eq("id", noteId);

  if (error) {
    throw new Error(`Failed to delete note: ${error.message}`);
  }
}

export function calculateNotesStats(notes: Note[]): NotesStats {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const total = notes.length;
  const newThisWeek = notes.filter(
    (note) => new Date(note.created_at) >= oneWeekAgo
  ).length;
  const updatedRecently = notes.filter(
    (note) => new Date(note.updated_at) >= oneDayAgo
  ).length;

  return { total, updatedRecently, newThisWeek };
}
