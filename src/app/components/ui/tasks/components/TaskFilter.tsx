// components/ui/tasks/components/TaskFilter.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Filter } from "lucide-react";

export interface FilterOptions {
  search: string;
  importance: string[];
  status: string[];
}

interface TaskFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

const TaskFilter = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
}: TaskFilterProps) => {
  const [localFilters, setLocalFilters] =
    useState<FilterOptions>(currentFilters);

  // Update local filters when current filters change
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const importanceOptions = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "high", label: "High", color: "bg-red-100 text-red-800" },
  ];

  const statusOptions = [
    { value: "uncompleted", label: "Uncompleted" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const handleImportanceToggle = (importance: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      importance: prev.importance.includes(importance)
        ? prev.importance.filter((i) => i !== importance)
        : [...prev.importance, importance],
    }));
  };

  const handleStatusToggle = (status: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  };

  const handleSearchChange = (search: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      search,
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {
      search: "",
      importance: [],
      status: [],
    };
    setLocalFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  const hasActiveFilters =
    localFilters.search ||
    localFilters.importance.length > 0 ||
    localFilters.status.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Filter Panel */}
          <motion.div
            className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter
                    size={20}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <h2 className="text-xl font-semibold dark:text-white">
                    Filter Tasks
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Tasks
                </label>
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search by title or description..."
                    value={localFilters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Importance Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Importance Level
                </label>
                <div className="space-y-2">
                  {importanceOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={localFilters.importance.includes(option.value)}
                        onChange={() => handleImportanceToggle(option.value)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${option.color}`}
                      >
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Task Status
                </label>
                <div className="space-y-2">
                  {statusOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={localFilters.status.includes(option.value)}
                        onChange={() => handleStatusToggle(option.value)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleApply}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleClear}
                  disabled={!hasActiveFilters}
                  className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear All
                </button>
              </div>

              {/* Active Filters Summary */}
              {hasActiveFilters && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Active Filters:
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {localFilters.search && (
                      <div>Search: "{localFilters.search}"</div>
                    )}
                    {localFilters.importance.length > 0 && (
                      <div>
                        Importance: {localFilters.importance.join(", ")}
                      </div>
                    )}
                    {localFilters.status.length > 0 && (
                      <div>Status: {localFilters.status.join(", ")}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskFilter;
