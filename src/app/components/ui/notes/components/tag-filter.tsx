"use client";

import { useState } from "react";
import { TagBadge } from "./tag-badge";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/24/outline";

interface TagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagFilter({
  availableTags,
  selectedTags,
  onTagsChange,
}: TagFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearAllTags = () => {
    onTagsChange([]);
  };

  if (availableTags.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <FunnelIcon className="h-4 w-4" />
        <span>Filter by tags</span>
        {selectedTags.length > 0 && (
          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
            {selectedTags.length}
          </span>
        )}
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 animate-scale-in">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Filter by Tags
              </h3>
              {selectedTags.length > 0 && (
                <button
                  onClick={clearAllTags}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableTags.map((tag) => (
                <TagBadge
                  key={tag}
                  tag={tag}
                  selected={selectedTags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                />
              ))}
            </div>

            {selectedTags.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Selected tags:
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map((tag) => (
                    <TagBadge
                      key={tag}
                      tag={tag}
                      selected
                      onRemove={() => toggleTag(tag)}
                      removable
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
