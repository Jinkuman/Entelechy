// components/ui/TaskToast.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Check, X, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";

type ToastType = "success" | "error" | "info";

interface TaskToastProps {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  onDismiss?: () => void;
}

const iconMap = {
  success: <Check className="h-4 w-4 text-green-600" />,
  error: <AlertCircle className="h-4 w-4 text-red-600" />,
  info: <Info className="h-4 w-4 text-blue-600" />,
};

const bgColorMap = {
  success: "bg-green-100",
  error: "bg-red-100",
  info: "bg-blue-100",
};

const timerColorMap = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

export const showTaskToast = ({
  title,
  description,
  type = "success",
  duration = 4000,
}: TaskToastProps) => {
  return toast.custom(
    (toastId) => (
      <TaskToast
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

const TaskToast = ({
  title,
  description,
  type = "success",
  duration = 4000,
  onDismiss,
}: TaskToastProps) => {
  const [timeLeft, setTimeLeft] = useState(100);
  const [hovered, setHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic with pause on hover
  useEffect(() => {
    if (hovered) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 100 / (duration / 100);
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hovered, duration]);

  // Auto-dismiss when timeLeft reaches 0
  useEffect(() => {
    if (timeLeft <= 0) {
      onDismiss?.();
    }
  }, [timeLeft, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      className="group relative overflow-hidden rounded-lg border border-border bg-background p-4 shadow-lg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Timer bar at the top */}
      <div
        className={`absolute top-0 left-0 h-1 ${timerColorMap[type]} transition-all duration-100 ease-linear`}
        style={{ width: `${timeLeft}%` }}
      />

      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${bgColorMap[type]}`}
        >
          {iconMap[type]}
        </div>

        <div className="flex-1">
          <p className="font-medium text-foreground dark:text-white">{title}</p>
          {description && (
            <p className="text-sm text-muted-foreground dark:text-gray-300">
              {description}
            </p>
          )}
        </div>

        <button
          onClick={onDismiss}
          className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default TaskToast;
