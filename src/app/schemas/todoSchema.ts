import { z } from "zod";

export const todoSchema = z.object({
  title: z.string(),
  priority: z.number(),
  dueDate: z.date().nullable(),
  completed: z.boolean().default(false),
  notes: z.string().optional(),
});

export type ToDo = z.infer<typeof todoSchema>;
