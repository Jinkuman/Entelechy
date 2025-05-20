// calendar/components/CreateEventSidebar.tsx

import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useState } from "react";
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
    }
    return date;
  };

  const getInitialEndTime = () => {
    const date = getInitialStartTime();
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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Handle form field changes
  const handleFieldChange = (field: string, value: any) => {
    setNewEvent({
      ...newEvent,
      [field]: value,
    });
  };

  // Handle date and time changes
  const handleDateTimeChange = (
    field: "startTime" | "endTime",
    type: "date" | "time",
    value: string
  ) => {
    const currentDate = new Date(newEvent[field]);

    if (type === "date") {
      const [year, month, day] = value.split("-").map(Number);
      currentDate.setFullYear(year, month - 1, day);
    } else if (type === "time") {
      const [hours, minutes] = value.split(":").map(Number);
      currentDate.setHours(hours, minutes);
    }

    setNewEvent({
      ...newEvent,
      [field]: currentDate,
    });
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

      if (newEvent.startTime >= newEvent.endTime) {
        throw new Error("End time must be after start time");
      }

      console.log("Submitting event:", newEvent);
      await onCreateEvent(newEvent);
      console.log("Event created successfully");

      // Start closing animation
      setIsClosing(true);

      // Show toast notification using sonner directly
      showSuccessToast("Event Created", newEvent.title);

      // Reset form
      setTimeout(() => {
        setShowSidebar(false);
        setIsClosing(false);
        setNewEvent({
          title: "",
          description: "",
          startTime: getInitialStartTime(),
          endTime: getInitialEndTime(),
          allDay: false,
          location: "",
          notes: "",
          color: "blue",
        });
      }, 300);
    } catch (err) {
      console.error("Error in form submission:", err);
      setError(err instanceof Error ? err.message : "Failed to create event");
      setIsSubmitting(false);

      // Show error toast
      showErrorToast(
        "Error Creating Event",
        err instanceof Error ? err.message : "Failed to create event"
      );
    }
  };

  if (!showSidebar) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 right-0 h-full w-1/3 bg-white shadow-xl border-l p-6 z-40 flex flex-col"
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
            className="text-xl font-semibold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Create New Event
          </motion.h2>
          <motion.button
            onClick={() => setShowSidebar(false)}
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

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                required
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
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={newEvent.allDay}
                onChange={(e) => handleFieldChange("allDay", e.target.checked)}
              />
              <label
                htmlFor="allDay"
                className="ml-2 block text-sm text-gray-700"
              >
                All day event
              </label>
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
                  value={formatDateForInput(newEvent.startTime)}
                  onChange={(e) =>
                    handleDateTimeChange("startTime", "date", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="time"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    newEvent.allDay
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : ""
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
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formatDateForInput(newEvent.endTime)}
                  onChange={(e) =>
                    handleDateTimeChange("endTime", "date", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="time"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    newEvent.allDay
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : ""
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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add location"
                value={newEvent.location || ""}
                onChange={(e) => handleFieldChange("location", e.target.value)}
              />
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
                value={newEvent.notes || ""}
                onChange={(e) => handleFieldChange("notes", e.target.value)}
              ></textarea>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
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
                          ? "0 0 0 2px black"
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
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
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
