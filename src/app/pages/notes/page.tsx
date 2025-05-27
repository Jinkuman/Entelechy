"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  MoreHorizontal,
  Plus,
  ArrowLeft,
  CheckCircle,
  Search,
  Trash2,
  Moon,
  Sun,
  Tag,
  Star,
  StarOff,
  Clock,
  X,
  Save,
  Image,
  Link,
  List,
  ListOrdered,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  Filter,
  SortDesc,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAutoAnimate } from "@formkit/auto-animate/react";

// Define note interface with enhanced properties
interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  date: string;
  time?: string;
  tags: string[];
  isPinned: boolean;
  lastEdited: string;
  isArchived: boolean;
}

// Define tag interface
interface Tag {
  id: string;
  name: string;
  color: string;
}

// Sample initial notes data
const initialNotes: Note[] = [
  {
    id: "1",
    title: "Mid test exam",
    content:
      "Ultrices viverra odio congue felis, libero egestas nunc lacus erat massa, elit ornare eget sem velit in vitam. In augue cursus ut adipiscing felis, diam volutpat mauris, id and",
    color: "bg-yellow-200 dark:bg-yellow-800",
    date: "12/13/2021",
    time: "10:30 PM Monday",
    tags: ["study", "important"],
    isPinned: true,
    lastEdited: "2021-12-13T22:30:00",
    isArchived: false,
  },
  {
    id: "2",
    title: "Project ideas",
    content:
      "Ultrices viverra odio congue felis, libero egestas nunc lacus erat massa, elit ornare eget sem velit in vitam. In augue cursus ut adipiscing felis, diam volutpat mauris, id and",
    color: "bg-red-200 dark:bg-red-800",
    date: "12/13/2021",
    time: "10:30 PM Monday",
    tags: ["work", "ideas"],
    isPinned: false,
    lastEdited: "2021-12-13T22:30:00",
    isArchived: false,
  },
  {
    id: "3",
    title: "Jinku's notes",
    content:
      "Porta viverra odio congue felis, libero egestas nunc lacus erat massa, elit ornare eget sem velit in vitam.",
    color: "bg-blue-200 dark:bg-blue-800",
    date: "12/14/2021",
    time: "04:15 PM Sunday",
    tags: ["personal"],
    isPinned: false,
    lastEdited: "2021-12-14T16:15:00",
    isArchived: false,
  },
];

// Sample initial tags
const initialTags: Tag[] = [
  { id: "1", name: "work", color: "bg-blue-500 dark:bg-blue-600" },
  { id: "2", name: "personal", color: "bg-green-500 dark:bg-green-600" },
  { id: "3", name: "ideas", color: "bg-purple-500 dark:bg-purple-600" },
  { id: "4", name: "study", color: "bg-yellow-500 dark:bg-yellow-600" },
  { id: "5", name: "important", color: "bg-red-500 dark:bg-red-600" },
];

