"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
}

const NavItem = ({
  href,
  icon,
  label,
  isExpanded = false,
  isActive = false,
  children,
  onClick,
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
        {hasChildren ? (
          expanded ? (
            <ChevronDown className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0" />
          )
        ) : (
          <div className="w-4" />
        )}
        {icon}
        <span className="flex-1">{label}</span>
      </Link>
      {hasChildren && expanded && <div className="ml-6 mt-1">{children}</div>}
    </div>
  );
};

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "w-64 flex flex-col h-screen bg-white dark:bg-zinc-950 border-r",
        className
      )}
    >
      <div className="px-3 py-2">
        <div className="flex items-center justify-between text-xs text-zinc-500 px-3 py-1">
          <span>WORKSPACE</span>
          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-sm">
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-1 mt-1">
          <NavItem
            href="/"
            icon={<Settings className="h-4 w-4" />}
            label="Getting Started"
            isActive={pathname === "/dashboard"}
          />

          <NavItem
            href="/tasks"
            icon={<CheckSquare className="h-4 w-4" />}
            label="Tasks"
            isActive={pathname === "/tasks"}
          />

          <NavItem
            href="/calendar"
            icon={<CalendarDays className="h-4 w-4" />}
            label="Calendar"
            isActive={pathname === "/calendar"}
          />
        </div>
      </div>

      <div className="mt-auto p-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <span className="font-medium">My Workspace</span>
        </div>
      </div>
    </div>
  );
}
