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
export const getEventColorClasses = (colorName: string) => {
  const color =
    colorOptions.find((c) => c.name === colorName) || colorOptions[0];
  return {
    bg: color.bg,
    dot: color.dot,
    text: color.text,
  };
};
