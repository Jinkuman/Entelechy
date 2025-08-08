// types/eventSchema.ts
import { z } from "zod";

export const eventSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().default(""),
  startTime: z.date(),
  endTime: z.date(),
  allDay: z.boolean().default(false),
  location: z.string().nullable().default(null),
  notes: z.string().nullable().default(null), // Fixed: removed .uuid()
  color: z.string().default("blue"),
  created_at: z.date(),
  updated_at: z.date(),
  is_recurring: z.boolean().default(false),
  custom_recurring: z.string().nullable().default(null),
  recurring_pattern: z.string().nullable().default(null),
});

export type Event = z.infer<typeof eventSchema>;
