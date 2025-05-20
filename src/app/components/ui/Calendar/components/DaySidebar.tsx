// calendar/components/DaySidebar.tsx

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
    <div className="w-64 border-l p-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {/* Tasks widget */}
        <div className="bg-white rounded-lg shadow-sm p-3">
          <h3 className="font-medium text-gray-800 mb-3 flex items-center">
            <CheckCircle size={16} className="mr-1 text-green-500" />
            Tasks for Today
          </h3>
          <div className="space-y-2">
            {tasksData.map((task) => (
              <motion.div
                key={task.id}
                className="flex items-center gap-2 text-sm"
                whileHover={{ x: 5 }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span
                  className={task.completed ? "line-through text-gray-400" : ""}
                >
                  {task.task}
                </span>
              </motion.div>
            ))}
            <div className="pt-2">
              <button className="text-blue-500 text-sm flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add task
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming events preview */}
        <div className="bg-white rounded-lg shadow-sm p-3">
          <h3 className="font-medium text-gray-800 mb-3 flex items-center">
            <CalendarIcon size={16} className="mr-1 text-blue-500" />
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
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-2 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search events..."
              className="pl-8 pr-3 py-2 w-full border rounded text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Reminders */}
        <div className="bg-white rounded-lg shadow-sm p-3">
          <h3 className="font-medium text-gray-800 mb-2 flex items-center">
            <BellRing size={16} className="mr-1 text-orange-500" />
            Reminders
          </h3>
          <div className="text-sm text-gray-600">
            <p>No reminders for today</p>
            <button className="text-blue-500 text-sm mt-2 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add reminder
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DaySidebar;
