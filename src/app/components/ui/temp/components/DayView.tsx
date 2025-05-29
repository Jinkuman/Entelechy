// calendar/components/DayView.tsx

import { motion } from "framer-motion";
import { Event } from "@/app/schemas/eventSchema";
import {
  getTimeSlots,
  getCurrentTimePosition,
  calculateTimePosition,
  formatEventTime,
} from "./utils/dateUtils";
import { getEventsForDate } from "./utils/eventUtils";
import { getEventColorClasses } from "./utils/colorUtils";
import DaySidebar from "./DaySidebar";

interface DayViewProps {
  currentDate: Date;
  events: Event[];
  handleEventClick: (event: Event, e: React.MouseEvent) => void;
  createNewEvent: (date: Date, hour?: number) => void;
}

const DayView = ({
  currentDate,
  events,
  handleEventClick,
  createNewEvent,
}: DayViewProps) => {
  const timeSlots = getTimeSlots();

  return (
    <motion.div
      key="day-view"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-[1fr_auto]"
    >
      <div className="relative">
        <div className="grid grid-cols-[auto_1fr] border-b dark:border-gray-700">
          {/* Empty corner */}
          <div className="border-r p-2 w-16 dark:border-gray-700"></div>

          {/* Day header */}
          <div
            className={`p-2 text-center border-r dark:border-gray-700 ${
              new Date().toDateString() === currentDate.toDateString()
                ? "bg-blue-50 dark:bg-blue-900/30"
                : "dark:bg-gray-800"
            }`}
          >
            <div className="font-medium dark:text-white">
              {new Intl.DateTimeFormat("en-US", {
                weekday: "long",
              }).format(currentDate)}{" "}
              {currentDate.getDate()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr]">
          {/* Time slots */}
          <div className="border-r w-16 dark:border-gray-700">
            {timeSlots.map((time, index) => (
              <div
                key={index}
                className="h-16 border-b text-xs text-gray-500 dark:text-gray-400 text-right pr-2 pt-1 dark:border-gray-700"
              >
                {time}
              </div>
            ))}
          </div>

          {/* Day grid with events */}
          <div className="border-r relative dark:border-gray-700">
            {/* Current time indicator */}
            <div
              className="absolute left-0 right-0 border-t border-red-500 z-10 pointer-events-none flex items-center"
              style={{
                top: `${getCurrentTimePosition()}px`,
              }}
            >
              <div className="w-2 h-2 rounded-full bg-red-500 -ml-1"></div>
            </div>

            {timeSlots.map((_, slotIndex) => (
              <div
                key={slotIndex}
                className="h-16 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() =>
                  createNewEvent(
                    new Date(new Date(currentDate).setHours(slotIndex)),
                    slotIndex
                  )
                }
              ></div>
            ))}

            {/* Events */}
            {getEventsForDate(events, currentDate).map((event) => {
              const startHour = event.startTime.getHours();
              const startMinutes = event.startTime.getMinutes();
              const endHour = event.endTime.getHours();
              const endMinutes = event.endTime.getMinutes();

              const startPosition = calculateTimePosition(
                startHour,
                startMinutes
              );
              const endPosition = calculateTimePosition(endHour, endMinutes);
              const duration = endPosition - startPosition;

              const colorClasses = getEventColorClasses(event.color);

              return (
                <motion.div
                  key={event.id}
                  onClick={(e) => handleEventClick(event, e)}
                  style={{
                    top: `${startPosition}px`,
                    height: `${duration}px`,
                    left: "4px",
                    right: "4px",
                  }}
                  className={`${colorClasses.bg} absolute rounded p-2 cursor-pointer transition-colors overflow-hidden`}
                  whileHover={{
                    scale: 1.01,
                    zIndex: 20,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <motion.span
                      className={`inline-block w-3 h-3 rounded-full ${colorClasses.dot}`}
                      whileHover={{ scale: 1.5 }}
                    ></motion.span>
                    <span
                      className={`text-sm font-medium ${colorClasses.text}`}
                    >
                      {event.title}
                    </span>
                  </div>
                  <div className="text-xs">
                    {formatEventTime(event.startTime)} -{" "}
                    {formatEventTime(event.endTime)}
                  </div>
                  {event.location && (
                    <div className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                      📍 {event.location}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Day view sidebar content */}
      <DaySidebar
        currentDate={currentDate}
        events={events}
        handleEventClick={handleEventClick}
      />
    </motion.div>
  );
};

export default DayView;
