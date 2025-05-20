// app/components/ui/sonner.tsx
"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, toast, ToasterProps } from "sonner";
import { Check, X, Trash2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

// Define types for the custom toast component
interface CustomToastProps {
  title?: string;
  description?: string;
  onDismiss: () => void;
  duration?: number;
  type?: "success" | "error" | "delete" | "info";
}

// Custom toast component with checkmark, dismiss button, and timer
export function CustomToast({
  title,
  description,
  onDismiss,
  duration = 4000,
  type = "success",
}: CustomToastProps) {
  const [timeLeft, setTimeLeft] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 100 / (duration / 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  // Define icon and colors based on toast type
  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          icon: <Check className="h-4 w-4 text-green-600" />,
          bgColor: "bg-green-100",
          timerColor: "bg-green-500",
        };
      case "error":
        return {
          icon: <AlertCircle className="h-4 w-4 text-red-600" />,
          bgColor: "bg-red-100",
          timerColor: "bg-red-500",
        };
      case "delete":
        return {
          icon: <Trash2 className="h-4 w-4 text-red-600" />,
          bgColor: "bg-red-100",
          timerColor: "bg-red-500",
        };
      case "info":
        return {
          icon: <AlertCircle className="h-4 w-4 text-blue-600" />,
          bgColor: "bg-blue-100",
          timerColor: "bg-blue-500",
        };
      default:
        return {
          icon: <Check className="h-4 w-4 text-green-600" />,
          bgColor: "bg-green-100",
          timerColor: "bg-blue-500",
        };
    }
  };

  const { icon, bgColor, timerColor } = getToastStyles();

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-background p-4 shadow-lg">
      {/* Timer bar */}
      <div
        className={`absolute top-0 left-0 h-1 ${timerColor} transition-all duration-100 ease-linear`}
        style={{ width: `${timeLeft}%` }}
      />

      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${bgColor}`}
        >
          {icon}
        </div>

        <div className="flex-1">
          {title && <p className="font-medium text-foreground">{title}</p>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <button
          onClick={onDismiss}
          className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Enhanced Toaster component
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-transparent group-[.toaster]:border-0 group-[.toaster]:shadow-none",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      position="bottom-right"
      offset={20}
      gap={8}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--viewport-padding": "24px",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };

// Enhanced toast functions with proper types
export function showSuccessToast(title: string, description?: string) {
  return toast.custom((id) => (
    <CustomToast
      title={title}
      description={description}
      onDismiss={() => toast.dismiss(id)}
      duration={4000}
      type="success"
    />
  ));
}

export function showErrorToast(title: string, description?: string) {
  return toast.custom((id) => (
    <CustomToast
      title={title}
      description={description}
      onDismiss={() => toast.dismiss(id)}
      duration={4000}
      type="error"
    />
  ));
}

export function showDeleteToast(title: string, description?: string) {
  return toast.custom((id) => (
    <CustomToast
      title={title}
      description={description}
      onDismiss={() => toast.dismiss(id)}
      duration={4000}
      type="delete"
    />
  ));
}

export function showInfoToast(title: string, description?: string) {
  return toast.custom((id) => (
    <CustomToast
      title={title}
      description={description}
      onDismiss={() => toast.dismiss(id)}
      duration={4000}
      type="info"
    />
  ));
}
