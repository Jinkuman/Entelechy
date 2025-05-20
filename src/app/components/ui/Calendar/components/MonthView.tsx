// calendar/components/MonthView.tsx

import { motion } from "framer-motion";
import { Event } from "@/app/schemas/eventSchema";
import { getDaysInMonth, formatEventTime } from "./utils/dateUtils";
import { getEventsForDate } from "./utils/eventUtils";
import { getEventColorClasses } from "./utils/colorUtils";

interface MonthViewProps {
  currentDate: Date;
  events: Event[];
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: "day") => void;
  handleEventClick: (event: Event, e: React.MouseEvent) => void;
}

const MonthView = ({
  currentDate,
  events,
  setCurrentDate,
  setViewMode,
  handleEventClick,
}: MonthViewProps) => {
  const monthViewDays = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  return (
    <motion.div
      key="month-view"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="p-4"
    >
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-800 p-2 text-center font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {monthViewDays.map((dayObj, index) => {
          const dayEvents = getEventsForDate(events, dayObj.date);
          const isToday =
            new Date().toDateString() === dayObj.date.toDateString();

          return (
            <div
              key={index}
              className={`bg-white dark:bg-gray-900 min-h-24 p-1 border-t dark:border-gray-700 ${
                !dayObj.isCurrentMonth
                  ? "text-gray-400 dark:text-gray-600"
                  : "dark:text-gray-300"
              } hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors`}
              onClick={() => {
                setCurrentDate(dayObj.date);
                setViewMode("day");
              }}
            >
              <div className="flex justify-center items-center mb-1">
                <span
                  className={`text-sm inline-flex w-6 h-6 rounded-full items-center justify-center ${
                    isToday ? "bg-blue-500 text-white" : "dark:text-gray-200"
                  }`}
                >
                  {dayObj.date.getDate()}
                </span>
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => {
                  const colorClasses = getEventColorClasses(event.color);

                  return (
                    <motion.div
                      key={event.id}
                      onClick={(e) => handleEventClick(event, e)}
                      className={`${colorClasses.bg} p-1 rounded text-xs cursor-pointer transition-colors truncate`}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${colorClasses.dot}`}
                      ></span>
                      <span className="ml-1">
                        {formatEventTime(event.startTime)} {event.title}
                      </span>
                    </motion.div>
                  );
                })}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 pl-1 text-center">
                    + {dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MonthView;
