"use client";

import { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";
import { type NotesStats } from "@/app/components/ui/notes/lib/types";
import { type Note } from "@/app/schemas/notesSchema";
import {
  fetchUserNotes,
  calculateNotesStats,
} from "../../components/ui/notes/lib/notes-client";
import { NotesHeader } from "@/app/components/ui/notes/components/notes-header";
import { NotesGrid } from "@/app/components/ui/notes/components/notes-grid";
import { SearchBar } from "@/app/components/ui/notes/components/search-bar";
import { LoadingSpinner } from "@/app/components/ui/notes/components/loading-spinner";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [stats, setStats] = useState<NotesStats>({
    total: 0,
    updatedRecently: 0,
    newThisWeek: 0,
  });
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user and their notes
  useEffect(() => {
    const fetchUserAndNotes = async () => {
      try {
        // Get the current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("Please log in to view your notes");
          setLoading(false);
          return;
        }

        setUserId(user.id);

        // Fetch notes for this user
        const notesData = await fetchUserNotes(user.id);
        setNotes(notesData);
        setStats(calculateNotesStats(notesData));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load notes data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndNotes();
  }, []);

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-lg font-medium">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <NotesHeader
          stats={stats}
          userId={userId}
          onNotesChange={(newNotes) => {
            setNotes(newNotes);
            setStats(calculateNotesStats(newNotes));
          }}
        />

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredNotes.length} of {notes.length} notes
            </span>
          </div>
        </div>

        <NotesGrid
          notes={filteredNotes}
          userId={userId}
          onNotesChange={(newNotes) => {
            setNotes(newNotes);
            setStats(calculateNotesStats(newNotes));
          }}
        />
      </div>
    </div>
  );
}
