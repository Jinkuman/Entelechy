// calendar/utils/colorUtils.ts

import { ColorOption } from "../types";

// Color options for events
export const colorOptions: ColorOption[] = [
  {
    name: "blue",
    bg: "bg-blue-100",
    dot: "bg-blue-500",
    text: "text-blue-800",
  },
  {
    name: "green",
    bg: "bg-green-100",
    dot: "bg-green-500",
    text: "text-green-800",
  },
  {
    name: "purple",
    bg: "bg-purple-100",
    dot: "bg-purple-500",
    text: "text-purple-800",
  },
  {
    name: "pink",
    bg: "bg-pink-100",
    dot: "bg-pink-500",
    text: "text-pink-800",
  },
  {
    name: "yellow",
    bg: "bg-yellow-100",
    dot: "bg-yellow-500",
    text: "text-yellow-800",
  },
  {
    name: "orange",
    bg: "bg-orange-100",
    dot: "bg-orange-500",
    text: "text-orange-800",
  },
  { name: "red", bg: "bg-red-100", dot: "bg-red-500", text: "text-red-800" },
  {
    name: "indigo",
    bg: "bg-indigo-100",
    dot: "bg-indigo-500",
    text: "text-indigo-800",
  },
];

// Get color classes for an event

export const getEventColorClasses = (color: string) => {
  switch (color) {
    case "blue":
      return {
        bg: "bg-blue-100 dark:bg-blue-900/50",
        text: "text-blue-800 dark:text-blue-200",
        dot: "bg-blue-500",
      };
    case "green":
      return {
        bg: "bg-green-100 dark:bg-green-900/50",
        text: "text-green-800 dark:text-green-200",
        dot: "bg-green-500",
      };
    case "red":
      return {
        bg: "bg-red-100 dark:bg-red-900/50",
        text: "text-red-800 dark:text-red-200",
        dot: "bg-red-500",
      };
    case "pink":
      return {
        bg: "bg-pink-100 dark:bg-pink-900/50",
        text: "text-pink-800 dark:text-pink-200",
        dot: "bg-pink-500",
      };
    case "orange":
      return {
        bg: "bg-orange-100 dark:bg-orange-900/50",
        text: "text-orange-800 dark:text-orange-200",
        dot: "bg-orange-500",
      };
    case "yellow":
      return {
        bg: "bg-yellow-100 dark:bg-yellow-900/50",
        text: "text-yellow-800 dark:text-yellow-200",
        dot: "bg-yellow-500",
      };
    case "purple":
      return {
        bg: "bg-purple-100 dark:bg-purple-900/50",
        text: "text-purple-800 dark:text-purple-200",
        dot: "bg-purple-500",
      };
    case "indigo":
      return {
        bg: "bg-indigo-100 dark:bg-indigo-900/50",
        text: "text-indigo-800 dark:text-indigo-200",
        dot: "bg-indigo-500",
      };
    default:
      return {
        bg: "bg-gray-100 dark:bg-gray-700",
        text: "text-gray-800 dark:text-gray-200",
        dot: "bg-gray-500",
      };
  }
};
