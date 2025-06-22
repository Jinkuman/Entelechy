import { z } from "zod";

export const NoteSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).default([]),
  related_type: z.string().nullable(),
  related_id: z.string().uuid().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  starred: z.boolean().default(false),
});

export type Note = z.infer<typeof NoteSchema>;
