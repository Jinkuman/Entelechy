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
import { getTimedEventsForDate } from "./utils/eventUtils";
import { getEventColorClasses } from "./utils/colorUtils";
import AllDayEventsSection from "./AllDayEventsSection";

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
      <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b dark:border-zinc-700">
        {/* Empty corner */}
        <div className="border-r p-2 w-16 dark:border-zinc-700"></div>

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
              className={`p-2 text-center border-r cursor-pointer transition-colors dark:border-zinc-700 
                ${
                  isToday
                    ? "bg-blue-50 dark:bg-zinc-900/50"
                    : "dark:bg-zinc-800"
                } 
                hover:bg-gray-50 dark:hover:bg-zinc-700`}
              onClick={() => {
                setCurrentDate(date);
                setViewMode("day");
              }}
            >
              <div className="font-medium dark:text-gray-200">
                {dayName} {dayNumber}
              </div>
            </div>
          );
        })}
      </div>

      {/* All-day events section */}
      <AllDayEventsSection
        currentDate={currentDate}
        events={events}
        handleEventClick={handleEventClick}
        createNewEvent={createNewEvent}
        isWeekView={true}
        daysOfWeek={daysOfWeek}
      />

      <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr]">
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

        {/* Week grid with timed events */}
        {daysOfWeek.map((date, dayIndex) => {
          const dayEvents = getTimedEventsForDate(events, date);
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <div
              key={dayIndex}
              className={`border-r relative dark:border-gray-700 
                ${
                  isToday
                    ? "bg-blue-50 dark:bg-zinc-900/50"
                    : "dark:bg-zinc-800"
                }`}
            >
              {timeSlots.map((_, slotIndex) => (
                <div
                  key={slotIndex}
                  className="h-16 border-b hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700 cursor-pointer"
                  onClick={() =>
                    createNewEvent(
                      new Date(new Date(date).setHours(slotIndex)),
                      slotIndex
                    )
                  }
                ></div>
              ))}

              {/* Timed Events */}
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
