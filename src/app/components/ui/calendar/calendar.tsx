// calendar/calendar.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ViewMode, NavigationDirection } from "./components/types";
import { Event } from "@/app/schemas/eventSchema";

// Import components
import CalendarHeader from "./components/CalendarHeader";
import YearView from "./components/YearView";
import MonthView from "./components/MonthView";
import WeekView from "./components/WeekView";
import DayView from "./components/DayView";
import EventSidebar from "./components/eventSidebar";
import CreateEventSidebar from "./components/CreateEventSidebar";

// Import utilities
import {
  formatDate,
  formatMonthYear,
  formatYear,
  formatDateRange,
  getDaysOfWeek,
} from "./components/utils/dateUtils";

interface CalendarProps {
  events: Event[];
  onAddEvent?: (
    newEvent: Omit<Event, "id" | "user_id" | "created_at" | "updated_at">
  ) => void;
  onUpdateEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: string) => void;
  openCreateSidebarRef?: React.RefObject<() => void>;
}

const Calendar = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  openCreateSidebarRef,
}: CalendarProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventSidebar, setShowEventSidebar] = useState(false);
  const [showCreateSidebar, setShowCreateSidebar] = useState(false);
  const [direction, setDirection] = useState<NavigationDirection>("next");
  const [editedEvent, setEditedEvent] = useState<Partial<Event> | null>(null);
  const [newEventDate, setNewEventDate] = useState<Date | undefined>(undefined);
  const [newEventHour, setNewEventHour] = useState<number | undefined>(
    undefined
  );
  console.log("Calendar component rendering");

  // Expose the openCreateSidebar function to the parent component
  useEffect(() => {
    if (openCreateSidebarRef && openCreateSidebarRef.current !== undefined) {
      openCreateSidebarRef.current = () => {
        setNewEventDate(new Date());
        setShowCreateSidebar(true);
      };
    }
  }, [openCreateSidebarRef]);

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

  // Create new event at specific time
  const createNewEvent = (date: Date, hour?: number) => {
    setNewEventDate(date);
    if (hour !== undefined) setNewEventHour(hour);
    setShowCreateSidebar(true);
  };

  // Handle form field changes
  const handleFieldChange = (field: string, value: any) => {
    if (editedEvent) {
      if (field === "allDay") {
        const isAllDay = value;
        if (isAllDay) {
          // Set start time to beginning of day (00:00)
          const startOfDay = new Date(editedEvent.startTime as Date);
          startOfDay.setHours(0, 0, 0, 0);

          // Set end time to end of day (23:59)
          const endOfDay = new Date(editedEvent.startTime as Date);
          endOfDay.setHours(23, 59, 0, 0);

          setEditedEvent({
            ...editedEvent,
            allDay: isAllDay,
            startTime: startOfDay,
            endTime: endOfDay,
          });
        } else {
          // When turning off all-day, set to current time
          const currentTime = new Date();
          const newStartTime = new Date(editedEvent.startTime as Date);
          newStartTime.setHours(
            currentTime.getHours(),
            currentTime.getMinutes(),
            0,
            0
          );

          const newEndTime = new Date(newStartTime);
          newEndTime.setHours(newStartTime.getHours() + 1);

          setEditedEvent({
            ...editedEvent,
            allDay: isAllDay,
            startTime: newStartTime,
            endTime: newEndTime,
          });
        }
      } else {
        setEditedEvent({
          ...editedEvent,
          [field]: value,
        });
      }
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
  const saveEventChanges = async () => {
    if (editedEvent && onUpdateEvent && editedEvent.id) {
      onUpdateEvent(editedEvent as Event);
      setShowEventSidebar(false);
      setSelectedEvent(null);
      setEditedEvent(null);
    }
  };

  // Delete event
  const deleteEvent = async () => {
    if (selectedEvent && onDeleteEvent) {
      onDeleteEvent(selectedEvent.id);
      setShowEventSidebar(false);
      setSelectedEvent(null);
      setEditedEvent(null);
    }
  };

  // Handle creating a new event
  const handleCreateEvent = async (
    newEvent: Omit<Event, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    try {
      console.log("Calendar component creating new event:", newEvent);

      // Call the onAddEvent callback if provided
      if (onAddEvent) {
        await onAddEvent(newEvent);
        console.log("Event created successfully via onAddEvent");
      } else {
        console.log("No onAddEvent handler provided");
      }

      // Reset state and close sidebar
      setNewEventDate(undefined);
      setNewEventHour(undefined);
      setShowCreateSidebar(false);

      return Promise.resolve();
    } catch (err) {
      console.error("Error in handleCreateEvent:", err);
      // Re-throw the error so it can be caught by the form's error handler
      throw err;
    }
  };

  // Determine header text based on view mode
  const getHeaderText = () => {
    if (viewMode === "day") {
      return formatDate(currentDate);
    } else if (viewMode === "week") {
      return formatDateRange(getDaysOfWeek(currentDate));
    } else if (viewMode === "month") {
      return formatMonthYear(currentDate);
    } else if (viewMode === "year") {
      return formatYear(currentDate);
    }
    return "";
  };

  return (
    <div className="bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg shadow-sm">
      <CalendarHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        headerText={getHeaderText()}
        goToToday={goToToday}
        goToNextPeriod={goToNextPeriod}
        goToPreviousPeriod={goToPreviousPeriod}
      />

      <AnimatePresence mode="wait">
        {viewMode === "year" && (
          <YearView
            currentDate={currentDate}
            events={events}
            setCurrentDate={setCurrentDate}
            setViewMode={setViewMode}
          />
        )}

        {viewMode === "month" && (
          <MonthView
            currentDate={currentDate}
            events={events}
            setCurrentDate={setCurrentDate}
            setViewMode={setViewMode}
            handleEventClick={handleEventClick}
          />
        )}

        {viewMode === "week" && (
          <WeekView
            currentDate={currentDate}
            events={events}
            setCurrentDate={setCurrentDate}
            setViewMode={setViewMode}
            handleEventClick={handleEventClick}
            createNewEvent={createNewEvent}
          />
        )}

        {viewMode === "day" && (
          <DayView
            currentDate={currentDate}
            events={events}
            handleEventClick={handleEventClick}
            createNewEvent={createNewEvent}
          />
        )}
      </AnimatePresence>

      {/* Event Sidebar */}
      <AnimatePresence>
        {showEventSidebar && selectedEvent && (
          <EventSidebar
            showEventSidebar={showEventSidebar}
            selectedEvent={selectedEvent}
            editedEvent={editedEvent}
            setShowEventSidebar={setShowEventSidebar}
            setSelectedEvent={setSelectedEvent}
            setEditedEvent={setEditedEvent}
            handleFieldChange={handleFieldChange}
            handleDateTimeChange={handleDateTimeChange}
            saveEventChanges={saveEventChanges}
            deleteEvent={deleteEvent}
          />
        )}
      </AnimatePresence>

      {/* Create Event Sidebar */}
      <AnimatePresence>
        {showCreateSidebar && (
          <CreateEventSidebar
            showSidebar={showCreateSidebar}
            setShowSidebar={setShowCreateSidebar}
            initialDate={newEventDate}
            initialHour={newEventHour}
            onCreateEvent={handleCreateEvent}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
