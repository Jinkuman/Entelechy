import supabase from "@/lib/supabaseClient";
import { Note, NoteSchema } from "@/app/schemas/notesSchema";

export async function fetchUserNotes(userId: string): Promise<Note[]> {
  try {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching notes:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data
      .map((note) => {
        try {
          // Validate with Zod schema
          return NoteSchema.parse(note);
        } catch (parseError) {
          console.error("Error parsing note:", parseError, note);
          return null;
        }
      })
      .filter(Boolean) as Note[];
  } catch (err) {
    console.error("Unexpected error in fetchUserNotes:", err);
    return [];
  }
}

export function getRecentNotes(notes: Note[]): Note[] {
  return notes.slice(0, 5);
}
