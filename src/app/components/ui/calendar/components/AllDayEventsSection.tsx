import { motion } from "framer-motion";
import { Event } from "@/app/schemas/eventSchema";
import { getAllDayEventsForDate } from "./utils/eventUtils";
import { getEventColorClasses } from "./utils/colorUtils";

interface AllDayEventsSectionProps {
  currentDate: Date;
  events: Event[];
  handleEventClick: (event: Event, e: React.MouseEvent) => void;
  createNewEvent: (date: Date, hour?: number) => void;
  isWeekView?: boolean;
  daysOfWeek?: Date[];
}

const AllDayEventsSection = ({
  currentDate,
  events,
  handleEventClick,
  createNewEvent,
  isWeekView = false,
  daysOfWeek = [],
}: AllDayEventsSectionProps) => {
  const allDayEvents = isWeekView
    ? daysOfWeek.map((date) => getAllDayEventsForDate(events, date))
    : [getAllDayEventsForDate(events, currentDate)];

  const hasAnyAllDayEvents = allDayEvents.some(
    (dayEvents) => dayEvents.length > 0
  );

  if (!hasAnyAllDayEvents) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
    >
      <div
        className={`grid ${
          isWeekView
            ? "grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
            : "grid-cols-[auto_1fr]"
        }`}
      >
        {/* All-day label */}
        <div className="border-r p-2 w-16 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center">
            All Day
          </div>
        </div>

        {/* All-day events for each day */}
        {allDayEvents.map((dayEvents, dayIndex) => {
          const date = isWeekView ? daysOfWeek[dayIndex] : currentDate;
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <div
              key={dayIndex}
              className={`border-r p-2 min-h-[60px] dark:border-gray-700 
                ${
                  isToday
                    ? "bg-blue-50 dark:bg-blue-900/30"
                    : "bg-gray-50 dark:bg-gray-900"
                }
                ${isWeekView ? "" : "cursor-pointer"}
                hover:bg-gray-100 dark:hover:bg-gray-800`}
              onClick={() => {
                if (!isWeekView) {
                  createNewEvent(date);
                }
              }}
            >
              <div className="space-y-1">
                {dayEvents.map((event, eventIndex) => {
                  const colorClasses = getEventColorClasses(event.color);

                  return (
                    <motion.div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event, e);
                      }}
                      className={`${colorClasses.bg} rounded p-2 cursor-pointer transition-colors overflow-hidden border-l-4 ${colorClasses.border}`}
                      whileHover={{
                        scale: 1.02,
                        zIndex: 20,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: eventIndex * 0.1 }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${colorClasses.dot}`}
                        ></div>
                        <span
                          className={`text-sm font-medium ${colorClasses.text} truncate`}
                        >
                          {event.title}
                        </span>
                      </div>
                      {event.location && (
                        <div className="text-xs mt-1 text-gray-600 dark:text-gray-300 truncate">
                          📍 {event.location}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AllDayEventsSection;
