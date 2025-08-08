import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Event } from "@/app/schemas/eventSchema";
import { formatDateForInput, formatTimeForInput } from "./utils/dateUtils";
import { colorOptions } from "./utils/colorUtils";
import { toast } from "sonner";
import { showSuccessToast, showErrorToast } from "@/app/components/ui/sonner";

interface CreateEventSidebarProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  initialDate?: Date;
  initialHour?: number;
  onCreateEvent: (
    event: Omit<Event, "id" | "user_id" | "created_at" | "updated_at">
  ) => Promise<void>;
}

const CreateEventSidebar = ({
  showSidebar,
  setShowSidebar,
  initialDate,
  initialHour,
  onCreateEvent,
}: CreateEventSidebarProps) => {
  // Set default start and end times based on initialDate and initialHour
  const getInitialStartTime = () => {
    const date = initialDate ? new Date(initialDate) : new Date();
    if (initialHour !== undefined) {
      date.setHours(initialHour, 0, 0, 0);
    } else {
      // Round to nearest hour
      date.setMinutes(0, 0, 0);
    }
    return date;
  };

  const getInitialEndTime = () => {
    const date = new Date(getInitialStartTime());
    date.setHours(date.getHours() + 1);
    return date;
  };

  const [newEvent, setNewEvent] = useState<
    Omit<Event, "id" | "user_id" | "created_at" | "updated_at">
  >({
    title: "",
    description: "",
    startTime: getInitialStartTime(),
    endTime: getInitialEndTime(),
    allDay: false,
    location: "",
    notes: "",
    color: "blue",
    is_recurring: false,
    custom_recurring: null,
    recurring_pattern: null,
  });

  // Reset form when sidebar is opened
  useEffect(() => {
    if (showSidebar) {
      setNewEvent({
        title: "",
        description: "",
        startTime: getInitialStartTime(),
        endTime: getInitialEndTime(),
        allDay: false,
        location: "",
        notes: "",
        color: "blue",
        is_recurring: false,
        custom_recurring: null,
        recurring_pattern: null,
      });
      setError(null);
      setIsSubmitting(false);
      setIsClosing(false);
    }
  }, [showSidebar, initialDate, initialHour]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Handle form field changes
  const handleFieldChange = (field: string, value: any) => {
    if (field === "allDay") {
      const isAllDay = value;
      if (isAllDay) {
        // Set start time to beginning of day (00:00)
        const startOfDay = new Date(newEvent.startTime);
        startOfDay.setHours(0, 0, 0, 0);

        // Set end time to end of day (23:59)
        const endOfDay = new Date(newEvent.startTime);
        endOfDay.setHours(23, 59, 0, 0);

        setNewEvent({
          ...newEvent,
          allDay: isAllDay,
          startTime: startOfDay,
          endTime: endOfDay,
        });
      } else {
        // When turning off all-day, set to current time or initial hour
        const newStartTime = getInitialStartTime();
        const newEndTime = getInitialEndTime();

        setNewEvent({
          ...newEvent,
          allDay: isAllDay,
          startTime: newStartTime,
          endTime: newEndTime,
        });
      }
    } else {
      setNewEvent({
        ...newEvent,
        [field]: value,
      });
    }
  };

  // Safely create a date from input values
  const createSafeDate = (
    baseDate: Date,
    type: "date" | "time",
    value: string
  ): Date => {
    const newDate = new Date(baseDate);

    try {
      if (type === "date") {
        const [year, month, day] = value.split("-").map(Number);
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
          throw new Error("Invalid date format");
        }
        newDate.setFullYear(year, month - 1, day);
      } else if (type === "time") {
        const [hours, minutes] = value.split(":").map(Number);
        if (isNaN(hours) || isNaN(minutes)) {
          throw new Error("Invalid time format");
        }
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
          throw new Error("Time out of valid range");
        }
        newDate.setHours(hours, minutes, 0, 0);
      }

      // Validate the date is valid
      if (isNaN(newDate.getTime())) {
        throw new Error("Invalid date");
      }

      return newDate;
    } catch (error) {
      console.error("Error creating date:", error);
      return baseDate; // Return the original date if there's an error
    }
  };

  // Handle date and time changes
  const handleDateTimeChange = (
    field: "startTime" | "endTime",
    type: "date" | "time",
    value: string
  ) => {
    try {
      const currentDate = new Date(newEvent[field]);
      const newDate = createSafeDate(currentDate, type, value);

      // Ensure end time is after start time
      if (field === "endTime" && newDate < newEvent.startTime) {
        // If end time would be before start time, set it to 1 hour after start time
        const adjustedDate = new Date(newEvent.startTime);
        adjustedDate.setHours(adjustedDate.getHours() + 1);
        setNewEvent({
          ...newEvent,
          [field]: adjustedDate,
        });
        setError("End time must be after start time");
        return;
      }

      // If changing start time and it would be after end time, adjust end time
      if (field === "startTime" && newDate > newEvent.endTime) {
        const adjustedEndDate = new Date(newDate);
        adjustedEndDate.setHours(adjustedEndDate.getHours() + 1);

        setNewEvent({
          ...newEvent,
          [field]: newDate,
          endTime: adjustedEndDate,
        });
        return;
      }

      setNewEvent({
        ...newEvent,
        [field]: newDate,
      });

      // Clear error if it was related to time
      if (error && error.includes("time")) {
        setError(null);
      }
    } catch (error) {
      console.error("Error handling date/time change:", error);
      setError("Invalid date or time format");
    }
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form
      if (!newEvent.title.trim()) {
        throw new Error("Event title is required");
      }

      // For all-day events, validate that end date is not before start date
      if (newEvent.allDay) {
        const startDate = new Date(newEvent.startTime);
        const endDate = new Date(newEvent.endTime);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        if (endDate < startDate) {
          throw new Error("End date must be on or after start date");
        }
      } else {
        // For timed events, validate that end time is after start time
        if (newEvent.startTime >= newEvent.endTime) {
          throw new Error("End time must be after start time");
        }
      }

      // Validate dates are valid
      if (
        isNaN(newEvent.startTime.getTime()) ||
        isNaN(newEvent.endTime.getTime())
      ) {
        throw new Error("Invalid date or time");
      }

      console.log("Submitting event:", newEvent);
      await onCreateEvent(newEvent);
      console.log("Event created successfully");

      // Start closing animation
      setIsClosing(true);

      // Reset form
      setTimeout(() => {
        setShowSidebar(false);
        setIsClosing(false);
      }, 300);
    } catch (err) {
      console.error("Error in form submission:", err);
      setError(err instanceof Error ? err.message : "Failed to create event");
      setIsSubmitting(false);
    }
  };

  if (!showSidebar) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 right-0 h-full w-1/3 bg-white dark:bg-zinc-800 shadow-xl border-l dark:border-zinc-700 p-6 z-40 flex flex-col"
        initial={{ x: "100%" }}
        animate={
          isClosing
            ? {
                x: "calc(100vw - 320px)",
                y: "calc(100vh - 100px)",
                scale: 0.3,
                opacity: 0.5,
                borderRadius: "8px",
              }
            : { x: 0, opacity: 1 }
        }
        exit={{ x: "100%" }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: isClosing ? 0.8 : 0.3,
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <motion.h2
            className="text-xl font-semibold dark:text-white"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Create New Event
          </motion.h2>
          <motion.button
            onClick={() => setShowSidebar(false)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
            whileHover={{
              scale: 1.1,
            }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={20} />
          </motion.button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-md border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Event Title */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Event Title{" "}
                <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                rows={3}
                placeholder="Add description"
                value={newEvent.description}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
              ></textarea>
            </div>

            {/* All Day Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allDay"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-zinc-600 rounded dark:bg-zinc-900"
                checked={newEvent.allDay}
                onChange={(e) => handleFieldChange("allDay", e.target.checked)}
              />
              <label
                htmlFor="allDay"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                All day event
              </label>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white"
                  value={formatDateForInput(newEvent.startTime)}
                  onChange={(e) =>
                    handleDateTimeChange("startTime", "date", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Time
                </label>
                <input
                  type="time"
                  className={`w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white ${
                    newEvent.allDay ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  value={formatTimeForInput(newEvent.startTime)}
                  onChange={(e) =>
                    handleDateTimeChange("startTime", "time", e.target.value)
                  }
                  disabled={newEvent.allDay}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white"
                  value={formatDateForInput(newEvent.endTime)}
                  onChange={(e) =>
                    handleDateTimeChange("endTime", "date", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Time
                </label>
                <input
                  type="time"
                  className={`w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white ${
                    newEvent.allDay ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  value={formatTimeForInput(newEvent.endTime)}
                  onChange={(e) =>
                    handleDateTimeChange("endTime", "time", e.target.value)
                  }
                  disabled={newEvent.allDay}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Add location"
                value={newEvent.location || ""}
                onChange={(e) => handleFieldChange("location", e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notes
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                rows={2}
                placeholder="Add notes"
                value={newEvent.notes || ""}
                onChange={(e) => handleFieldChange("notes", e.target.value)}
              ></textarea>
            </div>

            {/* Color Selection */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Color
              </label>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <motion.button
                    type="button"
                    key={color.name}
                    className={`w-8 h-8 rounded-full ${color.dot} relative`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFieldChange("color", color.name)}
                    style={{
                      boxShadow:
                        newEvent.color === color.name
                          ? "0 0 0 2px white, 0 0 0 4px rgba(59, 130, 246, 0.5)"
                          : "none",
                    }}
                  >
                    {newEvent.color === color.name && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Check
                          size={16}
                          className="text-white drop-shadow-md"
                          strokeWidth={3}
                        />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-between">
            <motion.button
              type="button"
              onClick={() => setShowSidebar(false)}
              className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 bg-white dark:bg-zinc-800"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              whileHover={!isSubmitting ? { scale: 1.03 } : {}}
              whileTap={!isSubmitting ? { scale: 0.97 } : {}}
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateEventSidebar;
