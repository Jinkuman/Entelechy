"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import supabase from "@/lib/supabaseClient";
import { type NotesStats } from "@/app/components/ui/notes/lib/types";
import { type Note } from "@/app/schemas/notesSchema";
import {
  fetchUserNotes,
  calculateNotesStats,
  getAllTags,
  filterNotesByTags,
} from "../../components/ui/notes/lib/notes-client";
import { NotesHeader } from "@/app/components/ui/notes/components/notes-header";
import { NotesGrid } from "@/app/components/ui/notes/components/notes-grid";
import { SearchBar } from "@/app/components/ui/notes/components/search-bar";
import { TagFilter } from "@/app/components/ui/notes/components/tag-filter";
import { LoadingSpinner } from "@/app/components/ui/notes/components/loading-spinner";
import { CreateNoteButton } from "@/app/components/ui/notes/components/create-note-button";
import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

export default function NotesPage() {
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [stats, setStats] = useState<NotesStats>({
    total: 0,
    updatedRecently: 0,
    newThisWeek: 0,
    totalTags: 0,
    starred: 0,
  });
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [openCreateNote, setOpenCreateNote] = useState(false);

  // Check for URL parameters to open create note dialog
  useEffect(() => {
    const openParam = searchParams.get("open");
    if (openParam === "create-note") {
      setOpenCreateNote(true);
    }
  }, [searchParams]);

  // Fetch user and their notes
  useEffect(() => {
    const fetchUserAndNotes = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("Please log in to view your notes");
          setLoading(false);
          return;
        }

        setUserId(user.id);

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

  // Get available tags
  const availableTags = useMemo(() => getAllTags(notes), [notes]);

  // Filter notes based on search query, selected tags, and starred status
  const filteredNotes = useMemo(() => {
    let filtered = notes;

    // Apply starred filter first
    if (showStarredOnly) {
      filtered = filtered.filter((note) => note.starred);
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filterNotesByTags(filtered, selectedTags);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      if (searchQuery.startsWith("#")) {
        // Tag search
        const tagQuery = searchQuery.slice(1).toLowerCase();
        filtered = filtered.filter((note) => {
          const noteTags = Array.isArray(note.tags) ? note.tags : [];
          return noteTags.some((tag) => tag.toLowerCase().includes(tagQuery));
        });
      } else {
        // Content and title search
        filtered = filtered.filter(
          (note) =>
            note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (note.title &&
              note.title.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
    }

    // Sort: starred notes first, then by updated_at
    filtered.sort((a, b) => {
      if (a.starred && !b.starred) return -1;
      if (!a.starred && b.starred) return 1;
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });

    return filtered;
  }, [notes, searchQuery, selectedTags, showStarredOnly]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-800 flex items-center justify-center">
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
          openCreateNote={openCreateNote}
          setOpenCreateNote={setOpenCreateNote}
        />

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 flex-1">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <TagFilter
              availableTags={availableTags}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
            />
            {/* Starred Filter Button */}
            <button
              onClick={() => setShowStarredOnly(!showStarredOnly)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors duration-200 ${
                showStarredOnly
                  ? "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-zinc-800 dark:border-yellow-800 dark:text-yellow-400"
                  : "bg-white dark:bg-zinc-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {showStarredOnly ? (
                <StarIconSolid className="h-4 w-4" />
              ) : (
                <StarIcon className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {showStarredOnly ? "Starred" : "All"}
              </span>
            </button>
          </div>
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

      {/* CreateNoteButton Component - renders when needed */}
      {openCreateNote && (
        <CreateNoteButton
          userId={userId}
          onNotesChange={(newNotes) => {
            setNotes(newNotes);
            setStats(calculateNotesStats(newNotes));
          }}
          openCreateNote={openCreateNote}
          setOpenCreateNote={setOpenCreateNote}
        />
      )}
    </div>
  );
}
