import {
  Event,
  RecurringPattern,
  CustomRecurring,
} from "@/app/schemas/eventSchema";

// Generate recurring event instances for a given date range
export const generateRecurringInstances = (
  originalEvent: Event,
  startDate: Date,
  endDate: Date
): Event[] => {
  if (!originalEvent.isRecurring || originalEvent.recurringPattern === "none") {
    return [originalEvent];
  }

  const instances: Event[] = [];
  const eventStart = new Date(originalEvent.startTime);
  const eventEnd = new Date(originalEvent.endTime);
  const duration = eventEnd.getTime() - eventStart.getTime();

  let currentDate = new Date(eventStart);
  let occurrenceCount = 0;
  const maxOccurrences =
    originalEvent.customRecurring?.endAfterOccurrences || 100; // Default limit

  // For custom recurring with selected days, we need to handle it differently
  if (
    originalEvent.recurringPattern === "custom" &&
    originalEvent.customRecurring?.selectedDays &&
    originalEvent.customRecurring.selectedDays.length > 0
  ) {
    // Generate instances for custom recurring with selected days
    return generateCustomRecurringInstances(originalEvent, startDate, endDate);
  }

  while (
    currentDate <= endDate &&
    occurrenceCount < maxOccurrences &&
    (!originalEvent.customRecurring?.endDate ||
      currentDate <= originalEvent.customRecurring.endDate)
  ) {
    // Only include instances that fall within our view range
    if (currentDate >= startDate) {
      const instanceStart = new Date(currentDate);
      const instanceEnd = new Date(currentDate.getTime() + duration);

      const instance: Event = {
        ...originalEvent,
        id: `${originalEvent.id}_${occurrenceCount}`, // Temporary ID for display
        startTime: instanceStart,
        endTime: instanceEnd,
        originalEventId: originalEvent.id,
      };

      instances.push(instance);
    }

    // Calculate next occurrence
    currentDate = getNextOccurrence(
      currentDate,
      originalEvent.recurringPattern,
      originalEvent.customRecurring
    );
    occurrenceCount++;
  }

  return instances;
};

// Generate instances for custom recurring with selected days
const generateCustomRecurringInstances = (
  originalEvent: Event,
  startDate: Date,
  endDate: Date
): Event[] => {
  const instances: Event[] = [];
  const eventStart = new Date(originalEvent.startTime);
  const eventEnd = new Date(originalEvent.endTime);
  const duration = eventEnd.getTime() - eventStart.getTime();

  const customRecurring = originalEvent.customRecurring!;
  const selectedDays = customRecurring.selectedDays!;
  const interval = customRecurring.interval;
  const maxOccurrences = customRecurring.endAfterOccurrences || 100;

  // Start from the original event date
  let currentDate = new Date(eventStart);
  let occurrenceCount = 0;

  // Generate instances for the specified date range
  while (
    currentDate <= endDate &&
    occurrenceCount < maxOccurrences &&
    (!customRecurring.endDate || currentDate <= customRecurring.endDate)
  ) {
    // Check if current date falls on a selected day
    const currentDayOfWeek = currentDate.getDay();

    if (selectedDays.includes(currentDayOfWeek)) {
      // Only include instances that fall within our view range
      if (currentDate >= startDate) {
        const instanceStart = new Date(currentDate);
        const instanceEnd = new Date(currentDate.getTime() + duration);

        const instance: Event = {
          ...originalEvent,
          id: `${originalEvent.id}_${occurrenceCount}`,
          startTime: instanceStart,
          endTime: instanceEnd,
          originalEventId: originalEvent.id,
        };

        instances.push(instance);
      }
      occurrenceCount++;
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);

    // If we've completed a week and need to skip weeks based on interval
    if (currentDate.getDay() === 0 && interval > 1) {
      // Skip to the next interval week
      currentDate.setDate(currentDate.getDate() + (interval - 1) * 7);
    }
  }

  return instances;
};

