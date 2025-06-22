// calendar/utils/eventUtils.ts

import { Event } from "@/app/schemas/eventSchema";

// Get all events for a specific date
export const getEventsForDate = (events: Event[], date: Date) => {
  return events.filter(
    (event) =>
      event.startTime.getDate() === date.getDate() &&
      event.startTime.getMonth() === date.getMonth() &&
      event.startTime.getFullYear() === date.getFullYear()
  );
};

// Get all-day events for a specific date
export const getAllDayEventsForDate = (events: Event[], date: Date) => {
  return events.filter(
    (event) =>
      event.allDay &&
      event.startTime.getDate() === date.getDate() &&
      event.startTime.getMonth() === date.getMonth() &&
      event.startTime.getFullYear() === date.getFullYear()
  );
};

// Get timed events for a specific date
export const getTimedEventsForDate = (events: Event[], date: Date) => {
  return events.filter(
    (event) =>
      !event.allDay &&
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

// Check if a date has all-day events
export const hasAllDayEventsOnDate = (events: Event[], date: Date) => {
  return events.some(
    (event) =>
      event.allDay &&
      event.startTime.getDate() === date.getDate() &&
      event.startTime.getMonth() === date.getMonth() &&
      event.startTime.getFullYear() === date.getFullYear()
  );
};
