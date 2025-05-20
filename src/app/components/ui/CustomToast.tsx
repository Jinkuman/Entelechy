// components/ui/CustomToast.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";

type ToastType = "success" | "error" | "info";

interface CustomToastProps {
  title: string;
  description?: string;
  type?: ToastType;
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

export const showCustomToast = ({
  title,
  description,
  type = "success",
}: CustomToastProps) => {
  return toast.custom((toastId) => (
    <CustomToast
      title={title}
      description={description}
      type={type}
      onDismiss={() => toast.dismiss(toastId)}
    />
  ));
};

const CustomToast = ({
  title,
  description,
  type = "success",
  onDismiss,
}: CustomToastProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-md"
      layout
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
    </motion.div>
  );
};

export default CustomToast;
