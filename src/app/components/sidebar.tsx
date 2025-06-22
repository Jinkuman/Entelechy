// components/Sidebar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "../hooks/useUser";
import supabase from "@/lib/supabaseClient";
import {
  CalendarDays,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  ChevronLeftCircle,
  ChevronRightCircle,
  Settings,
  Home,
  FileText,
  LogOut,
  User,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // Add other properties if needed
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isExpanded?: boolean;
  isActive?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  isSidebarCollapsed?: boolean;
}

const NavItem = ({
  href,
  icon,
  label,
  isExpanded = false,
  isActive = false,
  children,
  onClick,
  isSidebarCollapsed = false,
}: NavItemProps) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const hasChildren = !!children;

  return (
    <div>
      <Link
        href={href}
        className={cn(
          "flex items-center rounded-md px-3 py-2 text-sm font-medium gap-2 transition-all duration-200 cursor-pointer relative overflow-hidden group",
          "hover:bg-gradient-to-r hover:from-zinc-50 hover:to-zinc-100/50 dark:hover:from-zinc-800 dark:hover:to-zinc-700/50",
          "hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]",
          isActive &&
            "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-sm border border-blue-100 dark:border-blue-800/30"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onClick={(e) => {
          if (hasChildren && onClick) {
            e.preventDefault();
            onClick();
            setExpanded(!expanded);
          }
        }}
      >
        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0"
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
        />

        {hasChildren && !isSidebarCollapsed ? (
          <motion.div
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10"
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
            )}
          </motion.div>
        ) : (
          <div className={isSidebarCollapsed ? "hidden" : "w-4"} />
        )}

        <motion.div
          className={cn(
            "text-zinc-600 dark:text-zinc-400 relative z-10 transition-colors duration-200",
            isActive && "text-blue-600 dark:text-blue-400",
            isHovered && !isActive && "text-zinc-800 dark:text-zinc-200"
          )}
          animate={{
            scale: isPressed ? 0.95 : 1,
            rotate: isHovered ? [0, -2, 2, 0] : 0,
          }}
          transition={{
            scale: { duration: 0.1 },
            rotate: { duration: 0.4, ease: "easeInOut" },
          }}
        >
          {icon}
        </motion.div>

        {!isSidebarCollapsed && (
          <motion.span
            className={cn(
              "flex-1 relative z-10 transition-colors duration-200",
              isActive && "text-blue-700 dark:text-blue-300 font-semibold",
              isHovered && !isActive && "text-zinc-800 dark:text-zinc-200"
            )}
            animate={{
              x: isHovered ? 2 : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>
        )}

        {/* Active indicator line */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        {/* Hover shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 -skew-x-12"
          animate={{
            x: isHovered ? ["−100%", "100%"] : "-100%",
            opacity: isHovered ? [0, 1, 0] : 0,
          }}
          transition={{
            x: { duration: 0.6, ease: "easeInOut" },
            opacity: { duration: 0.6, ease: "easeInOut" },
          }}
        />
      </Link>

      <AnimatePresence>
        {hasChildren && expanded && !isSidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="ml-6 mt-1 space-y-1 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, loading, error } = useUser();
  const name =
    user?.user_metadata?.name ||
    user?.email || // Fallback to email
    "User";
  const email = user?.email || "user@example.com";

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    // Check for stored preference first
    const storedPreference = localStorage.getItem("darkMode");

    if (storedPreference !== null) {
      // Use stored preference if available
      const isDarkMode = storedPreference === "true";
      setDarkMode(isDarkMode);

      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else if (typeof window !== "undefined") {
      // Fall back to system preference if no stored preference
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(isDarkMode);

      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error.message);
      } else {
        router.push("/auth/sign-in");
      }
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Store preference in localStorage to persist across pages
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger shortcuts when Ctrl key is pressed
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case "s": // Toggle sidebar
            e.preventDefault();
            setCollapsed(!collapsed); // Directly toggle the state
            break;
          case "t": // Tasks page
            e.preventDefault();
            router.push("/pages/tasks");
            break;
          case "n": // Notes page
            e.preventDefault();
            router.push("/pages/notes");
            break;
          case "c": // Calendar page
            e.preventDefault();
            router.push("/pages/calendar");
            break;
          case "h": // Dashboard
            e.preventDefault();
            router.push("/");
            break;
          case "d": // Toggle dark mode
            e.preventDefault();
            toggleDarkMode();
            break;
        }
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Clean up event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router, collapsed, darkMode]); // Add darkMode to dependency array

  return (
    <motion.div
      className={cn(
        "flex flex-col h-screen bg-gradient-to-b from-white to-zinc-50/50 dark:from-zinc-950 dark:to-zinc-900/50 border-r border-zinc-200/80 dark:border-zinc-800/80 relative backdrop-blur-sm",
        collapsed ? "w-16" : "w-64",
        className
      )}
      initial={false}
      animate={{
        width: collapsed ? 64 : 256,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="px-3 py-4 flex-1 overflow-y-auto">
        <motion.div
          className="flex items-center justify-between text-xs text-zinc-500 px-3 py-1 mb-4"
          animate={{ opacity: collapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {!collapsed && (
            <motion.span
              className="font-semibold tracking-wider"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              WORKSPACE
            </motion.span>
          )}
        </motion.div>

        <motion.div
          className="space-y-1 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <NavItem
            href="/"
            icon={<Home className="h-4 w-4" />}
            label="Dashboard"
            isActive={pathname === "/"}
            isSidebarCollapsed={collapsed}
          />

          <NavItem
            href="/pages/calendar"
            icon={<CalendarDays className="h-4 w-4" />}
            label="Calendar"
            isActive={pathname.includes("/calendar")}
            isSidebarCollapsed={collapsed}
          />

          <NavItem
            href="/pages/tasks"
            icon={<CheckSquare className="h-4 w-4" />}
            label="Tasks"
            isActive={pathname.includes("/tasks")}
            isSidebarCollapsed={collapsed}
          />

          <NavItem
            href="/pages/notes"
            icon={<FileText className="h-4 w-4" />}
            label="Notes"
            isActive={pathname.includes("/notes")}
            isSidebarCollapsed={collapsed}
          />
        </motion.div>
      </div>

      {/* Keyboard shortcuts info */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="px-4 py-2 border-t border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-t from-zinc-50/50 to-transparent dark:from-zinc-900/50"
          >
            <div className="text-xs text-zinc-500">
              <p className="font-medium mb-1">Keyboard Shortcuts:</p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                <span>Ctrl+S</span>
                <span>Toggle Sidebar</span>
                <span>Ctrl+D</span>
                <span>Toggle Dark Mode</span>
                <span>Ctrl+T</span>
                <span>Tasks</span>
                <span>Ctrl+N</span>
                <span>Notes</span>
                <span>Ctrl+C</span>
                <span>Calendar</span>
                <span>Ctrl+H</span>
                <span>Home</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User profile at bottom with side-expanding dropdown */}
      <div
        className="mt-auto border-t border-zinc-200/60 dark:border-zinc-800/60 relative bg-gradient-to-t from-zinc-50/30 to-transparent dark:from-zinc-900/30"
        ref={profileRef}
      >
        <motion.button
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-full p-4 flex items-center gap-2 text-sm hover:bg-gradient-to-r hover:from-zinc-50 hover:to-zinc-100/50 dark:hover:from-zinc-900 dark:hover:to-zinc-800/50 transition-all duration-200 cursor-pointer relative group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Profile avatar with enhanced animation */}
          <motion.div
            className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex-shrink-0 flex items-center justify-center text-white font-medium shadow-lg relative overflow-hidden"
            whileHover={{
              scale: 1.1,
              rotate: [0, -5, 5, 0],
              boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)",
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated background pulse */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-0"
              animate={{
                opacity: [0, 0.3, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {!collapsed && <span className="relative z-10">ME</span>}
          </motion.div>

          {!collapsed && (
            <motion.div
              className="overflow-hidden flex-1 text-left"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <div className="font-medium truncate dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                {loading ? "Loading..." : name}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                {loading ? "..." : email}
              </div>
            </motion.div>
          )}

          {!collapsed && (
            <motion.div
              animate={{
                rotate: profileOpen ? 180 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <ChevronDown className="h-4 w-4 text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors duration-200" />
            </motion.div>
          )}
        </motion.button>

        {/* Side-expanding Profile Dropdown with Roll-out Animation */}
        <AnimatePresence>
          {profileOpen && (
            <motion.div
              initial={{
                opacity: 0,
                width: 0,
                x: collapsed ? -200 : 0,
              }}
              animate={{
                opacity: 1,
                width: 240,
                x: 0,
              }}
              exit={{
                opacity: 0,
                width: 0,
                x: collapsed ? -200 : 0,
              }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0.0, 0.2, 1], // Custom easing for smooth roll-out
                opacity: { duration: 0.2 },
                width: { duration: 0.4 },
                x: { duration: 0.4 },
              }}
              className={cn(
                "absolute bottom-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-r-lg shadow-2xl overflow-hidden z-50",
                collapsed ? "left-full" : "left-full"
              )}
              style={{
                height: "fit-content",
              }}
            >
              <div className="py-2 min-w-60">
                {/* Menu Items with Staggered Animation */}
                <div className="py-1">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="w-full px-4 py-3 text-sm text-left flex items-center gap-3 hover:bg-gradient-to-r hover:from-zinc-50 hover:to-zinc-100/50 dark:hover:from-zinc-800 dark:hover:to-zinc-700/50 transition-all duration-200 cursor-pointer group"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <User className="h-4 w-4 text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                    </motion.div>
                    <span className="dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
                      Profile Settings
                    </span>
                  </motion.button>

                  {/* Dark Mode Toggle with Enhanced Animation */}
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    onClick={toggleDarkMode}
                    className="w-full px-4 py-3 text-sm text-left flex items-center gap-3 hover:bg-gradient-to-r hover:from-zinc-50 hover:to-zinc-100/50 dark:hover:from-zinc-800 dark:hover:to-zinc-700/50 transition-all duration-200 cursor-pointer group"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      animate={{
                        rotate: darkMode ? 360 : 0,
                        scale: darkMode ? 1.1 : 1,
                      }}
                      whileHover={{ scale: 1.2 }}
                      transition={{
                        rotate: { duration: 0.6 },
                        scale: { duration: 0.2 },
                      }}
                      className="relative h-4 w-4 flex items-center justify-center"
                    >
                      <AnimatePresence mode="wait">
                        {darkMode ? (
                          <motion.div
                            key="sun"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Sun className="h-4 w-4 text-yellow-500 drop-shadow-sm" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="moon"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Moon className="h-4 w-4 text-indigo-500 drop-shadow-sm" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    <span className="dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-200">
                      {darkMode
                        ? "Switch to Light Mode"
                        : "Switch to Dark Mode"}
                    </span>
                  </motion.button>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="border-t border-zinc-200 dark:border-zinc-800 mt-1 pt-1"
                  >
                    <motion.button
                      onClick={handleSignOut}
                      className="w-full px-4 py-3 text-sm text-left flex items-center gap-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100/50 dark:hover:from-red-900/20 dark:hover:to-red-800/20 transition-all duration-200 text-red-600 dark:text-red-400 group cursor-pointer"
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, x: 2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <LogOut className="h-4 w-4 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-200" />
                      </motion.div>
                      <span className="group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-200">
                        Sign Out
                      </span>
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse/Expand toggle button */}
      <motion.button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-full p-1 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
        title="Toggle Sidebar (Ctrl+S)"
        whileHover={{
          scale: 1.1,
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: collapsed ? 0 : 180 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {collapsed ? (
            <ChevronRightCircle className="h-4 w-4 text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
          ) : (
            <ChevronLeftCircle className="h-4 w-4 text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
          )}
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
