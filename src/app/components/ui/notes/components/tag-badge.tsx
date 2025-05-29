"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";

interface TagBadgeProps {
  tag: string;
  onRemove?: () => void;
  removable?: boolean;
  onClick?: () => void;
  selected?: boolean;
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

  const colorClasses = selected
    ? "bg-blue-600 text-white"
    : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50";

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
          className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors duration-200"
        >
          <XMarkIcon className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
