// calendar/components/EventSidebar.tsx

import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { Event } from "@/app/schemas/eventSchema";
import {
  formatEventTime,
  formatDateForInput,
  formatTimeForInput,
} from "./utils/dateUtils";
import { colorOptions, getEventColorClasses } from "./utils/colorUtils";
import { useState } from "react";
import {
  showSuccessToast,
  showErrorToast,
  showDeleteToast,
} from "@/app/components/ui/sonner";

interface EventSidebarProps {
  showEventSidebar: boolean;
  selectedEvent: Event | null;
  editedEvent: Partial<Event> | null;
  setShowEventSidebar: (show: boolean) => void;
  setSelectedEvent: (event: Event | null) => void;
  setEditedEvent: (event: Partial<Event> | null) => void;
  handleFieldChange: (field: string, value: any) => void;
  handleDateTimeChange: (
    field: "startTime" | "endTime",
    type: "date" | "time",
    value: string
  ) => void;
  saveEventChanges: () => void;
  deleteEvent: () => void;
}

const EventSidebar = ({
  showEventSidebar,
  selectedEvent,
  editedEvent,
  setShowEventSidebar,
  setSelectedEvent,
  setEditedEvent,
  handleFieldChange,
  handleDateTimeChange,
  saveEventChanges,
  deleteEvent,
}: EventSidebarProps) => {
  const [isClosing, setIsClosing] = useState(false);

  if (!showEventSidebar || !selectedEvent) return null;

  const handleSave = async () => {
    setIsClosing(true);

    // Show success toast notification using our custom toast
    showSuccessToast("Event Updated", editedEvent?.title as string);

    // Call the save function
    saveEventChanges();

    // Reset state after animation
    setTimeout(() => {
      setIsClosing(false);
    }, 300);
  };

  const handleDelete = async () => {
    setIsClosing(true);

    // Show error toast notification using our custom toast
    showDeleteToast("Event Deleted", selectedEvent.title);

    // Call the delete function
    deleteEvent();

    // Reset state after animation
    setTimeout(() => {
      setIsClosing(false);
    }, 300);
  };

  return (
    <motion.div
      className="fixed top-0 right-0 h-full w-1/3 bg-white dark:bg-gray-800 shadow-xl border-l dark:border-gray-700 p-6 z-40 flex flex-col"
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
      {!editedEvent ? (
        // View Event Mode
        <>
          <div className="flex justify-between items-center mb-6">
            <motion.h2
              className="text-xl font-semibold dark:text-white"
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
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
                whileHover={{
                  scale: 1.1,
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
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
                whileHover={{
                  scale: 1.1,
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
              <h3 className="text-2xl font-bold dark:text-white">
                {selectedEvent.title}
              </h3>

              {/* Color indicator */}
              <div className="mt-2 flex items-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    getEventColorClasses(selectedEvent.color).dot
                  } mr-2`}
                ></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedEvent.allDay
                    ? "All day"
                    : `${formatEventTime(
                        selectedEvent.startTime
                      )} - ${formatEventTime(selectedEvent.endTime)}`}
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400"
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
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400"
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
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400"
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
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </h4>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {selectedEvent.description}
                </p>
              </div>
            )}

            {/* Notes */}
            {selectedEvent.notes && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </h4>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {selectedEvent.notes}
                </p>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-between">
            <motion.button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-800"
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
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
              className="text-xl font-semibold dark:text-white"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Edit Event
            </motion.h2>
            <motion.button
              onClick={() => setShowEventSidebar(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
              whileHover={{
                scale: 1.1,
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Event Title
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter event title"
                value={editedEvent.title || ""}
                onChange={(e) => handleFieldChange("title", e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={3}
                placeholder="Add description"
                value={editedEvent.description || ""}
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
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                checked={editedEvent.allDay || false}
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
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={formatDateForInput(editedEvent.startTime as Date)}
                  onChange={(e) =>
                    handleDateTimeChange("startTime", "date", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Time
                </label>
                <input
                  type="time"
                  className={`w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    editedEvent.allDay
                      ? "bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : ""
                  }`}
                  value={formatTimeForInput(editedEvent.startTime as Date)}
                  onChange={(e) =>
                    handleDateTimeChange("startTime", "time", e.target.value)
                  }
                  disabled={editedEvent.allDay}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={formatDateForInput(editedEvent.endTime as Date)}
                  onChange={(e) =>
                    handleDateTimeChange("endTime", "date", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Time
                </label>
                <input
                  type="time"
                  className={`w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    editedEvent.allDay
                      ? "bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : ""
                  }`}
                  value={formatTimeForInput(editedEvent.endTime as Date)}
                  onChange={(e) =>
                    handleDateTimeChange("endTime", "time", e.target.value)
                  }
                  disabled={editedEvent.allDay}
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
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Add location"
                value={editedEvent.location || ""}
                onChange={(e) => handleFieldChange("location", e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notes
              </label>
              <textarea
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={2}
                placeholder="Add notes"
                value={editedEvent.notes || ""}
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
                        editedEvent.color === color.name
                          ? "0 0 0 2px white"
                          : "none",
                    }}
                  >
                    {editedEvent.color === color.name && (
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
              onClick={() => setEditedEvent(null)}
              className="px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-800"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-800"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Save
            </motion.button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default EventSidebar;
