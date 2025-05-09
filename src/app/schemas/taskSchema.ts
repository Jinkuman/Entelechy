// src/schemas/task.ts
import { z } from "zod";

// single-task schema
export const taskSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["uncompleted", "in-progress", "completed"]),
  importance: z.enum(["high", "medium", "low"]),
  dueDate: z.preprocess((val) => {
    if (typeof val === "string") return new Date(val);
    return null;
  }, z.date().nullable()),
  category: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

// array-of-tasks schema
export const Task = z.array(taskSchema);

// inferred TS type for convenience
export type ToDo = z.infer<typeof Task>;
