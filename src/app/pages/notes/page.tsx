"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  MoreHorizontal,
  Plus,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Define note interface
interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  date: string;
  time?: string;
}

// Sample initial notes data
const initialNotes: Note[] = [
  {
    id: "1",
    title: "Mid test exam",
    content:
      "Ultrices viverra odio congue felis, libero egestas nunc lacus erat massa, elit ornare eget sem velit in vitam. In augue cursus ut adipiscing felis, diam volutpat mauris, id and",
    color: "bg-yellow-200",
    date: "12/13/2021",
    time: "10:30 PM Monday",
  },
  {
    id: "2",
    title: "Mid test exam",
    content:
      "Ultrices viverra odio congue felis, libero egestas nunc lacus erat massa, elit ornare eget sem velit in vitam. In augue cursus ut adipiscing felis, diam volutpat mauris, id and",
    color: "bg-red-200",
    date: "12/13/2021",
    time: "10:30 PM Monday",
  },
  {
    id: "3",
    title: "Jinku's notes",
    content:
      "Porta viverra odio congue felis, libero egestas nunc lacus erat massa, elit ornare eget sem velit in vitam.",
    color: "bg-blue-200",
    date: "12/14/2021",
    time: "04:15 PM Sunday",
  },
];

// Color options for new notes
const colorOptions = [
  { id: "yellow", class: "bg-yellow-200" },
  { id: "red", class: "bg-red-200" },
  { id: "blue", class: "bg-blue-200" },
  { id: "green", class: "bg-green-200" },
  { id: "purple", class: "bg-purple-200" },
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState<Note>({
    id: "",
    title: "",
    content: "",
    color: "bg-yellow-200",
    date: new Date().toLocaleDateString(),
  });
  const [timeFilter, setTimeFilter] = useState("Today");

  // Handle note selection
  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
  };

  // Handle going back to all notes
  const handleBackToNotes = () => {
    setSelectedNote(null);
  };

  // Toggle new note creation
  const handleToggleCreate = () => {
    setIsCreating(!isCreating);
    if (!isCreating) {
      setNewNote({
        id: Date.now().toString(),
        title: "",
        content: "",
        color: "bg-yellow-200",
        date: new Date().toLocaleDateString(),
      });
    }
  };

  // Update new note fields
  const handleNewNoteChange = (field: keyof Note, value: string) => {
    setNewNote((prev) => ({ ...prev, [field]: value }));
  };

  // Select color for new note
  const handleColorSelect = (colorClass: string) => {
    setNewNote((prev) => ({ ...prev, color: colorClass }));
  };

  // Save new note
  const handleSaveNote = () => {
    if (newNote.title.trim() === "") return;

    const now = new Date();
    const timeStr = `${now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} ${now.toLocaleDateString("en-US", { weekday: "long" })}`;

    const noteToSave = {
      ...newNote,
      time: timeStr,
    };

    setNotes((prev) => [noteToSave, ...prev]);
    setIsCreating(false);
    setNewNote({
      id: "",
      title: "",
      content: "",
      color: "bg-yellow-200",
      date: new Date().toLocaleDateString(),
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <div className="flex gap-2">
          <motion.button
            onClick={handleToggleCreate}
            className="cursor-pointer rounded-full p-3 bg-blue-600 text-white shadow-lg"
            whileHover={{
              scale: 1.1, // a little “pop” on hover
              rotate: 90, // if you still want it to reflect isCreating
            }}
            whileTap={{ scale: 0.95 }} // your existing tap logic
            transition={{ duration: 0.3 }}
          >
            <Plus size={24} />
          </motion.button>
        </div>
      </div>

      {/* Time filter tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8">
          {["Today", "This Week", "This Month"].map((filter) => (
            <button
              key={filter}
              className={`pb-2 px-1 ${
                timeFilter === filter
                  ? "border-b-2 border-blue-600 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setTimeFilter(filter)}
            >
              {filter}
            </button>
          ))}
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
              className={`${newNote.color} rounded-lg p-4 w-full max-w-md shadow-xl`}
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
                    className="text-green-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckCircle size={20} />
                  </motion.button>
                  <motion.button
                    onClick={handleToggleCreate}
                    className="text-gray-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MoreHorizontal size={20} />
                  </motion.button>
                </div>
              </div>
              <textarea
                placeholder="Start typing..."
                className="w-full bg-transparent border-none outline-none resize-none h-32"
                value={newNote.content}
                onChange={(e) => handleNewNoteChange("content", e.target.value)}
              />
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <motion.button
                      key={color.id}
                      className={`w-6 h-6 rounded-full ${color.class} ${
                        newNote.color === color.class
                          ? "ring-2 ring-blue-600"
                          : ""
                      }`}
                      onClick={() => handleColorSelect(color.class)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-600 flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {newNote.date}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes grid with animation */}
      <motion.div
        layout
        className={`grid ${
          selectedNote
            ? "grid-cols-1"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
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
                  className="text-gray-600 hover:text-gray-900"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft size={20} />
                </motion.button>
                <div className="text-xs text-gray-600">{selectedNote.date}</div>
                <motion.button
                  className="text-gray-600 hover:text-gray-900"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MoreHorizontal size={20} />
                </motion.button>
              </div>
              <h2 className="text-xl font-semibold mb-3">
                {selectedNote.title}
              </h2>
              <div className="whitespace-pre-wrap">{selectedNote.content}</div>
              {selectedNote.time && (
                <div className="mt-4 text-xs text-gray-600 flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {selectedNote.time}
                </div>
              )}
            </motion.div>
          ) : (
            notes.map((note) => (
              <motion.div
                key={note.id}
                layoutId={note.id}
                className={`${note.color} rounded-lg p-4 shadow-md hover:shadow-lg cursor-pointer`}
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
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">{note.title}</h2>
                  <motion.button
                    className="text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MoreHorizontal size={18} />
                  </motion.button>
                </div>
                <p className="text-sm overflow-hidden line-clamp-3">
                  {note.content}
                </p>
                <div className="mt-4 text-xs text-gray-600 flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {note.time || note.date}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Empty state if no notes */}
      {notes.length === 0 && !isCreating && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-gray-500 mb-4">No notes yet</p>
          <motion.button
            onClick={handleToggleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create your first note
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
