// calendar/components/CalendarHeader.tsx

import { useState } from "react";
import { ViewMode, NavigationDirection } from "./types";
import { motion } from "framer-motion";

interface CalendarHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  headerText: string;
  goToToday: () => void;
  goToNextPeriod: () => void;
  goToPreviousPeriod: () => void;
}

const CalendarHeader = ({
  viewMode,
  setViewMode,
  headerText,
  goToToday,
  goToNextPeriod,
  goToPreviousPeriod,
}: CalendarHeaderProps) => {
  return (
    <div className="p-4 border-b dark:border-zinc-700 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={goToToday}
          className="px-4 py-1 bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded transition-colors dark:text-gray-200"
        >
          Today
        </button>
        {/* Centered navigation section */}
        <div className="flex-grow flex justify-center items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousPeriod}
              className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full transition-colors dark:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="text-lg font-medium text-center w-64 dark:text-white">
              {headerText}
            </span>
            <button
              onClick={goToNextPeriod}
              className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full transition-colors dark:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex border dark:border-zinc-600 rounded overflow-hidden">
          <button
            className={`px-3 py-1 text-sm dark:text-gray-300 ${
              viewMode === "year"
                ? "bg-gray-100 dark:bg-zinc-700"
                : "dark:hover:bg-zinc-700"
            }`}
            onClick={() => setViewMode("year")}
          >
            Year
          </button>
          <button
            className={`px-3 py-1 text-sm dark:text-gray-300 ${
              viewMode === "month"
                ? "bg-gray-100 dark:bg-zinc-700"
                : "dark:hover:bg-zinc-700"
            }`}
            onClick={() => setViewMode("month")}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 text-sm dark:text-gray-300 ${
              viewMode === "week"
                ? "bg-gray-100 dark:bg-zinc-700"
                : "dark:hover:bg-zinc-700"
            }`}
            onClick={() => setViewMode("week")}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 text-sm dark:text-gray-300 ${
              viewMode === "day"
                ? "bg-gray-100 dark:bg-zinc-700"
                : "dark:hover:bg-zinc-700"
            }`}
            onClick={() => setViewMode("day")}
          >
            Day
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