// Get the next occurrence date based on the recurring pattern
const getNextOccurrence = (
  currentDate: Date,
  pattern: RecurringPattern,
  customRecurring?: CustomRecurring
): Date => {
  const nextDate = new Date(currentDate);

  switch (pattern) {
    case "daily":
      nextDate.setDate(nextDate.getDate() + 1);
      break;

    case "weekly":
      nextDate.setDate(nextDate.getDate() + 7);
      break;

    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;

    case "yearly":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;

    case "custom":
      if (customRecurring) {
        const interval = customRecurring.interval;

        // Handle custom recurring with selected days
        if (
          customRecurring.selectedDays &&
          customRecurring.selectedDays.length > 0
        ) {
          // For custom recurring with selected days, find the next occurrence
          return getNextCustomOccurrence(currentDate, customRecurring);
        }

        // Fall back to interval-based recurring
        switch (customRecurring.unit) {
          case "days":
            nextDate.setDate(nextDate.getDate() + interval);
            break;
          case "weeks":
            nextDate.setDate(nextDate.getDate() + interval * 7);
            break;
          case "months":
            nextDate.setMonth(nextDate.getMonth() + interval);
            break;
          case "years":
            nextDate.setFullYear(nextDate.getFullYear() + interval);
            break;
        }
      }
      break;

    default:
      // No recurring, return same date
      break;
  }

  return nextDate;
};

// Get the next occurrence for custom recurring with selected days
const getNextCustomOccurrence = (
  currentDate: Date,
  customRecurring: CustomRecurring
): Date => {
  if (
    !customRecurring.selectedDays ||
    customRecurring.selectedDays.length === 0
  ) {
    return currentDate;
  }

  const interval = customRecurring.interval;
  const selectedDays = customRecurring.selectedDays;
  const currentDayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Find the next selected day in the current week
  const nextDayInWeek = selectedDays.find((day) => day > currentDayOfWeek);

  if (nextDayInWeek !== undefined) {
    // Next occurrence is in the same week
    const nextDate = new Date(currentDate);
    nextDate.setDate(
      currentDate.getDate() + (nextDayInWeek - currentDayOfWeek)
    );
    return nextDate;
  } else {
    // Next occurrence is in the next interval week
    const nextDate = new Date(currentDate);
    nextDate.setDate(
      currentDate.getDate() +
        (7 - currentDayOfWeek) +
        selectedDays[0] +
        (interval - 1) * 7
    );
    return nextDate;
  }
};

// Get all events including recurring instances for a date range
export const getEventsWithRecurring = (
  events: Event[],
  startDate: Date,
  endDate: Date
): Event[] => {
  const allEvents: Event[] = [];

  events.forEach((event) => {
    if (event.isRecurring && event.recurringPattern !== "none") {
      // Generate recurring instances for this event
      const instances = generateRecurringInstances(event, startDate, endDate);
      allEvents.push(...instances);
    } else {
      // Add non-recurring event as-is
      allEvents.push(event);
    }
  });

  return allEvents;
};

// Format recurring pattern for display
export const formatRecurringPattern = (
  pattern: RecurringPattern,
  customRecurring?: CustomRecurring
): string => {
  switch (pattern) {
    case "daily":
      return "Daily";
    case "weekly":
      return "Weekly";
    case "monthly":
      return "Monthly";
    case "yearly":
      return "Yearly";
    case "custom":
      if (customRecurring) {
        const interval = customRecurring.interval;
        const unit = customRecurring.unit;

        // Handle custom recurring with selected days
        if (
          customRecurring.selectedDays &&
          customRecurring.selectedDays.length > 0
        ) {
          const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const selectedDayNames = customRecurring.selectedDays
            .map((day) => dayNames[day])
            .join(", ");

          if (interval === 1) {
            return `Every ${selectedDayNames}`;
          } else {
            return `Every ${interval} weeks on ${selectedDayNames}`;
          }
        }

        return `Every ${interval} ${unit}`;
      }
      return "Custom";
    default:
      return "No repeat";
  }
};

// Check if an event is a recurring instance
export const isRecurringInstance = (event: Event): boolean => {
  return event.originalEventId !== null;
};

// Check if an event should show recurring indicator (original recurring event or recurring instance)
export const shouldShowRecurringIndicator = (event: Event): boolean => {
  return event.isRecurring && event.recurringPattern !== "none";
};

// Get the original event from a recurring instance
export const getOriginalEvent = (
  event: Event,
  allEvents: Event[]
): Event | null => {
  if (!isRecurringInstance(event)) {
    return null;
  }
  return allEvents.find((e) => e.id === event.originalEventId) || null;
};
