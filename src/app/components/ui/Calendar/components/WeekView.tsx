// calendar/components/WeekView.tsx

import { motion } from "framer-motion";
import { Event } from "@/app/schemas/eventSchema";
import {
  getDaysOfWeek,
  getTimeSlots,
  getCurrentTimePosition,
  calculateTimePosition,
  formatEventTime,
  HEADER_OFFSET,
} from "./utils/dateUtils";
import { getEventsForDate } from "./utils/eventUtils";
import { getEventColorClasses } from "./utils/colorUtils";

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: "day") => void;
  handleEventClick: (event: Event, e: React.MouseEvent) => void;
  createNewEvent: (date: Date, hour?: number) => void;
}

const WeekView = ({
  currentDate,
  events,
  setCurrentDate,
  setViewMode,
  handleEventClick,
  createNewEvent,
}: WeekViewProps) => {
  const daysOfWeek = getDaysOfWeek(currentDate);
  const timeSlots = getTimeSlots();

  return (
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
          const isToday = new Date().toDateString() === date.toDateString();

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

        {/* Week grid with events */}
        {daysOfWeek.map((date, dayIndex) => {
          const dayEvents = getEventsForDate(events, date);
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <div
              key={dayIndex}
              className={`border-r relative ${isToday ? "bg-blue-50" : ""}`}
            >
              {timeSlots.map((_, slotIndex) => (
                <div
                  key={slotIndex}
                  className="h-16 border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    createNewEvent(
                      new Date(new Date(date).setHours(slotIndex)),
                      slotIndex
                    )
                  }
                ></div>
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
                    className={`${colorClasses.bg} absolute rounded p-1 cursor-pointer transition-colors overflow-hidden`}
                    whileHover={{
                      scale: 1.01,
                      zIndex: 20,
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <motion.span
                        className={`inline-block w-2 h-2 rounded-full ${colorClasses.dot}`}
                        whileHover={{ scale: 1.5 }}
                      ></motion.span>
                      <span
                        className={`text-xs font-medium ${colorClasses.text}`}
                      >
                        {event.title}
                      </span>
                    </div>
                    <div className="text-xs">
                      {formatEventTime(event.startTime)} -{" "}
                      {formatEventTime(event.endTime)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default WeekView;
