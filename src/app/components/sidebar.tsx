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
  const hasChildren = !!children;

  return (
    <div>
      <Link
        href={href}
        className={cn(
          "flex items-center rounded-md px-3 py-2 text-sm font-medium gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors",
          isActive && "bg-zinc-100 dark:bg-zinc-800"
        )}
        onClick={(e) => {
          if (hasChildren && onClick) {
            e.preventDefault();
            onClick();
            setExpanded(!expanded);
          }
        }}
      >
        {hasChildren && !isSidebarCollapsed ? (
          expanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-zinc-500" />
          )
        ) : (
          <div className={isSidebarCollapsed ? "hidden" : "w-4"} />
        )}
        <div
          className={cn(
            "text-zinc-600 dark:text-zinc-400",
            isActive && "text-zinc-900 dark:text-white"
          )}
        >
          {icon}
        </div>
        {!isSidebarCollapsed && <span className="flex-1">{label}</span>}
      </Link>
      {hasChildren && expanded && !isSidebarCollapsed && (
        <div className="ml-6 mt-1 space-y-1">{children}</div>
      )}
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
  const displayName = user?.user_metadata?.full_name || user?.email || "User";
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
    <div
      className={cn(
        "flex flex-col h-screen bg-white dark:bg-zinc-950 border-r relative transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="px-3 py-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between text-xs text-zinc-500 px-3 py-1 mb-4">
          {!collapsed && <span className="font-semibold">WORKSPACE</span>}
        </div>

        <div className="space-y-1 mt-1">
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
        </div>
      </div>

      {/* Keyboard shortcuts info */}
      {!collapsed && (
        <div className="px-4 py-2 border-t border-zinc-200 dark:border-zinc-800">
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
        </div>
      )}

      {/* User profile at bottom with side-expanding dropdown */}
      <div
        className="mt-auto border-t border-zinc-200 dark:border-zinc-800 relative"
        ref={profileRef}
      >
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-full p-4 flex items-center gap-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white font-medium">
            {!collapsed && "ME"}
          </div>
          {!collapsed && (
            <div className="overflow-hidden flex-1 text-left">
              <div className="font-medium truncate dark:text-white">
                {loading ? "Loading..." : displayName}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                {loading ? "..." : email}
              </div>
            </div>
          )}
          {!collapsed && (
            <ChevronDown
              className="h-4 w-4 text-zinc-500 transition-transform duration-200"
              style={{
                transform: profileOpen ? "rotate(270deg)" : "rotate(90deg)",
              }}
            />
          )}
        </button>

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
                "absolute bottom-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-r-lg shadow-xl overflow-hidden z-50",
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
                    className="w-full px-4 py-3 text-sm text-left flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <User className="h-4 w-4 text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300" />
                    </motion.div>
                    <span className="dark:text-white">Profile Settings</span>
                  </motion.button>

                  {/* Dark Mode Toggle with Enhanced Animation */}
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    onClick={toggleDarkMode}
                    className="w-full px-4 py-3 text-sm text-left flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group"
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
                            <Sun className="h-4 w-4 text-yellow-500" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="moon"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Moon className="h-4 w-4 text-indigo-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    <span className="dark:text-white">
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
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-3 text-sm text-left flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400 group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, x: 2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <LogOut className="h-4 w-4" />
                      </motion.div>
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse/Expand toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full p-1 shadow-sm hover:shadow transition-all"
        title="Toggle Sidebar (Ctrl+S)"
      >
        {collapsed ? (
          <ChevronRightCircle className="h-4 w-4 text-zinc-500" />
        ) : (
          <ChevronLeftCircle className="h-4 w-4 text-zinc-500" />
        )}
      </button>
    </div>
  );
}
