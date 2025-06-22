"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  MoreHorizontal,
  PenLine,
  Plus,
  Star,
  CheckSquare,
  Loader2,
  Coffee,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { cn } from "@/lib/utils";
import supabase from "@/lib/supabaseClient";
import { motion } from "framer-motion";

// Import your existing schemas
import { Event } from "@/app/schemas/eventSchema";
import { Note } from "@/app/schemas/notesSchema";
import { taskSchema } from "@/app/schemas/taskSchema";
import { z } from "zod";

// Import API functions
import { fetchUserEvents, getUpcomingEvents } from "@/lib/api/events";
import {
  fetchUserTasks,
  updateTaskStatus,
  cycleTaskStatus,
} from "@/lib/api/tasks";
import { fetchUserNotes, getRecentNotes } from "@/lib/api/notes";

// Use your existing task type
type Task = z.infer<typeof taskSchema>;

export default function Dashboard() {
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function loadUserData() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Failed to fetch user:", userError);
          setError("Failed to load user data");
          return;
        }

        if (!user) {
          setError("Please log in to view your dashboard");
          return;
        }

        const name = (user.user_metadata as any)?.name ?? "";
        setUserName(name);
        setUserId(user.id);

        // Fetch all user data in parallel
        const [eventsData, tasksData, notesData] = await Promise.all([
          fetchUserEvents(user.id),
          fetchUserTasks(user.id),
          fetchUserNotes(user.id),
        ]);

        setEvents(eventsData);
        setTasks(tasksData);
        setNotes(notesData);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, []);

  const handleTaskStatusChange = async (
    taskId: string,
    currentStatus: Task["status"]
  ) => {
    try {
      const newStatus = cycleTaskStatus(currentStatus);
      await updateTaskStatus(taskId, newStatus);

      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm text-zinc-500">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </motion.div>
      </div>
    );
  }

  const upcomingEvents = getUpcomingEvents(events);
  const recentNotes = getRecentNotes(notes);
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in_progress"
  ).length;

  return (
    <motion.div
      className="h-full w-full p-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.header
        className="flex justify-between items-center mb-8"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Welcome back! Here's an overview of your workspace.
          </p>
        </div>
      </motion.header>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={itemVariants}
      >
        {/* Quick Stats Cards */}
        <motion.div variants={itemVariants}>
          <StatsCard
            title="Tasks"
            value={tasks.length}
            description={`${completedTasks} completed, ${inProgressTasks} in progress`}
            trend={`${
              tasks.filter((t) => t.status === "uncompleted").length
            } remaining`}
            trendUp={completedTasks > inProgressTasks}
            icon={<CheckSquare className="h-5 w-5 text-blue-500" />}
            linkHref="/pages/tasks"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsCard
            title="Events"
            value={events.length}
            description={`${upcomingEvents.length} upcoming events`}
            trend={`${
              events.filter(
                (e) => e.startTime.toDateString() === new Date().toDateString()
              ).length
            } today`}
            trendUp={upcomingEvents.length > 0}
            icon={<Calendar className="h-5 w-5 text-purple-500" />}
            linkHref="/pages/calendar"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsCard
            title="Notes"
            value={notes.length}
            description={`${
              notes.filter((n) => n.tags && n.tags.includes("starred")).length
            } starred notes`}
            trend={`${
              notes.filter((n) => {
                const dayAgo = new Date();
                dayAgo.setDate(dayAgo.getDate() - 1);
                return new Date(n.updated_at) > dayAgo;
              }).length
            } updated recently`}
            trendUp={true}
            icon={<FileText className="h-5 w-5 text-green-500" />}
            linkHref="/pages/notes"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        {/* Calendar Card */}
        <motion.div variants={itemVariants} className="flex">
          <Card className="overflow-hidden flex-1 flex flex-col">
            {" "}
            {/* Added flex classes */}
            <CardHeader className="flex flex-row items-center justify-between bg-zinc-50 dark:bg-zinc-900 border-b">
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  <CalendarDays className="h-5 w-5 text-zinc-500" />
                </motion.div>
                <CardTitle>Upcoming Events</CardTitle>
              </div>
              <AnimatedButton asLink href="/pages/calendar">
                <span>Open Calendar</span>
                <ArrowRight className="h-4 w-4" />
              </AnimatedButton>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              {upcomingEvents.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-12 px-4 h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Coffee className="h-12 w-12 text-zinc-300 mb-4" />
                  <h3 className="font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                    No upcoming events
                  </h3>
                  <p className="text-sm text-zinc-500 text-center">
                    Looks like you have some free time! ☕
                  </p>
                </motion.div>
              ) : (
                <div className="divide-y dark:divide-zinc-800">
                  {upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      className="flex items-center gap-4 p-4"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <motion.div
                        className={cn(
                          "h-10 w-10 rounded-md flex items-center justify-center shrink-0",
                          `bg-${event.color}-500`
                        )}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Calendar className="h-5 w-5 text-white" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium">{event.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                          <Clock className="h-3 w-3" />
                          <span>
                            {event.startTime.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="text-xs">•</span>
                          <span>{event.startTime.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t bg-zinc-50 dark:bg-zinc-900 p-4">
              <AnimatedButton
                asLink
                href="/pages/calendar"
                variant="outline"
                className="w-full gap-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Event</span>
              </AnimatedButton>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Tasks Card */}
        <motion.div variants={itemVariants} className="flex">
          <Card className="overflow-hidden flex-1 flex flex-col">
            {" "}
            {/* Added flex classes */}
            <CardHeader className="flex flex-row items-center justify-between bg-zinc-50 dark:bg-zinc-900 border-b">
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, delay: 1.5 }}
                >
                  <CheckSquare className="h-5 w-5 text-zinc-500" />
                </motion.div>
                <CardTitle>Tasks</CardTitle>
              </div>
              <AnimatedButton asLink href="/pages/tasks">
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </AnimatedButton>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              {tasks.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-12 px-4 h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Sparkles className="h-12 w-12 text-zinc-300 mb-4" />
                  <h3 className="font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                    No tasks yet
                  </h3>
                  <p className="text-sm text-zinc-500 text-center">
                    Time to get productive! ✨
                  </p>
                </motion.div>
              ) : (
                <div className="divide-y dark:divide-zinc-800">
                  {tasks.slice(0, 5).map((task, index) => (
                    <motion.div
                      key={task.id}
                      className="flex items-center gap-4 p-4"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <motion.button
                        className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center border",
                          task.status === "completed"
                            ? "bg-green-100 border-green-500 dark:bg-green-900/30"
                            : task.status === "in_progress"
                            ? "bg-yellow-100 border-yellow-500 dark:bg-yellow-900/30"
                            : "border-zinc-300 dark:border-zinc-700"
                        )}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          handleTaskStatusChange(task.id, task.status)
                        }
                      >
                        {task.status === "completed" && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                        {task.status === "in_progress" && (
                          <div className="h-2 w-2 rounded-full bg-yellow-500" />
                        )}
                      </motion.button>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={cn(
                            "font-medium",
                            task.status === "completed" &&
                              "line-through text-zinc-500 dark:text-zinc-400"
                          )}
                        >
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                          <span className="capitalize">
                            {task.status.replace("_", " ")}
                          </span>
                          {task.importance && (
                            <>
                              <span className="text-xs">•</span>
                              <span
                                className={cn(
                                  "px-1.5 py-0.5 rounded-full text-xs capitalize",
                                  task.importance === "high"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    : task.importance === "medium"
                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                )}
                              >
                                {task.importance}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">
                        {task.dueDate?.toLocaleDateString() || "No due date"}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t bg-zinc-50 dark:bg-zinc-900 p-4">
              <AnimatedButton
                asLink
                href="/pages/tasks"
                variant="outline"
                className="w-full gap-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Task</span>
              </AnimatedButton>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div className="grid grid-cols-1 gap-6" variants={itemVariants}>
        {/* Recent Notes Card */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-zinc-50 dark:bg-zinc-900 border-b">
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: 15 }}
                  transition={{ duration: 0.2 }}
                  style={{ originX: 0.5, originY: 0.5 }}
                >
                  <FileText className="h-5 w-5 text-zinc-500" />
                </motion.div>
                <CardTitle>Recent Notes</CardTitle>
              </div>
              <AnimatedButton asLink href="/pages/notes">
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </AnimatedButton>
            </CardHeader>
            <CardContent className="p-0">
              {recentNotes.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-12 px-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <BookOpen className="h-12 w-12 text-zinc-300 mb-4" />
                  <h3 className="font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                    No notes yet
                  </h3>
                  <p className="text-sm text-zinc-500 text-center">
                    Start capturing your thoughts! 📝
                  </p>
                </motion.div>
              ) : (
                <div className="divide-y dark:divide-zinc-800">
                  {recentNotes.map((note, index) => (
                    <motion.div
                      key={note.id}
                      className="flex items-center gap-3 p-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <motion.div
                        className="h-9 w-9 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                      >
                        <PenLine className="h-4 w-4 text-zinc-500" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{note.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <span>
                            Updated {getRelativeTime(new Date(note.updated_at))}
                          </span>
                          {note.tags && note.tags.includes("starred") && (
                            <motion.div
                              animate={{
                                rotate: [0, 20, 0, -20, 0],
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                duration: 1,
                                delay: 2 + index * 0.2,
                                repeat: 0,
                              }}
                            >
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t bg-zinc-50 dark:bg-zinc-900 p-4">
              <AnimatedButton
                asLink
                href="/pages/notes"
                variant="outline"
                className="w-full gap-1"
              >
                <Plus className="h-4 w-4" />
                <span>New Note</span>
              </AnimatedButton>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Helper function to get relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
}

// Define the props interface for the AnimatedButton component
interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  asLink?: boolean;
  href?: string;
}

// Animated Button Component
function AnimatedButton({
  children,
  variant = "ghost",
  size = "sm",
  className = "",
  asLink = false,
  href = "",
  ...props
}: AnimatedButtonProps) {
  const buttonContent = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full h-full flex items-center justify-center gap-1"
    >
      {children}
    </motion.div>
  );

  if (asLink) {
    return (
      <Button variant={variant} size={size} asChild className={className}>
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-medium"
        >
          {buttonContent}
        </Link>
      </Button>
    );
  }

  return (
    <Button variant={variant} size={size} className={className} {...props}>
      {buttonContent}
    </Button>
  );
}

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: ReactNode;
  trend: string;
  trendUp: boolean;
  icon: ReactNode;
  linkHref: string;
}

// Stats Card Component
function StatsCard({
  title,
  value,
  description,
  trend,
  trendUp,
  icon,
  linkHref,
}: StatsCardProps) {
  return (
    <Card className="overflow-hidden relative">
      <motion.div
        className="absolute inset-0 w-full h-full"
        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
        style={{ borderRadius: "inherit" }}
        transition={{ duration: 0.2 }}
      />
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 15 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link href={linkHref}>
              <MoreHorizontal className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </CardHeader>
      <CardContent className="relative z-10">
        <motion.div
          className="text-3xl font-bold mb-1"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          {value}
        </motion.div>
        <CardDescription>{description}</CardDescription>
        <motion.div
          className={cn(
            "text-xs mt-2",
            trendUp
              ? "text-green-600 dark:text-green-400"
              : "text-green-600 dark:text-green-400"
          )}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          {trend}
        </motion.div>
      </CardContent>
    </Card>
  );
}
