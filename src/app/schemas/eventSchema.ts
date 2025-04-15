import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1),
  startTime: z.date(),
  endTime: z.date(),
  allDay: z.boolean().default(false),
  notes: z.string().optional(),
});

export type Event = z.infer<typeof eventSchema>;
