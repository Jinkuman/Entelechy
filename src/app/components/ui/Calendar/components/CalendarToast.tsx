// components/ui/CalendarToast.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";

type ToastType = "success" | "error" | "info";

interface CalendarToastProps {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  onDismiss?: () => void;
}

const iconMap = {
  success: <Check className="h-5 w-5 text-green-600" />,
  error: <AlertCircle className="h-5 w-5 text-red-600" />,
  info: <Info className="h-5 w-5 text-blue-600" />,
};

const bgColorMap = {
  success: "bg-green-100",
  error: "bg-red-100",
  info: "bg-blue-100",
};

const progressColorMap = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

export const showCalendarToast = ({
  title,
  description,
  type = "success",
  duration = 4000,
}: CalendarToastProps) => {
  return toast.custom(
    (toastId) => (
      <CalendarToast
        title={title}
        description={description}
        type={type}
        duration={duration}
        onDismiss={() => toast.dismiss(toastId)}
      />
    ),
    {
      duration,
    }
  );
};

const CalendarToast = ({
  title,
  description,
  type = "success",
  duration = 4000,
  onDismiss,
}: CalendarToastProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(duration);

  useEffect(() => {
    // Start the timer
    startTimer();

    return () => {
      // Clean up on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        const elapsed = Date.now() - startTimeRef.current;
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - 100);
        const newProgress = (remainingTimeRef.current / duration) * 100;

        setProgress(newProgress);

        if (newProgress <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          onDismiss?.();
        }
      }
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-md relative overflow-hidden"
      layout
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div
            className={`w-8 h-8 rounded-full ${bgColorMap[type]} flex items-center justify-center`}
          >
            {iconMap[type]}
          </div>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {title}
          </p>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="ml-4 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        >
          <X size={16} />
        </button>
      </div>

      {/* Progress bar */}
      <motion.div
        className={`absolute bottom-0 left-0 h-1 ${progressColorMap[type]}`}
        initial={{ width: "100%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1, ease: "linear" }}
      />
    </motion.div>
  );
};

export default CalendarToast;
