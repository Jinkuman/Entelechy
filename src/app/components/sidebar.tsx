"use client";

import { useState, useEffect } from "react";
import {
  CalendarDays,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  ChevronLeftCircle,
  ChevronRightCircle,
  Settings,
  Home,
  Folder,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
  const router = useRouter();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

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
        }
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Clean up event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router, collapsed]); // Add collapsed to dependency array

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

          <NavItem
            href="/pages/calendar"
            icon={<CalendarDays className="h-4 w-4" />}
            label="Calendar"
            isActive={pathname.includes("/calendar")}
            isSidebarCollapsed={collapsed}
          />

          <NavItem
            href="/pages/settings"
            icon={<Settings className="h-4 w-4" />}
            label="Settings"
            isActive={pathname.includes("/pages/settings")}
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

      {/* User profile at bottom */}
      <div className="mt-auto p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-sm">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white font-medium">
            {!collapsed && "ME"}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="font-medium truncate">My Workspace</div>
              <div className="text-xs text-zinc-500 truncate">
                user@example.com
              </div>
            </div>
          )}
        </div>
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
