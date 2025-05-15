// components/Calendar/Calendar.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Event } from "@/app/schemas/eventSchema"; // Adjust the import path as needed
import { X } from "lucide-react"; // Import X icon from lucide-react

interface CalendarProps {
  events: Event[];
  onAddEvent?: () => void;
  onUpdateEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: number) => void;
}

// Color options for events
const colorOptions = [
  {
    name: "blue",
    bg: "bg-blue-100",
    dot: "bg-blue-500",
    text: "text-blue-800",
  },
  {
    name: "green",
    bg: "bg-green-100",
    dot: "bg-green-500",
    text: "text-green-800",
  },
  {
    name: "purple",
    bg: "bg-purple-100",
    dot: "bg-purple-500",
    text: "text-purple-800",
  },
  {
    name: "pink",
    bg: "bg-pink-100",
    dot: "bg-pink-500",
    text: "text-pink-800",
  },
  {
    name: "yellow",
    bg: "bg-yellow-100",
    dot: "bg-yellow-500",
    text: "text-yellow-800",
  },
  {
    name: "orange",
    bg: "bg-orange-100",
    dot: "bg-orange-500",
    text: "text-orange-800",
  },
  { name: "red", bg: "bg-red-100", dot: "bg-red-500", text: "text-red-800" },
  {
    name: "indigo",
    bg: "bg-indigo-100",
    dot: "bg-indigo-500",
    text: "text-indigo-800",
  },
];