// Color options for new notes
const colorOptions = [
  { id: "yellow", class: "bg-yellow-200 dark:bg-yellow-800" },
  { id: "red", class: "bg-red-200 dark:bg-red-800" },
  { id: "blue", class: "bg-blue-200 dark:bg-blue-800" },
  { id: "green", class: "bg-green-200 dark:bg-green-800" },
  { id: "purple", class: "bg-purple-200 dark:bg-purple-800" },
  { id: "indigo", class: "bg-indigo-200 dark:bg-indigo-800" },
  { id: "pink", class: "bg-pink-200 dark:bg-pink-800" },
  { id: "gray", class: "bg-gray-200 dark:bg-gray-700" },
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"date" | "title" | "edited">("edited");
  const [showArchived, setShowArchived] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(
    "bg-blue-500 dark:bg-blue-600"
  );
  const [showTagsMenu, setShowTagsMenu] = useState(false);
  const [animationParent] = useAutoAnimate();
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const [newNote, setNewNote] = useState<Note>({
    id: "",
    title: "",
    content: "",
    color: "bg-yellow-200 dark:bg-yellow-800",
    date: new Date().toLocaleDateString(),
    tags: [],
    isPinned: false,
    lastEdited: new Date().toISOString(),
    isArchived: false,
  });

  // Initialize dark mode based on system preference
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    // Load notes from localStorage if available
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error("Failed to parse saved notes");
      }
    }

    const savedTags = localStorage.getItem("tags");
    if (savedTags) {
      try {
        setTags(JSON.parse(savedTags));
      } catch (e) {
        console.error("Failed to parse saved tags");
      }
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Save tags to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tags", JSON.stringify(tags));
  }, [tags]);

  // Filter and sort notes based on current filters
  const filteredNotes = notes
    .filter((note) => {
      // Filter by archive status
      if (showArchived !== note.isArchived) return false;

      // Filter by search query
      if (
        searchQuery &&
        !note.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;

      // Filter by selected tags
      if (
        selectedTags.length > 0 &&
        !selectedTags.some((tag) => note.tags.includes(tag))
      )
        return false;

      // Filter by time
      if (timeFilter !== "All") {
        const noteDate = new Date(note.lastEdited);
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        const monthAgo = new Date();
        monthAgo.setMonth(today.getMonth() - 1);

        if (
          timeFilter === "Today" &&
          noteDate.toDateString() !== today.toDateString()
        )
          return false;
        if (
          timeFilter === "This Week" &&
          (noteDate < weekAgo || noteDate > today)
        )
          return false;
        if (
          timeFilter === "This Month" &&
          (noteDate < monthAgo || noteDate > today)
        )
          return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by pinned status first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Then sort by the selected sort method
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else {
        // Sort by last edited
        return (
          new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
        );
      }
    });

  // Handle note selection
  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(false);
  };

  // Handle going back to all notes
  const handleBackToNotes = () => {
    setSelectedNote(null);
    setIsEditing(false);
  };

  // Toggle new note creation
  const handleToggleCreate = () => {
    setIsCreating(!isCreating);
    if (!isCreating) {
      setNewNote({
        id: Date.now().toString(),
        title: "",
        content: "",
        color: "bg-yellow-200 dark:bg-yellow-800",
        date: new Date().toLocaleDateString(),
        tags: [],
        isPinned: false,
        lastEdited: new Date().toISOString(),
        isArchived: false,
      });
    }
  };

  // Update new note fields
  const handleNewNoteChange = (
    field: keyof Note,
    value: string | string[] | boolean
  ) => {
    setNewNote((prev) => ({ ...prev, [field]: value }));
  };

  // Select color for new note
  const handleColorSelect = (colorClass: string) => {
    if (isEditing && selectedNote) {
      setSelectedNote({ ...selectedNote, color: colorClass });
    } else {
      setNewNote((prev) => ({ ...prev, color: colorClass }));
    }
  };

  // Save new note
  const handleSaveNote = () => {
    if (
      (isCreating && newNote.title.trim() === "") ||
      (isEditing && selectedNote && selectedNote.title.trim() === "")
    )
      return;

    const now = new Date();
    const timeStr = `${now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} ${now.toLocaleDateString("en-US", { weekday: "long" })}`;

    if (isEditing && selectedNote) {
      const updatedNote = {
        ...selectedNote,
        lastEdited: now.toISOString(),
        time: timeStr,
      };

      setNotes((prev) =>
        prev.map((note) => (note.id === updatedNote.id ? updatedNote : note))
      );
      setSelectedNote(updatedNote);
      setIsEditing(false);
    } else {
      const noteToSave = {
        ...newNote,
        time: timeStr,
        lastEdited: now.toISOString(),
      };

      setNotes((prev) => [noteToSave, ...prev]);
      setIsCreating(false);
      setNewNote({
        id: "",
        title: "",
        content: "",
        color: "bg-yellow-200 dark:bg-yellow-800",
        date: new Date().toLocaleDateString(),
        tags: [],
        isPinned: false,
        lastEdited: new Date().toISOString(),
        isArchived: false,
      });
    }
  };

  // Delete note
  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
    }
  };

  // Toggle pin status
  const handleTogglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      )
    );

    if (selectedNote && selectedNote.id === id) {
      setSelectedNote({ ...selectedNote, isPinned: !selectedNote.isPinned });
    }
  };

  // Toggle archive status
  const handleToggleArchive = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, isArchived: !note.isArchived } : note
      )
    );

    if (selectedNote && selectedNote.id === id) {
      setSelectedNote({
        ...selectedNote,
        isArchived: !selectedNote.isArchived,
      });
    }
  };

  // Add tag to note
  const handleAddTagToNote = (noteId: string, tagName: string) => {
    setNotes((prev) =>
      prev.map((note) => {
        if (note.id === noteId) {
          const updatedTags = note.tags.includes(tagName)
            ? note.tags.filter((t) => t !== tagName)
            : [...note.tags, tagName];
          return { ...note, tags: updatedTags };
        }
        return note;
      })
    );

    if (selectedNote && selectedNote.id === noteId) {
      const updatedTags = selectedNote.tags.includes(tagName)
        ? selectedNote.tags.filter((t) => t !== tagName)
        : [...selectedNote.tags, tagName];
      setSelectedNote({ ...selectedNote, tags: updatedTags });
    }
  };

  // Create new tag
  const handleCreateTag = () => {
    if (newTagName.trim() === "") return;

    const newTag: Tag = {
      id: Date.now().toString(),
      name: newTagName.trim().toLowerCase(),
      color: newTagColor,
    };

    setTags((prev) => [...prev, newTag]);
    setNewTagName("");
    setIsAddingTag(false);
  };

  // Format text in rich text editor
  const handleFormatText = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    if (contentEditableRef.current) {
      contentEditableRef.current.focus();
    }
  };

  // Start editing note
  const handleStartEditing = () => {
    setIsEditing(true);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="container mx-auto px-4 py-6 max-w-6xl dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Notes</h1>
          <div className="flex gap-3 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search notes..."
                className="px-4 py-2 pl-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              />
            </div>

            <motion.button
              onClick={handleToggleCreate}
              className="cursor-pointer rounded-full p-3 bg-blue-600 dark:bg-blue-700 text-white shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              aria-label="Create new note"
            >
              <Plus size={24} />
            </motion.button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-6">
            {/* Filter controls */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Filters</h2>
                <Filter
                  size={16}
                  className="text-gray-500 dark:text-gray-400"
                />
              </div>

              <div className="space-y-4">
                {/* Time filter */}
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">
                    Time Period
                  </label>
                  <select
                    className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                  >
                    <option value="All">All Time</option>
                    <option value="Today">Today</option>
                    <option value="This Week">This Week</option>
                    <option value="This Month">This Month</option>
                  </select>
                </div>

                {/* Sort by */}
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">
                    Sort By
                  </label>
                  <select
                    className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "date" | "title" | "edited")
                    }
                  >
                    <option value="edited">Last Edited</option>
                    <option value="date">Date Created</option>
                    <option value="title">Title</option>
                  </select>
                </div>

                {/* Archive toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Show Archived
                  </span>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      showArchived
                        ? "bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    onClick={() => setShowArchived(!showArchived)}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showArchived ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Tags section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Tags</h2>
                <button
                  onClick={() => setIsAddingTag(true)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="space-y-2" ref={animationParent}>
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between"
                  >
                    <button
                      className={`flex items-center px-3 py-1 rounded-full text-xs ${
                        selectedTags.includes(tag.name)
                          ? tag.color + " text-white"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                      onClick={() => {
                        setSelectedTags((prev) =>
                          prev.includes(tag.name)
                            ? prev.filter((t) => t !== tag.name)
                            : [...prev, tag.name]
                        );
                      }}
                    >
                      <span className="mr-1">#</span>
                      {tag.name}
                    </button>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {
                        notes.filter((note) => note.tags.includes(tag.name))
                          .length
                      }
                    </span>
                  </div>
                ))}

                {tags.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No tags created yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* Notes grid with animation */}
            <motion.div
              layout
              className={`grid ${
                selectedNote
                  ? "grid-cols-1"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
              } gap-4`}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <AnimatePresence mode="wait">
                {selectedNote ? (
                  <motion.div
                    key="selected-note"
                    layoutId={selectedNote.id}
                    className={`${selectedNote.color} rounded-lg p-4 shadow-md`}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <motion.button
                        onClick={handleBackToNotes}
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ArrowLeft size={20} />
                      </motion.button>
                      <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center">
                        <Clock size={14} className="mr-1" />
                        {new Date(selectedNote.lastEdited).toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleTogglePin(selectedNote.id)}
                          className={`${
                            selectedNote.isPinned
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-gray-600 dark:text-gray-300"
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title={
                            selectedNote.isPinned ? "Unpin note" : "Pin note"
                          }
                        >
                          {selectedNote.isPinned ? (
                            <Star size={20} />
                          ) : (
                            <StarOff size={20} />
                          )}
                        </motion.button>
                        <motion.button
                          onClick={() => handleToggleArchive(selectedNote.id)}
                          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title={
                            selectedNote.isArchived
                              ? "Unarchive note"
                              : "Archive note"
                          }
                        >
                          {selectedNote.isArchived ? (
                            <Calendar size={20} />
                          ) : (
                            <Calendar size={20} />
                          )}
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteNote(selectedNote.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="Delete note"
                        >
                          <Trash2 size={20} />
                        </motion.button>
                        {!isEditing ? (
                          <motion.button
                            onClick={handleStartEditing}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            title="Edit note"
                          >
                            <MoreHorizontal size={20} />
                          </motion.button>
                        ) : (
                          <motion.button
                            onClick={handleSaveNote}
                            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            title="Save changes"
                          >
                            <Save size={20} />
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          className="text-xl font-semibold bg-transparent border-b border-gray-300 dark:border-gray-600 outline-none w-full mb-3"
                          value={selectedNote.title}
                          onChange={(e) =>
                            setSelectedNote({
                              ...selectedNote,
                              title: e.target.value,
                            })
                          }
                        />

                        <div className="mb-3 flex flex-wrap gap-2">
                          {colorOptions.map((color) => (
                            <motion.button
                              key={color.id}
                              className={`w-6 h-6 rounded-full ${color.class} ${
                                selectedNote.color === color.class
                                  ? "ring-2 ring-blue-600 dark:ring-blue-400"
                                  : ""
                              }`}
                              onClick={() => handleColorSelect(color.class)}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            />
                          ))}
                        </div>

                        <div className="mb-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                          <div className="flex flex-wrap gap-1 p-1 border-b border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
                            <button
                              onClick={() => handleFormatText("bold")}
                              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                              title="Bold"
                            >
                              <Bold size={16} />
                            </button>
                            <button
                              onClick={() => handleFormatText("italic")}
                              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                              title="Italic"
                            >
                              <Italic size={16} />
                            </button>
                            <button
                              onClick={() => handleFormatText("underline")}
                              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                              title="Underline"
                            >
                              <Underline size={16} />
                            </button>
                            <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                            <button
                              onClick={() =>
                                handleFormatText("insertUnorderedList")
                              }
                              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                              title="Bullet list"
                            >
                              <List size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleFormatText("insertOrderedList")
                              }
                              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                              title="Numbered list"
                            >
                              <ListOrdered size={16} />
                            </button>
                            <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                            <button
                              onClick={() => {
                                const url = prompt("Enter link URL:");
                                if (url) handleFormatText("createLink", url);
                              }}
                              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                              title="Insert link"
                            >
                              <Link size={16} />
                            </button>
                            <button
                              onClick={() => {
                                const url = prompt("Enter image URL:");
                                if (url) handleFormatText("insertImage", url);
                              }}
                              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                              title="Insert image"
                            >
                              <Image size={16} />
                            </button>
                          </div>

                          <div
                            ref={contentEditableRef}
                            contentEditable
                            className="p-3 min-h-[200px] focus:outline-none"
                            dangerouslySetInnerHTML={{
                              __html: selectedNote.content,
                            }}
                            onBlur={(e) =>
                              setSelectedNote({
                                ...selectedNote,
                                content: e.currentTarget.innerHTML,
                              })
                            }
                          />
                        </div>

                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-medium">Tags</h3>
                            <button
                              onClick={() => setShowTagsMenu(!showTagsMenu)}
                              className="text-blue-600 dark:text-blue-400 text-sm"
                            >
                              {showTagsMenu ? "Done" : "Edit Tags"}
                            </button>
                          </div>

                          {showTagsMenu ? (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {tags.map((tag) => (
                                <button
                                  key={tag.id}
                                  className={`flex items-center px-3 py-1 rounded-full text-xs ${
                                    selectedNote.tags.includes(tag.name)
                                      ? tag.color + " text-white"
                                      : "bg-gray-200 dark:bg-gray-700"
                                  }`}
                                  onClick={() =>
                                    handleAddTagToNote(
                                      selectedNote.id,
                                      tag.name
                                    )
                                  }
                                >
                                  <span className="mr-1">#</span>
                                  {tag.name}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {selectedNote.tags.map((tagName) => {
                                const tagObj = tags.find(
                                  (t) => t.name === tagName
                                );
                                return (
                                  <span
                                    key={tagName}
                                    className={`px-3 py-1 rounded-full text-xs text-white ${
                                      tagObj?.color || "bg-gray-500"
                                    }`}
                                  >
                                    #{tagName}
                                  </span>
                                );
                              })}
                              {selectedNote.tags.length === 0 && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  No tags
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <h2 className="text-xl font-semibold mb-3">
                          {selectedNote.title}
                        </h2>
                        <div
                          className="whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{
                            __html: selectedNote.content,
                          }}
                        />
                        <div className="mt-4 flex flex-wrap gap-2">
                          {selectedNote.tags.map((tagName) => {
                            const tagObj = tags.find((t) => t.name === tagName);
                            return (
                              <span
                                key={tagName}
                                className={`px-3 py-1 rounded-full text-xs text-white ${
                                  tagObj?.color || "bg-gray-500"
                                }`}
                              >
                                #{tagName}
                              </span>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </motion.div>
                ) : (
                  <>
                    {filteredNotes.length > 0 ? (
                      filteredNotes.map((note) => (
                        <motion.div
                          key={note.id}
                          layoutId={note.id}
                          className={`${note.color} rounded-lg p-4 shadow-md hover:shadow-lg cursor-pointer relative`}
                          onClick={() => handleNoteClick(note)}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{
                            y: -5,
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          {note.isPinned && (
                            <div className="absolute top-2 right-2">
                              <Star
                                size={16}
                                className="text-yellow-600 dark:text-yellow-400"
                              />
                            </div>
                          )}

                          <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold pr-6">
                              {note.title}
                            </h2>
                            <motion.button
                              className="text-gray-600 dark:text-gray-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTogglePin(note.id);
                              }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {note.isPinned ? (
                                <Star
                                  size={18}
                                  className="text-yellow-600 dark:text-yellow-400"
                                />
                              ) : (
                                <StarOff size={18} />
                              )}
                            </motion.button>
                          </div>

                          <div
                            className="text-sm overflow-hidden line-clamp-3 mb-3"
                            dangerouslySetInnerHTML={{
                              __html:
                                note.content.length > 150
                                  ? note.content.substring(0, 150) + "..."
                                  : note.content,
                            }}
                          />

                          <div className="flex flex-wrap gap-1 mb-2">
                            {note.tags.slice(0, 3).map((tagName) => {
                              const tagObj = tags.find(
                                (t) => t.name === tagName
                              );
                              return (
                                <span
                                  key={tagName}
                                  className={`px-2 py-0.5 rounded-full text-xs text-white ${
                                    tagObj?.color || "bg-gray-500"
                                  }`}
                                >
                                  #{tagName}
                                </span>
                              );
                            })}
                            {note.tags.length > 3 && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-gray-200 dark:bg-gray-700">
                                +{note.tags.length - 3}
                              </span>
                            )}
                          </div>

                          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 flex items-center">
                            <Clock size={14} className="mr-1" />
                            {new Date(note.lastEdited).toLocaleDateString()}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        className="col-span-full text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          {searchQuery || selectedTags.length > 0
                            ? "No notes match your filters"
                            : showArchived
                            ? "No archived notes yet"
                            : "No notes yet"}
                        </p>
                        {!searchQuery &&
                          selectedTags.length === 0 &&
                          !showArchived && (
                            <motion.button
                              onClick={handleToggleCreate}
                              className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-800"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Create your first note
                            </motion.button>
                          )}
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* New note creation form with animation */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`${newNote.color} rounded-lg p-4 w-full max-w-2xl shadow-xl`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="flex justify-between items-center mb-3">
                <input
                  type="text"
                  placeholder="Title"
                  className="text-xl font-semibold bg-transparent border-none outline-none flex-1"
                  value={newNote.title}
                  onChange={(e) => handleNewNoteChange("title", e.target.value)}
                />
                <div className="flex gap-2">
                  <motion.button
                    onClick={handleSaveNote}
                    className="text-green-600 dark:text-green-500"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={newNote.title.trim() === ""}
                  >
                    <CheckCircle size={20} />
                  </motion.button>
                  <motion.button
                    onClick={handleToggleCreate}
                    className="text-gray-600 dark:text-gray-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              <div className="mb-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                <div className="flex flex-wrap gap-1 p-1 border-b border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
                  <button
                    onClick={() => handleFormatText("bold")}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Bold"
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    onClick={() => handleFormatText("italic")}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Italic"
                  >
                    <Italic size={16} />
                  </button>
                  <button
                    onClick={() => handleFormatText("underline")}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Underline"
                  >
                    <Underline size={16} />
                  </button>
                  <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                  <button
                    onClick={() => handleFormatText("insertUnorderedList")}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Bullet list"
                  >
                    <List size={16} />
                  </button>
                  <button
                    onClick={() => handleFormatText("insertOrderedList")}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Numbered list"
                  >
                    <ListOrdered size={16} />
                  </button>
                  <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                  <button
                    onClick={() => {
                      const url = prompt("Enter link URL:");
                      if (url) handleFormatText("createLink", url);
                    }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Insert link"
                  >
                    <Link size={16} />
                  </button>
                  <button
                    onClick={() => {
                      const url = prompt("Enter image URL:");
                      if (url) handleFormatText("insertImage", url);
                    }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Insert image"
                  >
                    <Image size={16} />
                  </button>
                </div>

                <div
                  ref={contentEditableRef}
                  contentEditable
                  className="p-3 min-h-[200px] focus:outline-none"
                  onBlur={(e) =>
                    handleNewNoteChange("content", e.currentTarget.innerHTML)
                  }
                />
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <motion.button
                      key={color.id}
                      className={`w-6 h-6 rounded-full ${color.class} ${
                        newNote.color === color.class
                          ? "ring-2 ring-blue-600 dark:ring-blue-400"
                          : ""
                      }`}
                      onClick={() => handleColorSelect(color.class)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleNewNoteChange("isPinned", !newNote.isPinned)
                    }
                    className={`p-1 rounded ${
                      newNote.isPinned
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                    title={newNote.isPinned ? "Unpin note" : "Pin note"}
                  >
                    {newNote.isPinned ? (
                      <Star size={18} />
                    ) : (
                      <StarOff size={18} />
                    )}
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowTagsMenu(!showTagsMenu)}
                      className="p-1 rounded text-gray-600 dark:text-gray-300"
                      title="Add tags"
                    >
                      <Tag size={18} />
                    </button>

                    {showTagsMenu && (
                      <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-10">
                        <div className="max-h-40 overflow-y-auto">
                          {tags.map((tag) => (
                            <div
                              key={tag.id}
                              className="flex items-center p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                              <button
                                className={`flex items-center px-2 py-1 rounded-full text-xs ${
                                  newNote.tags.includes(tag.name)
                                    ? tag.color + " text-white"
                                    : "bg-gray-200 dark:bg-gray-700"
                                } flex-1`}
                                onClick={() => {
                                  const updatedTags = newNote.tags.includes(
                                    tag.name
                                  )
                                    ? newNote.tags.filter((t) => t !== tag.name)
                                    : [...newNote.tags, tag.name];
                                  handleNewNoteChange("tags", updatedTags);
                                }}
                              >
                                <span className="mr-1">#</span>
                                {tag.name}
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <button
                            onClick={() => {
                              setIsAddingTag(true);
                              setShowTagsMenu(false);
                            }}
                            className="text-blue-600 dark:text-blue-400 text-sm flex items-center"
                          >
                            <Plus size={14} className="mr-1" />
                            Create new tag
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {newNote.date}
                  </div>
                </div>
              </div>

              {newNote.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {newNote.tags.map((tagName) => {
                    const tagObj = tags.find((t) => t.name === tagName);
                    return (
                      <span
                        key={tagName}
                        className={`px-2 py-0.5 rounded-full text-xs text-white ${
                          tagObj?.color || "bg-gray-500"
                        }`}
                      >
                        #{tagName}
                      </span>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add new tag modal */}
      <AnimatePresence>
        {isAddingTag && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-md shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <h2 className="text-lg font-semibold mb-4">Create New Tag</h2>

              <div className="mb-4">
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Tag Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter tag name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Tag Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "bg-blue-500 dark:bg-blue-600",
                    "bg-green-500 dark:bg-green-600",
                    "bg-red-500 dark:bg-red-600",
                    "bg-yellow-500 dark:bg-yellow-600",
                    "bg-purple-500 dark:bg-purple-600",
                    "bg-pink-500 dark:bg-pink-600",
                    "bg-indigo-500 dark:bg-indigo-600",
                    "bg-gray-500 dark:bg-gray-600",
                  ].map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full ${color} ${
                        newTagColor === color
                          ? "ring-2 ring-blue-600 dark:ring-blue-400"
                          : ""
                      }`}
                      onClick={() => setNewTagColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAddingTag(false)}
                  className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTag}
                  className="px-4 py-2 rounded bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800"
                  disabled={newTagName.trim() === ""}
                >
                  Create Tag
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
