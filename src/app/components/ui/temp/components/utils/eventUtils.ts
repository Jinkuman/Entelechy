// calendar/utils/eventUtils.ts

import { Event } from "@/app/schemas/eventSchema";

// Get events for a specific date
export const getEventsForDate = (events: Event[], date: Date) => {
  return events.filter(
    (event) =>
      event.startTime.getDate() === date.getDate() &&
      event.startTime.getMonth() === date.getMonth() &&
      event.startTime.getFullYear() === date.getFullYear()
  );
};

// Check if a date has any events (for year view)
export const hasEventsOnDate = (events: Event[], date: Date) => {
  return events.some(
    (event) =>
      event.startTime.getDate() === date.getDate() &&
      event.startTime.getMonth() === date.getMonth() &&
      event.startTime.getFullYear() === date.getFullYear()
  );
};