const Calendar = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
}: CalendarProps) => {
  const [viewMode, setViewMode] = useState<"day" | "week" | "month" | "year">(
    "week"
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventSidebar, setShowEventSidebar] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [editedEvent, setEditedEvent] = useState<Partial<Event> | null>(null);

  // Constants for time calculations
  const HOUR_HEIGHT = 64; // Height of one hour slot in pixels
  const HEADER_OFFSET = 64; // Height of header

  // Get color classes for an event
  const getEventColorClasses = (colorName: string) => {
    const color =
      colorOptions.find((c) => c.name === colorName) || colorOptions[0];
    return {
      bg: color.bg,
      dot: color.dot,
      text: color.text,
    };
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(
      (event) =>
        event.startTime.getDate() === date.getDate() &&
        event.startTime.getMonth() === date.getMonth() &&
        event.startTime.getFullYear() === date.getFullYear()
    );
  };

  // Check if a date has any events (for year view)
  const hasEventsOnDate = (date: Date) => {
    return events.some(
      (event) =>
        event.startTime.getDate() === date.getDate() &&
        event.startTime.getMonth() === date.getMonth() &&
        event.startTime.getFullYear() === date.getFullYear()
    );
  };

  // Get days in month for the calendar
  const getDaysInMonth = (year: number, month: number) => {
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
  const getTimeSlots = () => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      slots.push(`${i.toString().padStart(2, "0")}:00`);
    }
    return slots;
  };

  // Get days of the week for week view
  const getDaysOfWeek = () => {
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
  const getMonthsInYear = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push(new Date(currentDate.getFullYear(), i, 1));
    }
    return months;
  };

  // Format date as "Month Day" (e.g., "April 21")
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Format date for month view
  const formatMonthYear = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // Format year for year view
  const formatYear = (date: Date) => {
    return date.getFullYear().toString();
  };

  // Format date range for week view header
  const formatDateRange = (days: Date[]) => {
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

  // Navigation functions
  const goToNextPeriod = () => {
    setDirection("next");
    setCurrentDate((date) => {
      const newDate = new Date(date);
      if (viewMode === "day") {
        newDate.setDate(date.getDate() + 1);
      } else if (viewMode === "week") {
        newDate.setDate(date.getDate() + 7);
      } else if (viewMode === "month") {
        newDate.setMonth(date.getMonth() + 1);
      } else if (viewMode === "year") {
        newDate.setFullYear(date.getFullYear() + 1);
      }
      return newDate;
    });
  };

  const goToPreviousPeriod = () => {
    setDirection("prev");
    setCurrentDate((date) => {
      const newDate = new Date(date);
      if (viewMode === "day") {
        newDate.setDate(date.getDate() - 1);
      } else if (viewMode === "week") {
        newDate.setDate(date.getDate() - 7);
      } else if (viewMode === "month") {
        newDate.setMonth(date.getMonth() - 1);
      } else if (viewMode === "year") {
        newDate.setFullYear(date.getFullYear() - 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Event handling
  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setEditedEvent(null); // Start in view mode, not edit mode
    setShowEventSidebar(true);
  };

  // Format time for display
  const formatEventTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date for input fields
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  // Format time for input fields
  const formatTimeForInput = (date: Date) => {
    return date.toTimeString().slice(0, 5);
  };

  // Handle form field changes
  const handleFieldChange = (field: string, value: any) => {
    if (editedEvent) {
      setEditedEvent({
        ...editedEvent,
        [field]: value,
      });
    }
  };

  // Handle date and time changes
  const handleDateTimeChange = (
    field: "startTime" | "endTime",
    type: "date" | "time",
    value: string
  ) => {
    if (editedEvent) {
      const currentDate = new Date(editedEvent[field] as Date);

      if (type === "date") {
        const [year, month, day] = value.split("-").map(Number);
        currentDate.setFullYear(year, month - 1, day);
      } else if (type === "time") {
        const [hours, minutes] = value.split(":").map(Number);
        currentDate.setHours(hours, minutes);
      }

      setEditedEvent({
        ...editedEvent,
        [field]: currentDate,
      });
    }
  };

  // Save event changes
  const saveEventChanges = () => {
    if (editedEvent && onUpdateEvent && editedEvent.id) {
      onUpdateEvent(editedEvent as Event);
    }
    setShowEventSidebar(false);
    setSelectedEvent(null);
    setEditedEvent(null);
  };

  // Delete event
  const deleteEvent = () => {
    if (selectedEvent && onDeleteEvent) {
      onDeleteEvent(selectedEvent.id);
    }
    setShowEventSidebar(false);
    setSelectedEvent(null);
    setEditedEvent(null);
  };

  // Generate the calendar grid for month view
  const monthViewDays = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  // Generate week view data
  const daysOfWeek = getDaysOfWeek();
  const timeSlots = getTimeSlots();

  // Get months for year view
  const monthsInYear = getMonthsInYear();

  // Calculate position for an event or current time
  const calculateTimePosition = (hours: number, minutes: number) => {
    return (hours + minutes / 60) * HOUR_HEIGHT;
  };

  // Get current time position for the red line
  const getCurrentTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return calculateTimePosition(hours, minutes);
  };

  // Determine header text based on view mode
  const getHeaderText = () => {
    if (viewMode === "day") {
      return formatDate(currentDate);
    } else if (viewMode === "week") {
      return formatDateRange(daysOfWeek);
    } else if (viewMode === "month") {
      return formatMonthYear(currentDate);
    } else if (viewMode === "year") {
      return formatYear(currentDate);
    }
    return "";
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-4 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Today
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousPeriod}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="text-lg font-medium text-center w-64">
              {getHeaderText()}
            </span>
            <button
              onClick={goToNextPeriod}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex border rounded overflow-hidden">
          <button
            className={`px-3 py-1 text-sm ${
              viewMode === "year" ? "bg-gray-100" : ""
            }`}
            onClick={() => setViewMode("year")}
          >
            Year
          </button>
          <button
            className={`px-3 py-1 text-sm ${
              viewMode === "month" ? "bg-gray-100" : ""
            }`}
            onClick={() => setViewMode("month")}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 text-sm ${
              viewMode === "week" ? "bg-gray-100" : ""
            }`}
            onClick={() => setViewMode("week")}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 text-sm ${
              viewMode === "day" ? "bg-gray-100" : ""
            }`}
            onClick={() => setViewMode("day")}
          >
            Day
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "year" && (
          <motion.div
            key="year-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-4"
          >
            <div className="grid grid-cols-3 gap-4">
              {monthsInYear.map((month, index) => {
                const monthName = new Intl.DateTimeFormat("en-US", {
                  month: "long",
                }).format(month);

                const monthDays = getDaysInMonth(
                  currentDate.getFullYear(),
                  index
                );

                return (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setCurrentDate(month);
                      setViewMode("month");
                    }}
                  >
                    <div className="bg-gray-50 p-2 border-b text-center font-medium">
                      {monthName}
                    </div>
                    <div className="p-2">
                      <div className="grid grid-cols-7 gap-1 text-xs text-center">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                          <div key={i} className="text-gray-500">
                            {day}
                          </div>
                        ))}

                        {monthDays.map((dayObj, i) => {
                          const hasEvents = hasEventsOnDate(dayObj.date);

                          return (
                            <div
                              key={i}
                              className={`p-1 relative ${
                                !dayObj.isCurrentMonth ? "text-gray-300" : ""
                              }`}
                            >
                              {dayObj.date.getDate()}
                              {hasEvents && dayObj.isCurrentMonth && (
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500"></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {viewMode === "month" && (
          <motion.div
            key="month-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-4"
          >
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {/* Day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-2 text-center font-medium text-gray-500"
                  >
                    {day}
                  </div>
                )
              )}

              {/* Calendar days */}
              {monthViewDays.map((dayObj, index) => {
                const dayEvents = getEventsForDate(dayObj.date);
                const isToday =
                  new Date().toDateString() === dayObj.date.toDateString();

                return (
                  <div
                    key={index}
                    className={`bg-white min-h-24 p-1 border-t ${
                      !dayObj.isCurrentMonth ? "text-gray-400" : ""
                    } hover:bg-gray-50 cursor-pointer transition-colors`}
                    onClick={() => {
                      setCurrentDate(dayObj.date);
                      setViewMode("day");
                    }}
                  >
                    <div className="flex justify-center items-center mb-1">
                      <span
                        className={`text-sm inline-flex w-6 h-6 rounded-full items-center justify-center ${
                          isToday ? "bg-blue-500 text-white" : ""
                        }`}
                      >
                        {dayObj.date.getDate()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => {
                        const colorClasses = getEventColorClasses(event.color);

                        return (
                          <div
                            key={event.id}
                            onClick={(e) => handleEventClick(event, e)}
                            className={`${colorClasses.bg} p-1 rounded text-xs cursor-pointer hover:bg-opacity-80 transition-colors truncate`}
                          >
                            <span
                              className={`inline-block w-2 h-2 rounded-full ${colorClasses.dot}`}
                            ></span>
                            <span className="ml-1">
                              {formatEventTime(event.startTime)} {event.title}
                            </span>
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500 pl-1 text-center">
                          + {dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {viewMode === "week" && (
          <motion.div
            key="week-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b">
              {/* Empty corner */}
              <div className="border-r p-2 w-16"></div>

              {/* Day headers */}
              {daysOfWeek.map((date, index) => {
                const dayName = new Intl.DateTimeFormat("en-US", {
                  weekday: "short",
                }).format(date);
                const dayNumber = date.getDate();
                const isToday =
                  new Date().toDateString() === date.toDateString();

                return (
                  <div
                    key={index}
                    className={`p-2 text-center border-r cursor-pointer hover:bg-gray-50 transition-colors ${
                      isToday ? "bg-blue-50" : ""
                    }`}
                    onClick={() => {
                      setCurrentDate(date);
                      setViewMode("day");
                    }}
                  >
                    <div className="font-medium">
                      {dayName} {dayNumber}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr]">
              {/* Time slots */}
              <div className="border-r w-16">
                {timeSlots.map((time, index) => (
                  <div
                    key={index}
                    className="h-16 border-b text-xs text-gray-500 text-right pr-2 pt-1"
                  >
                    {time}
                  </div>
                ))}
              </div>

              {/* Current time indicator */}
              <div
                className="absolute left-0 right-0 border-t border-red-500 z-10 pointer-events-none flex items-center"
                style={{
                  top: `${getCurrentTimePosition()}px`,
                  transform: `translateY(${HEADER_OFFSET}px)`,
                }}
              >
                <div className="w-2 h-2 rounded-full bg-red-500 -ml-1"></div>
              </div>

              {/* Week grid with events */}
              {daysOfWeek.map((date, dayIndex) => {
                const dayEvents = getEventsForDate(date);
                const isToday =
                  new Date().toDateString() === date.toDateString();

                return (
                  <div
                    key={dayIndex}
                    className={`border-r relative ${
                      isToday ? "bg-blue-50" : ""
                    }`}
                  >
                    {timeSlots.map((_, slotIndex) => (
                      <div key={slotIndex} className="h-16 border-b"></div>
                    ))}

                    {/* Events */}
                    {dayEvents.map((event) => {
                      const startHour = event.startTime.getHours();
                      const startMinutes = event.startTime.getMinutes();
                      const endHour = event.endTime.getHours();
                      const endMinutes = event.endTime.getMinutes();

                      const startPosition = calculateTimePosition(
                        startHour,
                        startMinutes
                      );
                      const endPosition = calculateTimePosition(
                        endHour,
                        endMinutes
                      );
                      const duration = endPosition - startPosition;

                      const colorClasses = getEventColorClasses(event.color);

                      return (
                        <div
                          key={event.id}
                          onClick={(e) => handleEventClick(event, e)}
                          style={{
                            top: `${startPosition}px`,
                            height: `${duration}px`,
                            left: "4px",
                            right: "4px",
                          }}
                          className={`${colorClasses.bg} absolute rounded p-1 cursor-pointer hover:bg-opacity-80 transition-colors overflow-hidden`}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <span
                              className={`inline-block w-2 h-2 rounded-full ${colorClasses.dot}`}
                            ></span>
                            <span className="text-xs font-medium">
                              {formatEventTime(event.startTime)} -{" "}
                              {formatEventTime(event.endTime)}
                            </span>
                          </div>
                          <div className="text-xs font-medium">
                            {event.title}
                          </div>
                          {duration > 40 && event.location && (
                            <div className="text-xs text-gray-600 mt-1">
                              📍 {event.location}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {viewMode === "day" && (
          <motion.div
            key="day-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-[auto_1fr] border-b">
              {/* Empty corner */}
              <div className="border-r p-2 w-16"></div>

              {/* Day header */}
              <div className="p-2 text-center border-r">
                <div className="font-medium">
                  {new Intl.DateTimeFormat("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  }).format(currentDate)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[auto_1fr]">
              {/* Time slots */}
              <div className="border-r w-16">
                {timeSlots.map((time, index) => (
                  <div
                    key={index}
                    className="h-16 border-b text-xs text-gray-500 text-right pr-2 pt-1"
                  >
                    {time}
                  </div>
                ))}
              </div>

              {/* Current time indicator */}
              <div
                className="absolute left-0 right-0 border-t border-red-500 z-10 pointer-events-none flex items-center"
                style={{
                  top: `${getCurrentTimePosition()}px`,
                  transform: `translateY(${HEADER_OFFSET}px)`,
                }}
              >
                <div className="w-2 h-2 rounded-full bg-red-500 -ml-1"></div>
              </div>

              {/* Day grid with events */}
              <div className="relative">
                {timeSlots.map((_, slotIndex) => (
                  <div key={slotIndex} className="h-16 border-b"></div>
                ))}

                {/* Events */}
                {getEventsForDate(currentDate).map((event) => {
                  const startHour = event.startTime.getHours();
                  const startMinutes = event.startTime.getMinutes();
                  const endHour = event.endTime.getHours();
                  const endMinutes = event.endTime.getMinutes();

                  const startPosition = calculateTimePosition(
                    startHour,
                    startMinutes
                  );
                  const endPosition = calculateTimePosition(
                    endHour,
                    endMinutes
                  );
                  const duration = endPosition - startPosition;

                  const colorClasses = getEventColorClasses(event.color);

                  return (
                    <div
                      key={event.id}
                      onClick={(e) => handleEventClick(event, e)}
                      style={{
                        top: `${startPosition}px`,
                        height: `${duration}px`,
                        left: "4px",
                        right: "4px",
                      }}
                      className={`${colorClasses.bg} absolute rounded p-2 cursor-pointer hover:bg-opacity-80 transition-colors overflow-hidden`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${colorClasses.dot}`}
                        ></span>
                        <span className="text-xs font-medium">
                          {formatEventTime(event.startTime)} -{" "}
                          {formatEventTime(event.endTime)}
                        </span>
                      </div>
                      <div className="font-medium">{event.title}</div>
                      {duration > 60 && (
                        <>
                          {event.description && (
                            <div className="text-sm text-gray-600 mt-2">
                              {event.description}
                            </div>
                          )}
                          {event.location && (
                            <div className="text-sm text-gray-600 mt-2">
                              📍 {event.location}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Sidebar */}
      <AnimatePresence>
        {showEventSidebar && selectedEvent && (
          <motion.div
            className="fixed top-0 right-0 h-full w-1/3 bg-white shadow-xl border-l p-6 z-40 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {!editedEvent ? (
              // View Event Mode
              <>
                <div className="flex justify-between items-center mb-6">
                  <motion.h2
                    className="text-xl font-semibold"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Event Details
                  </motion.h2>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() =>
                        setEditedEvent({
                          ...selectedEvent,
                          startTime: new Date(selectedEvent.startTime),
                          endTime: new Date(selectedEvent.endTime),
                        })
                      }
                      className="p-2 rounded-full hover:bg-gray-100"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(243, 244, 246, 1)",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </motion.button>
                    <motion.button
                      onClick={() => setShowEventSidebar(false)}
                      className="p-2 rounded-full hover:bg-gray-100"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(243, 244, 246, 1)",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X size={20} />
                    </motion.button>
                  </div>
                </div>

                <motion.div
                  className="space-y-6 overflow-y-auto flex-grow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Event Title */}
                  <div>
                    <h3 className="text-2xl font-bold">
                      {selectedEvent.title}
                    </h3>

                    {/* Color indicator */}
                    <div className="mt-2 flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          getEventColorClasses(selectedEvent.color).dot
                        } mr-2`}
                      ></div>
                      <span className="text-sm text-gray-500">
                        {selectedEvent.allDay
                          ? "All day"
                          : `${formatEventTime(
                              selectedEvent.startTime
                            )} - ${formatEventTime(selectedEvent.endTime)}`}
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      {new Intl.DateTimeFormat("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }).format(selectedEvent.startTime)}
                    </span>
                  </div>

                  {/* Time */}
                  {!selectedEvent.allDay && (
                    <div className="flex items-center text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        {formatEventTime(selectedEvent.startTime)} -{" "}
                        {formatEventTime(selectedEvent.endTime)}
                      </span>
                    </div>
                  )}

                  {/* Location */}
                  {selectedEvent.location && (
                    <div className="flex items-center text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}

                  {/* Description */}
                  {selectedEvent.description && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Description
                      </h4>
                      <p className="text-gray-700 whitespace-pre-line">
                        {selectedEvent.description}
                      </p>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedEvent.notes && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </h4>
                      <p className="text-gray-700 whitespace-pre-line">
                        {selectedEvent.notes}
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-between">
                  <motion.button
                    onClick={() => {
                      if (onDeleteEvent) onDeleteEvent(selectedEvent.id);
                      setShowEventSidebar(false);
                    }}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Delete
                  </motion.button>
                  <motion.button
                    onClick={() =>
                      setEditedEvent({
                        ...selectedEvent,
                        startTime: new Date(selectedEvent.startTime),
                        endTime: new Date(selectedEvent.endTime),
                      })
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Edit
                  </motion.button>
                </div>
              </>
            ) : (
              // Edit Event Mode
              <>
                <div className="flex justify-between items-center mb-6">
                  <motion.h2
                    className="text-xl font-semibold"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Edit Event
                  </motion.h2>
                  <motion.button
                    onClick={() => setShowEventSidebar(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(243, 244, 246, 1)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <motion.div
                  className="space-y-6 overflow-y-auto flex-grow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Event Title */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Event Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter event title"
                      value={editedEvent.title || ""}
                      onChange={(e) =>
                        handleFieldChange("title", e.target.value)
                      }
                    />
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formatDateForInput(
                          editedEvent.startTime as Date
                        )}
                        onChange={(e) =>
                          handleDateTimeChange(
                            "startTime",
                            "date",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Start Time
                      </label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formatTimeForInput(
                          editedEvent.startTime as Date
                        )}
                        onChange={(e) =>
                          handleDateTimeChange(
                            "startTime",
                            "time",
                            e.target.value
                          )
                        }
                        disabled={editedEvent.allDay}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        End Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formatDateForInput(editedEvent.endTime as Date)}
                        onChange={(e) =>
                          handleDateTimeChange(
                            "endTime",
                            "date",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        End Time
                      </label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formatTimeForInput(editedEvent.endTime as Date)}
                        onChange={(e) =>
                          handleDateTimeChange(
                            "endTime",
                            "time",
                            e.target.value
                          )
                        }
                        disabled={editedEvent.allDay}
                      />
                    </div>
                  </div>

                  {/* All Day Toggle */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allDay"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={editedEvent.allDay || false}
                      onChange={(e) =>
                        handleFieldChange("allDay", e.target.checked)
                      }
                    />
                    <label
                      htmlFor="allDay"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      All day event
                    </label>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add location"
                      value={editedEvent.location || ""}
                      onChange={(e) =>
                        handleFieldChange("location", e.target.value)
                      }
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Add description"
                      value={editedEvent.description || ""}
                      onChange={(e) =>
                        handleFieldChange("description", e.target.value)
                      }
                    ></textarea>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Add notes"
                      value={editedEvent.notes || ""}
                      onChange={(e) =>
                        handleFieldChange("notes", e.target.value)
                      }
                    ></textarea>
                  </div>

                  {/* Color Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.name}
                          className={`w-8 h-8 rounded-full ${color.dot} ${
                            editedEvent.color === color.name
                              ? "ring-2 ring-offset-2 ring-gray-400"
                              : ""
                          }`}
                          onClick={() => handleFieldChange("color", color.name)}
                        ></button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-between">
                  <motion.button
                    onClick={() => setEditedEvent(null)}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={saveEventChanges}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Save
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
