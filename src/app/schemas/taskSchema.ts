// src/schemas/taskSchema.ts
import { z } from "zod";

// Update the status enum to match your Supabase database
export const taskSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  // Update these values to match your database enum
  status: z.enum(["uncompleted", "in_progress", "completed"]), // Changed from "uncompleted", "in-progress"
  importance: z.enum(["high", "medium", "low"]),
  dueDate: z.preprocess((val) => {
    if (typeof val === "string") return new Date(val);
    return null;
  }, z.date().nullable()),
  category: z.string().optional().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

// array-of-tasks schema
export const Task = z.array(taskSchema);

// inferred TS type for convenience
export type ToDo = z.infer<typeof Task>;
