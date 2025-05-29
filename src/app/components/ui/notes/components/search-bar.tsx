"use client";

import { MagnifyingGlassIcon, HashtagIcon } from "@heroicons/react/24/outline";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  const isTagSearch = searchQuery.startsWith("#");

  return (
    <div className="relative flex-1 max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {isTagSearch ? (
          <HashtagIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        ) : (
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        )}
      </div>
      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className={`block w-full pl-10 pr-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
          isTagSearch
            ? "border-blue-300 dark:border-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
        }`}
      />
      {isTagSearch && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            Tag search
          </span>
        </div>
      )}
    </div>
  );
}
