import { z } from "zod";

export const CreateNoteSchema = z.object({
  content: z.string().min(1, "Content is required"),
  related_type: z.string().optional(),
  related_id: z.string().uuid().optional(),
});

export const UpdateNoteSchema = z.object({
  content: z.string().min(1, "Content is required"),
  related_type: z.string().optional(),
  related_id: z.string().uuid().optional(),
});

export type CreateNote = z.infer<typeof CreateNoteSchema>;
export type UpdateNote = z.infer<typeof UpdateNoteSchema>;

export interface NotesStats {
  total: number;
  updatedRecently: number;
  newThisWeek: number;
}

// Raw database type
export interface DatabaseNote {
  id: string;
  user_id: string;
  content: string;
  related_type: string | null;
  related_id: string | null;
  created_at: string;
  updated_at: string;
}
