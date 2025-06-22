"use client";

import supabase from "@/lib/supabaseClient";
import {
  type CreateNote,
  type UpdateNote,
  type DatabaseNote,
  type NotesStats,
} from "./types";
import { type Note } from "@/app/schemas/notesSchema";
import { title } from "process";

export async function fetchUserNotes(userId: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("starred", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch notes: ${error.message}`);
  }

  // Transform database notes to our Note type
  return (data as DatabaseNote[]).map((note) => ({
    id: note.id,
    user_id: note.user_id,
    title: note.title,
    content: note.content,
    tags: Array.isArray(note.tags) ? note.tags : [], // Ensure tags is always an array
    related_type: note.related_type,
    related_id: note.related_id,
    created_at: note.created_at,
    updated_at: note.updated_at,
    starred: note.starred || false,
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
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags || [],
        related_type: noteData.related_type || null,
        related_id: noteData.related_id || null,
        starred: noteData.starred || false,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create note: ${error.message}`);
  }

  // Transform the returned data
  const transformedNote = {
    ...data,
    tags: Array.isArray(data.tags) ? data.tags : [],
    starred: data.starred || false,
  };

  return transformedNote as Note;
}

export async function updateNote(
  noteId: string,
  noteData: UpdateNote
): Promise<Note> {
  const { data, error } = await supabase
    .from("notes")
    .update({
      content: noteData.content,
      title: noteData.title,
      tags: noteData.tags || [],
      related_type: noteData.related_type || null,
      related_id: noteData.related_id || null,
      starred: noteData.starred !== undefined ? noteData.starred : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", noteId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update note: ${error.message}`);
  }

  // Transform the returned data
  const transformedNote = {
    ...data,
    tags: Array.isArray(data.tags) ? data.tags : [],
    starred: data.starred || false,
  };

  return transformedNote as Note;
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
  const starred = notes.filter((note) => note.starred).length;

  // Get all unique tags - with safety check
  const allTags = new Set<string>();
  notes.forEach((note) => {
    const tags = Array.isArray(note.tags) ? note.tags : [];
    tags.forEach((tag) => {
      if (typeof tag === "string") {
        allTags.add(tag);
      }
    });
  });
  const totalTags = allTags.size;

  return { total, updatedRecently, newThisWeek, totalTags, starred };
}

export function getAllTags(notes: Note[]): string[] {
  const tagSet = new Set<string>();
  notes.forEach((note) => {
    const tags = Array.isArray(note.tags) ? note.tags : [];
    tags.forEach((tag) => {
      if (typeof tag === "string") {
        tagSet.add(tag);
      }
    });
  });
  return Array.from(tagSet).sort();
}

export function filterNotesByTags(
  notes: Note[],
  selectedTags: string[]
): Note[] {
  if (selectedTags.length === 0) return notes;

  return notes.filter((note) => {
    const noteTags = Array.isArray(note.tags) ? note.tags : [];
    return selectedTags.every((tag) => noteTags.includes(tag));
  });
}

export async function toggleStarred(noteId: string): Promise<Note> {
  // First get the current note to get its starred status
  const { data: currentNote, error: fetchError } = await supabase
    .from("notes")
    .select("starred")
    .eq("id", noteId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch note: ${fetchError.message}`);
  }

  // Toggle the starred status
  const newStarredStatus = !currentNote.starred;

  const { data, error } = await supabase
    .from("notes")
    .update({
      starred: newStarredStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", noteId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to toggle starred status: ${error.message}`);
  }

  // Transform the returned data
  const transformedNote = {
    ...data,
    tags: Array.isArray(data.tags) ? data.tags : [],
    starred: data.starred || false,
  };

  return transformedNote as Note;
}
