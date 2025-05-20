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
  notes: z.string().uuid().nullable().default(null),
  color: z.string().default("blue"),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Event = z.infer<typeof eventSchema>;
