// pages/calendar/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CalendarEvent {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  date: Date;
  participants: string[];
  color: string;
}

const CalendarPage = () => {
  const [viewMode, setViewMode] = useState("week"); // "week" or "month"
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [showEventModal, setShowEventModal] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  // Mock events data
  const events = [
    {
      id: 1,
      title: "Team Weekly Sync",
      startTime: "10:00",
      endTime: "11:00",
      date: new Date(2025, 3, 21), // April 21, 2025
      participants: ["Alex", "Sarah"],
      color: "bg-green-500",
    },
    {
      id: 2,
      title: "The Amazing Hubble",
      startTime: "11:00",
      endTime: "12:00",
      date: new Date(2025, 3, 22), // April 22, 2025
      participants: ["Michael", "Emma"],
      color: "bg-blue-500",
    },
    {
      id: 3,
      title: "Choosing A Quality Cookware Set",
      startTime: "13:00",
      endTime: "14:00",
      date: new Date(2025, 3, 22), // April 22, 2025
      participants: ["James", "Emma"],
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "Astronomy Binoculars: A Great Alternative",
      startTime: "15:00",
      endTime: "17:00",
      date: new Date(2025, 3, 22), // April 22, 2025
      participants: ["Sarah", "Michael"],
      color: "bg-pink-500",
    },
    {
      id: 5,
      title: "The Amazing Hubble",
      startTime: "17:00",
      endTime: "19:00",
      date: new Date(2025, 3, 21), // April 21, 2025
      participants: ["Alex", "Emma"],
      color: "bg-blue-500",
    },
    {
      id: 6,
      title: "Shooting Stars",
      startTime: "09:00",
      endTime: "11:00",
      date: new Date(2025, 3, 20), // April 20, 2025
      participants: ["James", "Sarah"],
      color: "bg-green-500",
    },
    {
      id: 7,
      title: "The Universe Through A Child's Eyes",
      startTime: "13:00",
      endTime: "14:00",
      date: new Date(2025, 3, 25), // April 25, 2025
      participants: ["Michael", "Sarah"],
      color: "bg-orange-500",
    },
    {
      id: 8,
      title: "Choosing A Quality Cookware Set",
      startTime: "11:00",
      endTime: "12:30",
      date: new Date(2025, 3, 24), // April 24, 2025
      participants: ["James", "Emma"],
      color: "bg-orange-500",
    },
    {
      id: 9,
      title: "Astronomy Binoculars: A Great Alternative",
      startTime: "13:00",
      endTime: "14:30",
      date: new Date(2025, 3, 23), // April 23, 2025
      participants: ["Alex", "Sarah"],
      color: "bg-yellow-500",
    },
  ];

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  // Get days in month for the calendar
  const getDaysInMonth = (year: any, month: any) => {
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

  // Generate time slots for week view
  const getTimeSlots = () => {
    const slots = [];
    for (let i = 8; i <= 20; i++) {
      slots.push(`${i}:00`);
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
  console.log(
    (new Date().getHours() - 8) * 80 + (new Date().getMinutes() / 60) * 80
  );

  // Format date range for week view header
  const formatDateRange = (days: any) => {
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
      if (viewMode === "month") {
        newDate.setMonth(date.getMonth() + 1);
      } else {
        newDate.setDate(date.getDate() + 7);
      }
      return newDate;
    });
  };

  const goToPreviousPeriod = () => {
    setDirection("prev");
    setCurrentDate((date) => {
      const newDate = new Date(date);
      if (viewMode === "month") {
        newDate.setMonth(date.getMonth() - 1);
      } else {
        newDate.setDate(date.getDate() - 7);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Event handling
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Generate the calendar grid for month view
  const monthViewDays = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  // Generate week view data
  const daysOfWeek = getDaysOfWeek();
  const timeSlots = getTimeSlots();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex items-center gap-4">
          <div className="flex border rounded overflow-hidden">
            <button
              className={`px-4 py-2 ${
                viewMode === "month" ? "bg-gray-100" : "bg-white"
              }`}
              onClick={() => setViewMode("month")}
            >
              <span className="flex items-center gap-2">
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Month
              </span>
            </button>
            <button
              className={`px-4 py-2 ${
                viewMode === "week" ? "bg-gray-100" : "bg-white"
              }`}
              onClick={() => setViewMode("week")}
            >
              <span className="flex items-center gap-2">
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <line x1="3" y1="16" x2="7" y2="16" />
                  <line x1="11" y1="16" x2="15" y2="16" />
                  <line x1="19" y1="16" x2="21" y2="16" />
                </svg>
                Week
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <button
            onClick={goToToday}
            className="px-4 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Today
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousPeriod}
              className="p-1 hover:bg-gray-100 rounded-full"
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
            <span className="text-lg font-medium">
              {viewMode === "month"
                ? formatMonthYear(currentDate)
                : formatDateRange(daysOfWeek)}
            </span>
            <button
              onClick={goToNextPeriod}
              className="p-1 hover:bg-gray-100 rounded-full"
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
          <div className="flex border rounded overflow-hidden">
            <button className="px-3 py-1 text-sm bg-gray-100">Year</button>
            <button className="px-3 py-1 text-sm">Week</button>
            <button className="px-3 py-1 text-sm">Month</button>
            <button className="px-3 py-1 text-sm">Day</button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "month" ? (
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
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span
                          className={`text-sm inline-flex w-6 h-6 rounded-full items-center justify-center ${
                            isToday ? "bg-blue-500 text-white" : ""
                          }`}
                        >
                          {dayObj.date.getDate()}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            onClick={() => handleEventClick(event)}
                            className={`${event.color} bg-opacity-20 p-1 rounded text-xs cursor-pointer hover:bg-opacity-30 transition-colors truncate`}
                          >
                            <span
                              className={`inline-block w-2 h-2 rounded-full ${event.color}`}
                            ></span>
                            <span className="ml-1">
                              {event.startTime} {event.title}
                            </span>
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500 pl-1">
                            + {dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="week-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-8 border-b">
                {/* Empty corner */}
                <div className="border-r p-2"></div>

                {/* Current time, red line */}
                {viewMode === "week" && (
                  <div
                    className="absolute left-0 right-0 border-t border-red-500 z-10 pointer-events-none"
                    style={{
                      top: `${
                        (new Date().getHours() - 8) * 80 +
                        (new Date().getMinutes() / 60) * 80
                      }px`,
                    }}
                  />
                )}

                {/* Day headers */}
                {daysOfWeek.map((date, index) => {
                  const dayName = new Intl.DateTimeFormat("en-US", {
                    weekday: "long",
                  }).format(date);
                  const dayNumber = date.getDate();
                  const isToday =
                    new Date().toDateString() === date.toDateString();

                  return (
                    <div
                      key={index}
                      className={`p-2 text-center border-r ${
                        isToday ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="font-medium">
                        {dayName} {dayNumber}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-8">
                {/* Time slots */}
                <div className="border-r">
                  {timeSlots.map((time, index) => (
                    <div
                      key={index}
                      className="h-20 border-b text-xs text-gray-500 text-right pr-2 pt-1"
                    >
                      {time}
                    </div>
                  ))}
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
                        <div key={slotIndex} className="h-20 border-b"></div>
                      ))}

                      {/* Events */}
                      {dayEvents.map((event) => {
                        const startHour = parseInt(
                          event.startTime.split(":")[0]
                        );
                        const startMinutes =
                          parseInt(event.startTime.split(":")[1]) || 0;
                        const endHour = parseInt(event.endTime.split(":")[0]);
                        const endMinutes =
                          parseInt(event.endTime.split(":")[1]) || 0;

                        const startPosition =
                          (startHour - 8) * 80 + (startMinutes / 60) * 80;
                        const duration =
                          (endHour - startHour) * 80 +
                          ((endMinutes - startMinutes) / 60) * 80;

                        return (
                          <div
                            key={event.id}
                            onClick={() => handleEventClick(event)}
                            style={{
                              top: `${startPosition}px`,
                              height: `${duration}px`,
                              left: "4px",
                              right: "4px",
                            }}
                            className={`${event.color} bg-opacity-20 absolute rounded p-1 cursor-pointer hover:bg-opacity-30 transition-colors overflow-hidden`}
                          >
                            <div className="flex items-center gap-1 mb-1">
                              <span
                                className={`inline-block w-2 h-2 rounded-full ${event.color}`}
                              ></span>
                              <span className="text-xs font-medium">
                                {event.startTime} - {event.endTime}
                              </span>
                            </div>
                            <div className="text-xs font-medium">
                              {event.title}
                            </div>
                            {duration > 40 && (
                              <div className="flex mt-1 gap-1">
                                {event.participants
                                  .slice(0, 2)
                                  .map((participant, index) => (
                                    <div
                                      key={index}
                                      className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs"
                                    >
                                      {participant.charAt(0)}
                                    </div>
                                  ))}
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
        </AnimatePresence>
      </div>

      {/* Add Event button */}
      <div className="mt-4 flex justify-end">
        <button className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-full shadow-sm hover:bg-blue-700">
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
            className="mr-1"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Event
        </button>
      </div>

      {/* Event Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Edit Event</h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-gray-500 hover:text-gray-700"
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={selectedEvent.title}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={`${selectedEvent.date.getFullYear()}-${String(
                      selectedEvent.date.getMonth() + 1
                    ).padStart(2, "0")}-${String(
                      selectedEvent.date.getDate()
                    ).padStart(2, "0")}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={selectedEvent.startTime}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={selectedEvent.endTime}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Participants
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.participants.map((participant, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 rounded-full pl-2 pr-1 py-1"
                    >
                      <span className="text-sm">{participant}</span>
                      <button className="ml-1 text-gray-500 hover:text-gray-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button className="bg-gray-100 rounded-full p-1 hover:bg-gray-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex gap-2">
                  {[
                    "bg-blue-500",
                    "bg-green-500",
                    "bg-purple-500",
                    "bg-pink-500",
                    "bg-yellow-500",
                    "bg-orange-500",
                  ].map((color, index) => (
                    <button
                      key={index}
                      className={`w-6 h-6 rounded-full ${color} ${
                        selectedEvent.color === color
                          ? "ring-2 ring-offset-2"
                          : ""
                      }`}
                    ></button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
