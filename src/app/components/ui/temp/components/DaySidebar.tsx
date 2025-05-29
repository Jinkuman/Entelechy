import { motion } from "framer-motion";
import { Event } from "@/app/schemas/eventSchema";
import { BellRing, Search, CheckCircle, CalendarIcon } from "lucide-react";
import { formatEventTime } from "./utils/dateUtils";
import { getEventColorClasses } from "./utils/colorUtils";

interface DaySidebarProps {
  currentDate: Date;
  events: Event[];
  handleEventClick: (event: Event, e: React.MouseEvent) => void;
}

const DaySidebar = ({
  currentDate,
  events,
  handleEventClick,
}: DaySidebarProps) => {
  // Mock tasks data for the day view panel
  const tasksData = [
    { id: 1, task: "Review project proposal", completed: true },
    { id: 2, task: "Send weekly report", completed: false },
    { id: 3, task: "Prepare for tomorrow's meeting", completed: false },
    { id: 4, task: "Call client about project status", completed: false },
  ];

  return (
    <div className="w-64 border-l border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {/* Upcoming events preview */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-3">
          <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-3 flex items-center">
            <CalendarIcon
              size={16}
              className="mr-1 text-blue-500 dark:text-blue-400"
            />
            Upcoming Events
          </h3>
          <div className="space-y-2">
            {events
              .filter(
                (event) =>
                  event.startTime > new Date() &&
                  event.startTime.toDateString() === currentDate.toDateString()
              )
              .slice(0, 3)
              .map((event) => {
                const colorClasses = getEventColorClasses(event.color);
                return (
                  <motion.div
                    key={event.id}
                    className={`${colorClasses.bg} p-2 rounded text-xs cursor-pointer`}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                    onClick={(e) => handleEventClick(event, e)}
                  >
                    <div className="flex items-center">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${colorClasses.dot} mr-1`}
                      ></span>
                      <span className={`font-medium ${colorClasses.text}`}>
                        {formatEventTime(event.startTime)}
                      </span>
                    </div>
                    <div className="mt-1">{event.title}</div>
                  </motion.div>
                );
              })}
            {events.filter(
              (event) =>
                event.startTime > new Date() &&
                event.startTime.toDateString() === currentDate.toDateString()
            ).length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No upcoming events for today
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DaySidebar;
