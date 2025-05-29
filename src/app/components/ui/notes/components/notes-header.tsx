import { type NotesStats } from "../lib/types";
import { type Note } from "@/app/schemas/notesSchema";
import { CreateNoteButton } from "./create-note-button";

interface NotesHeaderProps {
  stats: NotesStats;
  userId: string;
  onNotesChange: (notes: Note[]) => void;
}

export function NotesHeader({
  stats,
  userId,
  onNotesChange,
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
        </div>

        <CreateNoteButton userId={userId} onNotesChange={onNotesChange} />
      </div>
    </div>
  );
}
