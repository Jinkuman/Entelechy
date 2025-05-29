// calendar/utils/dateUtils.ts

// Constants for time calculations
export const HOUR_HEIGHT = 64; // Height of one hour slot in pixels
export const HEADER_OFFSET = 64; // Height of header

// Format date as "Month Day" (e.g., "April 21")
export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
  }).format(date);
};

// Format date for month view
export const formatMonthYear = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
};

// Format year for year view
export const formatYear = (date: Date) => {
  return date.getFullYear().toString();
};

// Format date range for week view header
export const formatDateRange = (days: Date[]) => {
  if (days.length === 0) return "";

  const firstDay = days[0];
  const lastDay = days[days.length - 1];

  const firstDate = firstDay.getDate();
  const lastDate = lastDay.getDate();

  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    firstDay
  );
  const year = firstDay.getFullYear();

  if (firstDay.getMonth() === lastDay.getMonth()) {
    return `${month} ${firstDate} - ${lastDate}, ${year}`;
  } else {
    const lastMonth = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(lastDay);
    return `${month} ${firstDate} - ${lastMonth} ${lastDate}, ${year}`;
  }
};

// Format time for display
export const formatEventTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Format date for input fields
export const formatDateForInput = (date: Date) => {
  return date.toISOString().split("T")[0];
};

// Format time for input fields
export const formatTimeForInput = (date: Date) => {
  return date.toTimeString().slice(0, 5);
};

// Get days in month for the calendar
export const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days = [];

  // Get the first day of the month
  const firstDay = new Date(year, month, 1).getDay();

  // Add previous month's days to fill the first week
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isCurrentMonth: false,
    });
  }

  // Add current month's days
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  // Add next month's days to fill the last week
  const lastDay = new Date(year, month, daysInMonth).getDay();
  for (let i = 1; i < 7 - lastDay; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  return days;
};

// Generate time slots for day/week view
export const getTimeSlots = () => {
  const slots = [];
  for (let i = 0; i < 24; i++) {
    slots.push(`${i.toString().padStart(2, "0")}:00`);
  }
  return slots;
};

// Get days of the week for week view
export const getDaysOfWeek = (currentDate: Date) => {
  const days = [];
  const currentDay = currentDate.getDay(); // 0 is Sunday, 6 is Saturday

  // Calculate the first day of the week (Sunday)
  const firstDayOfWeek = new Date(currentDate);
  firstDayOfWeek.setDate(currentDate.getDate() - currentDay);

  // Generate 7 days starting from the first day of the week
  for (let i = 0; i < 7; i++) {
    const day = new Date(firstDayOfWeek);
    day.setDate(firstDayOfWeek.getDate() + i);
    days.push(day);
  }

  return days;
};

// Get months for year view
export const getMonthsInYear = (currentDate: Date) => {
  const months = [];
  for (let i = 0; i < 12; i++) {
    months.push(new Date(currentDate.getFullYear(), i, 1));
  }
  return months;
};

// Calculate position for an event or current time
export const calculateTimePosition = (hours: number, minutes: number) => {
  return (hours + minutes / 60) * HOUR_HEIGHT;
};

// Get current time position for the red line
export const getCurrentTimePosition = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return calculateTimePosition(hours, minutes);
};
