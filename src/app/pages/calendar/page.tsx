// pages/calendar/page.tsx
"use client";

import { useState } from "react";
import Calendar from "@/app/components/ui/Calendar/calendar";
import { Event } from "@/app/schemas/eventSchema";

const CalendarPage = () => {
  // Mock events data using the Event type
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      user_id: 1,
      title: "Team Weekly Sync",
      description: "Regular team sync to discuss progress and blockers",
      startTime: new Date(2025, 4, 14, 10, 0), // May 14, 2025, 10:00 AM
      endTime: new Date(2025, 4, 14, 11, 0), // May 14, 2025, 11:00 AM
      allDay: false,
      location: "Conference Room A",
      notes: "Bring project updates",
      color: "blue",
      created_at: new Date(2025, 3, 1),
      updated_at: new Date(2025, 3, 1),
    },
    {
      id: 2,
      user_id: 1,
      title: "The Amazing Hubble",
      description: "Presentation about the Hubble Space Telescope",
      startTime: new Date(2025, 4, 14, 13, 0), // May 14, 2025, 1:00 PM
      endTime: new Date(2025, 4, 14, 14, 30), // May 14, 2025, 2:30 PM
      allDay: false,
      location: "Auditorium",
      notes: "Prepare questions for Q&A",
      color: "purple",
      created_at: new Date(2025, 3, 5),
      updated_at: new Date(2025, 3, 5),
    },
    {
      id: 3,
      user_id: 2,
      title: "Choosing A Quality Cookware Set",
      description: "Workshop on selecting the right cookware",
      startTime: new Date(2025, 4, 15, 11, 0), // May 15, 2025, 11:00 AM
      endTime: new Date(2025, 4, 15, 12, 30), // May 15, 2025, 12:30 PM
      allDay: false,
      location: "Kitchen Lab",
      notes: "",
      color: "green",
      created_at: new Date(2025, 3, 10),
      updated_at: new Date(2025, 3, 10),
    },
    {
      id: 4,
      user_id: 1,
      title: "Astronomy Binoculars: A Great Alternative",
      description: "Discussion about using binoculars for astronomy",
      startTime: new Date(2025, 4, 15, 15, 0), // May 15, 2025, 3:00 PM
      endTime: new Date(2025, 4, 15, 17, 0), // May 15, 2025, 5:00 PM
      allDay: false,
      location: "Observatory",
      notes: "Bring your binoculars if you have them",
      color: "pink",
      created_at: new Date(2025, 3, 12),
      updated_at: new Date(2025, 3, 12),
    },
    {
      id: 5,
      user_id: 3,
      title: "All-Day Planning Session",
      description: "Annual planning session for the team",
      startTime: new Date(2025, 4, 16, 0, 0), // May 16, 2025, 12:00 AM
      endTime: new Date(2025, 4, 16, 23, 59), // May 16, 2025, 11:59 PM
      allDay: true,
      location: "Main Conference Room",
      notes: "Prepare your department's annual goals",
      color: "yellow",
      created_at: new Date(2025, 3, 15),
      updated_at: new Date(2025, 3, 15),
    },
    {
      id: 6,
      user_id: 2,
      title: "Shooting Stars",
      description: "Meteor shower viewing event",
      startTime: new Date(2025, 4, 17, 22, 0), // May 17, 2025, 10:00 PM
      endTime: new Date(2025, 4, 18, 1, 0), // May 18, 2025, 1:00 AM
      allDay: false,
      location: "Hilltop Park",
      notes: "Bring warm clothes and blankets",
      color: "indigo",
      created_at: new Date(2025, 3, 20),
      updated_at: new Date(2025, 3, 20),
    },
    {
      id: 7,
      user_id: 1,
      title: "The Universe Through A Child's Eyes",
      description: "Workshop for teaching astronomy to children",
      startTime: new Date(2025, 4, 18, 9, 0), // May 18, 2025, 9:00 AM
      endTime: new Date(2025, 4, 18, 11, 0), // May 18, 2025, 11:00 AM
      allDay: false,
      location: "Children's Museum",
      notes: "",
      color: "orange",
      created_at: new Date(2025, 3, 25),
      updated_at: new Date(2025, 3, 25),
    },
    {
      id: 8,
      user_id: 3,
      title: "Product Launch",
      description: "Official launch of our new product line",
      startTime: new Date(2025, 4, 20, 14, 0), // May 20, 2025, 2:00 PM
      endTime: new Date(2025, 4, 20, 16, 0), // May 20, 2025, 4:00 PM
      allDay: false,
      location: "Main Auditorium",
      notes: "Press will be present",
      color: "red",
      created_at: new Date(2025, 4, 1),
      updated_at: new Date(2025, 4, 1),
    },
    {
      id: 9,
      user_id: 2,
      title: "Quarterly Review",
      description: "Review of Q2 performance",
      startTime: new Date(2025, 4, 21, 9, 0), // May 21, 2025, 9:00 AM
      endTime: new Date(2025, 4, 21, 12, 0), // May 21, 2025, 12:00 PM
      allDay: false,
      location: "Board Room",
      notes: "Prepare department reports",
      color: "blue",
      created_at: new Date(2025, 4, 5),
      updated_at: new Date(2025, 4, 5),
    },
  ]);

  // Handle adding a new event
  const handleAddEvent = () => {
    // This would typically open a form or modal to add a new event
    console.log("Add event");
  };

  // Handle updating an event
  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  // Handle deleting an event
  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={handleAddEvent}
        >
          Add Event
        </button>
      </div>

      <Calendar
        events={events}
        onAddEvent={handleAddEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </div>
  );
};

export default CalendarPage;
