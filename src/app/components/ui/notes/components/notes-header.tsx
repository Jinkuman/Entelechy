import { type NotesStats } from "../lib/types";
import { type Note } from "@/app/schemas/notesSchema";
import { CreateNoteButton } from "./create-note-button";
import { StarIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface NotesHeaderProps {
  stats: NotesStats;
  userId: string;
  onNotesChange: (notes: Note[]) => void;
  openCreateNote?: boolean;
  setOpenCreateNote?: (open: boolean) => void;
}

export function NotesHeader({
  stats,
  userId,
  onNotesChange,
  openCreateNote = false,
  setOpenCreateNote,
}: NotesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Notes
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Capture your thoughts and ideas
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total notes
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.updatedRecently}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Updated recently
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              +{stats.newThisWeek}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              New this week
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 flex items-center justify-center gap-1">
              <StarIcon className="h-5 w-5" />
              {stats.starred}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Starred
            </div>
          </div>
        </div>

        {/* Floating Plus Button in Header */}
        <motion.button
          className="cursor-pointer rounded-full p-3 bg-blue-600 text-white shadow-lg"
          onClick={() => setOpenCreateNote && setOpenCreateNote(true)}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Plus size={24} />
        </motion.button>
      </div>
    </div>
  );
}
