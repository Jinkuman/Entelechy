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
  ChevronRight,
  CheckSquare,
  Folder,
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
import PixelCard from "@/app/components/ui/pixelCard";
import { Progress } from "../../components/ui/progress";
import { cn } from "@/lib/utils";
import supabase from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { any } from "zod";

export default function Dashboard() {
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      // Set loading to false immediately after fetching user data
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Failed to fetch user:", error);
      } else if (user) {
        const name = (user.user_metadata as any)?.name ?? "";
        setUserName(name);
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

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

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, rotate: [0, 360] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full"
        />
      </div>
    );
  }

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

        <Link href="/settings/profile" className="no-underline">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <PixelCard className="cursor-pointer border border-gray-200 hover:opacity-90 transition-opacity">
              <div className="relative z-50 text-center">
                <h1 className="text-2xl font-bold tracking-tight">
                  {userName}
                </h1>
              </div>
            </PixelCard>
          </motion.div>
        </Link>
      </motion.header>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={itemVariants}
      >
        {/* Quick Stats Cards */}
        <motion.div variants={itemVariants}>
          <StatsCard
            title="Tasks"
            value="12"
            description="4 tasks due today"
            trend="+2 from yesterday"
            trendUp={true}
            icon={<CheckSquare className="h-5 w-5 text-blue-500" />}
            linkHref="/pages/tasks"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsCard
            title="Projects"
            value="6"
            description="2 active projects"
            trend="1 completed this week"
            trendUp={true}
            icon={<Folder className="h-5 w-5 text-purple-500" />}
            linkHref="/projects"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsCard
            title="Notes"
            value="23"
            description="5 updated recently"
            trend="+3 new this week"
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
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
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
            <CardContent className="p-0">
              <div className="divide-y dark:divide-zinc-800">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-4 p-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <motion.div
                      className={cn(
                        "h-10 w-10 rounded-md flex items-center justify-center shrink-0",
                        event.color
                      )}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Calendar className="h-5 w-5 text-white" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                        <span className="text-xs">•</span>
                        <span>{event.date}</span>
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
            </CardContent>
            <CardFooter className="border-t bg-zinc-50 dark:bg-zinc-900 p-4">
              <AnimatedButton variant="outline" className="w-full gap-1">
                <Plus className="h-4 w-4" />
                <span>Add New Event</span>
              </AnimatedButton>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Tasks Card */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
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
            <CardContent className="p-0">
              <div className="divide-y dark:divide-zinc-800">
                {tasks.map((task, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-4 p-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <motion.div
                      className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center border",
                        task.completed
                          ? "bg-green-100 border-green-500 dark:bg-green-900/30"
                          : "border-zinc-300 dark:border-zinc-700"
                      )}
                      whileHover={{ scale: 1.2 }}
                    >
                      {task.completed && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={cn(
                          "font-medium",
                          task.completed &&
                            "line-through text-zinc-500 dark:text-zinc-400"
                        )}
                      >
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <span>{task.project}</span>
                        {task.priority && (
                          <>
                            <span className="text-xs">•</span>
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded-full text-xs",
                                task.priority === "High"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                  : task.priority === "Medium"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              )}
                            >
                              {task.priority}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      {task.dueDate}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-zinc-50 dark:bg-zinc-900 p-4">
              <AnimatedButton variant="outline" className="w-full gap-1">
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
              <div className="divide-y dark:divide-zinc-800">
                {notes.map((note, index) => (
                  <motion.div
                    key={index}
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
                        <span>Updated {note.updatedAt}</span>
                        {note.starred && (
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
            </CardContent>
            <CardFooter className="border-t bg-zinc-50 dark:bg-zinc-900 p-4">
              <AnimatedButton variant="outline" className="w-full gap-1">
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
              : "text-red-600 dark:text-red-400"
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

// Mock Data
const upcomingEvents = [
  {
    title: "Team Weekly Sync",
    time: "10:00 AM - 11:00 AM",
    date: "Today",
    color: "bg-blue-500",
  },
  {
    title: "Project Deadline Review",
    time: "2:30 PM - 3:30 PM",
    date: "Today",
    color: "bg-purple-500",
  },
  {
    title: "Client Presentation",
    time: "9:00 AM - 10:30 AM",
    date: "Tomorrow",
    color: "bg-red-500",
  },
  {
    title: "Marketing Strategy Meeting",
    time: "1:00 PM - 2:00 PM",
    date: "Apr 20",
    color: "bg-green-500",
  },
];

const tasks = [
  {
    title: "Update dashboard UI design",
    project: "Website Redesign",
    priority: "High",
    dueDate: "Today",
    completed: false,
  },
  {
    title: "Review analytics report",
    project: "Marketing",
    priority: "Medium",
    dueDate: "Today",
    completed: false,
  },
  {
    title: "Send invoice to client",
    project: "Finance",
    priority: "Low",
    dueDate: "Tomorrow",
    completed: false,
  },
  {
    title: "Schedule weekly team meeting",
    project: "Team Management",
    dueDate: "Apr 19",
    completed: true,
  },
  {
    title: "Research new product features",
    project: "Product Development",
    priority: "Medium",
    dueDate: "Apr 20",
    completed: false,
  },
];

const notes = [
  {
    title: "Meeting Notes: Product Team",
    updatedAt: "2 hours ago",
    starred: true,
  },
  {
    title: "Client Requirements Doc",
    updatedAt: "Yesterday",
    starred: true,
  },
  {
    title: "Weekly Goals & Tasks",
    updatedAt: "2 days ago",
    starred: false,
  },
  {
    title: "Project Timeline & Milestones",
    updatedAt: "Apr 16",
    starred: false,
  },
  {
    title: "Research Links & Resources",
    updatedAt: "Apr 15",
    starred: false,
  },
];
