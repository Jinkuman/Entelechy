import { z } from "zod";

export const CreateNoteSchema = z.object({
  content: z.string().min(1, "Content is required"),
  title: z.string(),
  tags: z.array(z.string()).default([]),
  related_type: z.string().optional(),
  related_id: z.string().uuid().optional(),
  starred: z
    .boolean()
    .nullable()
    .transform((val) => val ?? false),
});

export const UpdateNoteSchema = z.object({
  content: z.string().min(1, "Content is required"),
  title: z.string(),
  tags: z.array(z.string()).default([]),
  related_type: z.string().optional(),
  related_id: z.string().uuid().optional(),
  starred: z.boolean().optional(),
});

export type CreateNote = z.infer<typeof CreateNoteSchema>;
export type UpdateNote = z.infer<typeof UpdateNoteSchema>;

export interface NotesStats {
  total: number;
  updatedRecently: number;
  newThisWeek: number;
  totalTags: number;
  starred: number;
}

// Raw database type
export interface DatabaseNote {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  related_type: string | null;
  related_id: string | null;
  created_at: string;
  updated_at: string;
  starred: boolean | null;
}

export interface TagFilter {
  selectedTags: string[];
  availableTags: string[];
}
