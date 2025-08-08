// components/ui/tasks/components/TaskFilter.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Filter, Tag } from "lucide-react";

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
    {
      value: "low",
      label: "Low",
      activeClass:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      inactiveClass: "bg-white dark:bg-gray-700 dark:text-white",
    },
    {
      value: "medium",
      label: "Medium",
      activeClass:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      inactiveClass: "bg-white dark:bg-gray-700 dark:text-white",
    },
    {
      value: "high",
      label: "High",
      activeClass:
        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      inactiveClass: "bg-white dark:bg-gray-700 dark:text-white",
    },
  ];

  const statusOptions = [
    {
      value: "uncompleted",
      label: "Uncompleted",
      activeClass: "bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-200",
      inactiveClass: "bg-white dark:bg-gray-700 dark:text-white",
    },
    {
      value: "in_progress",
      label: "In Progress",
      activeClass:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-200",
      inactiveClass: "bg-white dark:bg-gray-700 dark:text-white",
    },
    {
      value: "completed",
      label: "Completed",
      activeClass:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      inactiveClass: "bg-white dark:bg-gray-700 dark:text-white",
    },
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
        <motion.div
          className="fixed top-0 right-0 h-full w-1/3 bg-white dark:bg-zinc-800 shadow-xl border-l dark:border-zinc-700 p-6 z-40 flex flex-col"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Filter size={20} className="text-gray-600 dark:text-gray-400" />
              <h2 className="text-xl font-semibold dark:text-white">
                Filter Tasks
              </h2>
            </motion.div>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={20} className="dark:text-white" />
            </motion.button>
          </div>

          <motion.div
            className="space-y-6 flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Search */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Search Tasks
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={localFilters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Importance Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Importance Level
              </label>
              <div className="flex gap-2">
                {importanceOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    className={`flex-1 py-2 px-3 border rounded-md text-sm font-medium transition-colors ${
                      localFilters.importance.includes(option.value)
                        ? option.activeClass
                        : option.inactiveClass
                    } border-gray-300 dark:border-gray-600`}
                    onClick={() => handleImportanceToggle(option.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Task Status
              </label>
              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    className={`w-full py-2 px-3 border rounded-md text-sm font-medium text-left transition-colors ${
                      localFilters.status.includes(option.value)
                        ? option.activeClass
                        : option.inactiveClass
                    } border-gray-300 dark:border-gray-600`}
                    onClick={() => handleStatusToggle(option.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {localFilters.status.includes(option.value) && (
                        <motion.div
                          className="w-2 h-2 bg-current rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <motion.div
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Tag size={14} className="text-gray-500 dark:text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active Filters
                  </h3>
                </div>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {localFilters.search && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Search: "{localFilters.search}"</span>
                    </div>
                  )}
                  {localFilters.importance.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      <span>
                        Importance: {localFilters.importance.join(", ")}
                      </span>
                    </div>
                  )}
                  {localFilters.status.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Status: {localFilters.status.join(", ")}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <div className="mt-auto pt-6 space-y-3">
            <motion.button
              onClick={handleApply}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Apply Filters
            </motion.button>
            <motion.button
              onClick={handleClear}
              disabled={!hasActiveFilters}
              className="w-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-500"
              whileHover={hasActiveFilters ? { scale: 1.03 } : {}}
              whileTap={hasActiveFilters ? { scale: 0.97 } : {}}
            >
              Clear All Filters
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskFilter;
