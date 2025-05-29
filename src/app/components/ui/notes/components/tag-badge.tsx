"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";

interface TagBadgeProps {
  tag: string;
  onRemove?: () => void;
  removable?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

const tagColors = [
  "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50",
  "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50",
  "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50",
  "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-900/50",
  "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50",
  "bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-900/50",
  "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50",
  "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50",
];

function getTagColor(tag: string): string {
  // Use a simple hash to consistently assign colors to tags
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return tagColors[Math.abs(hash) % tagColors.length];
}

export function TagBadge({
  tag,
  onRemove,
  removable = false,
  onClick,
  selected = false,
}: TagBadgeProps) {
  const baseClasses =
    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200";

  const colorClasses = selected ? "bg-blue-600 text-white" : getTagColor(tag);

  const clickableClasses = onClick ? "cursor-pointer" : "";

  return (
    <span
      className={`${baseClasses} ${colorClasses} ${clickableClasses}`}
      onClick={onClick}
    >
      <span>#{tag}</span>
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors duration-200"
        >
          <XMarkIcon className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
