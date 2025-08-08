"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Bell,
  TrendingUp,
  Target,
  Zap,
  RefreshCw,
  Filter,
  Search,
  SortAsc,
  Eye,
  AlertCircle,
  ChevronDown,
  ChevronUp,
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
import { motion, AnimatePresence } from "framer-motion";

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

// Import note viewer component
import { NoteViewer } from "../../components/ui/notes/components/note-viewer";

// Use your existing task type
type Task = z.infer<typeof taskSchema>;

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<
    "today" | "week" | "all"
  >("week");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Note viewer state
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showNoteViewer, setShowNoteViewer] = useState(false);

  // Function to handle note click
  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setShowNoteViewer(true);
  };

  // Function to handle notes change
  const handleNotesChange = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);

    // If a note is currently selected, update it with the latest version
    if (selectedNote) {
      const updatedSelectedNote = updatedNotes.find(
        (note) => note.id === selectedNote.id
      );
      if (updatedSelectedNote) {
        setSelectedNote(updatedSelectedNote);
      }
    }
  };

  // Function to navigate with sidebar opening
  const navigateWithSidebar = (path: string, sidebarType: string) => {
    router.push(`${path}?open=${sidebarType}`);
  };

  // Function to handle event click
  const handleEventClick = (event: Event) => {
    router.push("/pages/calendar");
  };

  // Function to handle task click
  const handleTaskClick = (task: Task) => {
    router.push("/pages/tasks");
  };

  // Update time every minute for live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

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

      // Update local state with optimistic update
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1500));
    window.location.reload();
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

  const pulseVariants = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
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
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-blue-500" />
          </motion.div>
          <motion.p
            className="text-sm text-zinc-500"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading your dashboard...
          </motion.p>
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
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          </motion.div>
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
  const overdueTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      new Date(task.dueDate) < new Date() &&
      task.status !== "completed"
  ).length;

  const todaysEvents = events.filter(
    (e) => e.startTime.toDateString() === new Date().toDateString()
  );

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getProductivityScore = () => {
    if (tasks.length === 0) return 0;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  return (
    <motion.div
      className="h-full w-full p-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Enhanced Header with Time and Greeting */}
      <motion.header
        className="flex justify-between items-start mb-8"
        variants={itemVariants}
      >
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold tracking-tight">
              {getGreeting()}
              {userName && `, ${userName}`}! 👋
            </h1>
            <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400 mt-1">
              <motion.span
                key={currentTime.toLocaleTimeString()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium"
              >
                {currentTime.toLocaleString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </motion.span>
              {todaysEvents.length > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400"
                >
                  <Bell className="h-4 w-4" />
                  <span className="text-sm">
                    {todaysEvents.length} event
                    {todaysEvents.length !== 1 ? "s" : ""} today
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Enhanced Stats Cards with Better Metrics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={itemVariants}
      >
        <motion.div variants={itemVariants}>
          <StatsCard
            title="Tasks"
            value={tasks.length}
            description={`${completedTasks} completed, ${inProgressTasks} in progress`}
            trend={
              overdueTasks > 0
                ? `${overdueTasks} overdue`
                : `${
                    tasks.filter((t) => t.status === "uncompleted").length
                  } remaining`
            }
            trendUp={overdueTasks === 0}
            icon={<CheckSquare className="h-5 w-5 text-blue-500" />}
            linkHref="/pages/tasks"
            showAlert={overdueTasks > 0}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsCard
            title="Events"
            value={events.length}
            description={`${upcomingEvents.length} upcoming events`}
            trend={`${todaysEvents.length} today`}
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
              notes.filter((n) => n.starred).length
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

        <motion.div variants={itemVariants}>
          <motion.div
            initial="initial"
            animate={getProductivityScore() >= 80 ? "pulse" : "initial"}
            variants={{
              initial: { scale: 1 },
              pulse: {
                scale: [1, 1.05, 1],
                transition: {
                  duration: 1,
                  repeat: 1,
                  repeatDelay: 0.5,
                },
              },
            }}
          >
            <StatsCard
              title="Productivity"
              value={`${getProductivityScore()}%`}
              description="Task completion rate"
              trend={
                getProductivityScore() >= 80
                  ? "Excellent!"
                  : getProductivityScore() >= 60
                  ? "Good work"
                  : "Keep going!"
              }
              trendUp={getProductivityScore() >= 60}
              icon={<Target className="h-5 w-5 text-orange-500" />}
              linkHref="/pages/tasks"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        {/* Enhanced Calendar Card with Time Filter */}
        <motion.div variants={itemVariants} className="flex">
          <Card className="overflow-hidden flex-1 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between bg-zinc-50 dark:bg-zinc-900 border-b">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{
                    rotate: [0, 10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    delay: 1,
                    repeat: Infinity,
                    repeatDelay: 5,
                  }}
                >
                  <CalendarDays className="h-5 w-5 text-zinc-500" />
                </motion.div>
                <CardTitle>Upcoming Events</CardTitle>
                {todaysEvents.length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                  >
                    {todaysEvents.length} today
                  </motion.div>
                )}
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
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    <Coffee className="h-12 w-12 text-zinc-300 mb-4" />
                  </motion.div>
                  <h3 className="font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                    No upcoming events
                  </h3>
                  <p className="text-sm text-zinc-500 text-center">
                    Looks like you have some free time! ☕
                  </p>
                </motion.div>
              ) : (
                <div className="divide-y dark:divide-zinc-800">
                  <AnimatePresence>
                    {upcomingEvents.slice(0, 4).map((event, index) => (
                      <motion.div
                        key={event.id}
                        className="flex items-center gap-4 p-4 group cursor-pointer"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                        onClick={() => handleEventClick(event)}
                      >
                        <motion.div
                          className={cn(
                            "h-10 w-10 rounded-md flex items-center justify-center shrink-0",
                            `bg-${event.color}-500`
                          )}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Calendar className="h-5 w-5 text-white" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {event.title}
                          </h3>
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
                            {event.startTime.toDateString() ===
                              new Date().toDateString() && (
                              <motion.span
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full"
                              >
                                Today
                              </motion.span>
                            )}
                          </div>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t bg-zinc-50 dark:bg-zinc-900 p-4">
              <Button
                variant="outline"
                className="w-full gap-1"
                onClick={() =>
                  navigateWithSidebar("/pages/calendar", "create-event")
                }
              >
                <Plus className="h-4 w-4" />
                <span>Add New Event</span>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Enhanced Tasks Card with Progress Indicators */}
        <motion.div variants={itemVariants} className="flex">
          <Card className="overflow-hidden flex-1 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between bg-zinc-50 dark:bg-zinc-900 border-b">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 1,
                    delay: 1.5,
                    repeat: Infinity,
                    repeatDelay: 4,
                  }}
                >
                  <CheckSquare className="h-5 w-5 text-zinc-500" />
                </motion.div>
                <CardTitle>Tasks</CardTitle>
                {overdueTasks > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {overdueTasks} overdue
                  </motion.div>
                )}
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
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    <Sparkles className="h-12 w-12 text-zinc-300 mb-4" />
                  </motion.div>
                  <h3 className="font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                    No tasks yet
                  </h3>
                  <p className="text-sm text-zinc-500 text-center">
                    Time to get productive! ✨
                  </p>
                </motion.div>
              ) : (
                <div className="divide-y dark:divide-zinc-800">
                  <AnimatePresence>
                    {tasks.slice(0, 5).map((task, index) => {
                      const isOverdue =
                        task.dueDate &&
                        new Date(task.dueDate) < new Date() &&
                        task.status !== "completed";
                      return (
                        <motion.div
                          key={task.id}
                          className={cn(
                            "flex items-center gap-4 p-4 group cursor-pointer",
                            isOverdue && "bg-red-50 dark:bg-red-900/10"
                          )}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10, height: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          whileHover={{
                            backgroundColor: isOverdue
                              ? "rgba(239, 68, 68, 0.05)"
                              : "rgba(0,0,0,0.02)",
                          }}
                          layout
                          onClick={() => handleTaskClick(task)}
                        >
                          <motion.button
                            className={cn(
                              "h-6 w-6 rounded-full flex items-center justify-center border-2",
                              task.status === "completed"
                                ? "bg-green-100 border-green-500 dark:bg-green-900/30"
                                : task.status === "in_progress"
                                ? "bg-yellow-100 border-yellow-500 dark:bg-yellow-900/30"
                                : isOverdue
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : "border-zinc-300 dark:border-zinc-700"
                            )}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskStatusChange(task.id, task.status);
                            }}
                          >
                            <AnimatePresence mode="wait">
                              {task.status === "completed" && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: 180 }}
                                >
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                </motion.div>
                              )}
                              {task.status === "in_progress" && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  className="h-2 w-2 rounded-full bg-yellow-500"
                                />
                              )}
                            </AnimatePresence>
                          </motion.button>
                          <div className="flex-1 min-w-0">
                            <h3
                              className={cn(
                                "font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
                                task.status === "completed" &&
                                  "line-through text-zinc-500 dark:text-zinc-400",
                                isOverdue && "text-red-700 dark:text-red-400"
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
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
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
                                  </motion.span>
                                </>
                              )}
                              {isOverdue && (
                                <>
                                  <span className="text-xs">•</span>
                                  <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1"
                                  >
                                    <AlertCircle className="h-3 w-3" />
                                    Overdue
                                  </motion.span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-zinc-500 dark:text-zinc-400 text-right">
                            {task.dueDate ? (
                              <motion.div
                                className={cn(
                                  "flex flex-col items-end",
                                  isOverdue && "text-red-600 dark:text-red-400"
                                )}
                              >
                                <span className="font-medium">
                                  {task.dueDate.toLocaleDateString()}
                                </span>
                                <span className="text-xs">
                                  {getRelativeTime(task.dueDate)}
                                </span>
                              </motion.div>
                            ) : (
                              <span className="text-xs">No due date</span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  {tasks.length > 5 && (
                    <motion.div
                      className="p-4 text-center text-sm text-zinc-500 dark:text-zinc-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      +{tasks.length - 5} more tasks
                    </motion.div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t bg-zinc-50 dark:bg-zinc-900 p-4">
              <Button
                variant="outline"
                className="w-full gap-1"
                onClick={() => navigateWithSidebar("/pages/tasks", "add-task")}
              >
                <Plus className="h-4 w-4" />
                <span>Add New Task</span>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div className="grid grid-cols-1 gap-6" variants={itemVariants}>
        {/* Enhanced Recent Notes Card with Search Preview */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-zinc-50 dark:bg-zinc-900 border-b">
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  style={{ originX: 0.5, originY: 0.5 }}
                >
                  <FileText className="h-5 w-5 text-zinc-500" />
                </motion.div>
                <CardTitle>Recent Notes</CardTitle>
                {notes.filter((n) => n.starred).length > 0 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="ml-2 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs rounded-full flex items-center gap-1"
                  >
                    <Star className="h-3 w-3 fill-current" />
                    {notes.filter((n) => n.starred).length} starred
                  </motion.div>
                )}
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
                  <motion.div
                    animate={{
                      rotateY: [0, 180, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    <BookOpen className="h-12 w-12 text-zinc-300 mb-4" />
                  </motion.div>
                  <h3 className="font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                    No notes yet
                  </h3>
                  <p className="text-sm text-zinc-500 text-center">
                    Start capturing your thoughts! 📝
                  </p>
                </motion.div>
              ) : (
                <div className="divide-y dark:divide-zinc-800">
                  <AnimatePresence>
                    {recentNotes.map((note, index) => (
                      <motion.div
                        key={note.id}
                        className="flex items-center gap-3 p-4 group cursor-pointer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                        layout
                        onClick={() => handleNoteClick(note)}
                      >
                        <motion.div
                          className="h-9 w-9 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0"
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <PenLine className="h-4 w-4 text-zinc-500" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {note.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                            <span>
                              Updated{" "}
                              {getRelativeTime(new Date(note.updated_at))}
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
                        <motion.div
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNoteClick(note);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t bg-zinc-50 dark:bg-zinc-900 p-4">
              <Button
                variant="outline"
                className="w-full gap-1"
                onClick={() =>
                  navigateWithSidebar("/pages/notes", "create-note")
                }
              >
                <Plus className="h-4 w-4" />
                <span>New Note</span>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      {/* Floating Action Button for Mobile */}
      <AnimatePresence>
        <motion.div
          className="fixed bottom-6 right-6 lg:hidden z-40"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <motion.button
            className="h-14 w-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowQuickActions(!showQuickActions)}
          >
            <motion.div
              animate={{ rotate: showQuickActions ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="h-6 w-6" />
            </motion.div>
          </motion.button>
        </motion.div>
      </AnimatePresence>

      {/* Note Viewer Modal */}
      <AnimatePresence>
        {showNoteViewer && selectedNote && (
          <NoteViewer
            note={selectedNote}
            userId={userId}
            onClose={() => setShowNoteViewer(false)}
            onNotesChange={handleNotesChange}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Enhanced helper function with better relative time formatting
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2629800)
    return `${Math.floor(diffInSeconds / 604800)}w ago`;

  return date.toLocaleDateString();
}

// Enhanced AnimatedButton with better animations
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
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
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

// Enhanced StatsCard with better animations and alert indicators
interface StatsCardProps {
  title: string;
  value: number | string;
  description?: ReactNode;
  trend: string;
  trendUp: boolean;
  icon: ReactNode;
  linkHref: string;
  showAlert?: boolean;
}

function StatsCard({
  title,
  value,
  description,
  trend,
  trendUp,
  icon,
  linkHref,
  showAlert = false,
}: StatsCardProps) {
  return (
    <Card className="overflow-hidden relative group">
      <motion.div
        className="absolute inset-0 w-full h-full"
        whileHover={{
          y: -5,
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
        style={{ borderRadius: "inherit" }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      />

      {showAlert && (
        <motion.div
          className="absolute top-2 right-2 z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-2 w-2 bg-red-500 rounded-full"
          />
        </motion.div>
      )}

      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
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
          transition={{
            delay: 0.5,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
        >
          {value}
        </motion.div>
        <CardDescription className="group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
          {description}
        </CardDescription>
        <motion.div
          className={cn(
            "text-xs mt-2 flex items-center gap-1",
            trendUp
              ? "text-green-600 dark:text-green-400"
              : showAlert
              ? "text-red-600 dark:text-red-400"
              : "text-green-600 dark:text-green-400"
          )}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            animate={trendUp ? { rotate: [0, -10, 0] } : {}}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <TrendingUp className="h-3 w-3" />
          </motion.div>
          {trend}
        </motion.div>
      </CardContent>
    </Card>
  );
}
