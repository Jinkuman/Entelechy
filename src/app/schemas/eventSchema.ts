// types/eventSchema.ts
import { z } from "zod";

export const eventSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string().min(1),
  description: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  allDay: z.boolean().default(false),
  location: z.string().optional(),
  notes: z.string().optional(),
  color: z.string().default("blue"),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Event = z.infer<typeof eventSchema>;
