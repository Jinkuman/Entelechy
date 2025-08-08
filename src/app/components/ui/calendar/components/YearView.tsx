// calendar/components/YearView.tsx

import { motion } from "framer-motion";
import { Event } from "@/app/schemas/eventSchema";
import {
  getDaysInMonth,
  getMonthsInYear,
  formatMonthYear,
} from "./utils/dateUtils";
import { hasEventsOnDate } from "./utils/eventUtils";

interface YearViewProps {
  currentDate: Date;
  events: Event[];
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: "month") => void;
}

const YearView = ({
  currentDate,
  events,
  setCurrentDate,
  setViewMode,
}: YearViewProps) => {
  const monthsInYear = getMonthsInYear(currentDate);

  return (
    <motion.div
      key="year-view"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="p-4"
    >
      <div className="grid grid-cols-3 gap-4">
        {monthsInYear.map((month, index) => {
          const monthName = new Intl.DateTimeFormat("en-US", {
            month: "long",
          }).format(month);

          const monthDays = getDaysInMonth(currentDate.getFullYear(), index);

          return (
            <motion.div
              key={index}
              className="border dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md dark:hover:shadow-gray-900 transition-shadow cursor-pointer"
              onClick={() => {
                setCurrentDate(month);
                setViewMode("month");
              }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <div className="bg-gray-50 dark:bg-zinc-900/50 p-2 border-b dark:border-zinc-700 text-center font-medium dark:text-white">
                {monthName}
              </div>
              <div className="p-2 dark:bg-zinc-900/50">
                <div className="grid grid-cols-7 gap-1 text-xs text-center">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                    <div key={i} className="text-gray-500 dark:text-gray-400">
                      {day}
                    </div>
                  ))}

                  {monthDays.map((dayObj, i) => {
                    const hasEvents = hasEventsOnDate(events, dayObj.date);

                    return (
                      <motion.div
                        key={i}
                        className={`p-1 relative ${
                          !dayObj.isCurrentMonth
                            ? "text-gray-300 dark:text-gray-600"
                            : "dark:text-gray-300"
                        }`}
                        whileHover={
                          hasEvents && dayObj.isCurrentMonth
                            ? { scale: 1.2 }
                            : {}
                        }
                      >
                        {dayObj.date.getDate()}
                        {hasEvents && dayObj.isCurrentMonth && (
                          <motion.div
                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500 dark:bg-blue-400"
                            initial={{ opacity: 0.8 }}
                            animate={{
                              opacity: [0.5, 1, 0.5],
                              scale: [1, 1.2, 1],
                            }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          ></motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default YearView;
