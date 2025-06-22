// pages/calendar/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Calendar from "@/app/components/ui/calendar/calendar";
import { Event } from "@/app/schemas/eventSchema";
import supabase from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { calendarToasts } from "@/app/components/ui/toast-utils";

const CalendarPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Create a ref to hold the function from the Calendar component
  const openCreateSidebarRef = useRef<() => void>(() => {});

  // Fetch the current user and their events
  useEffect(() => {
    const fetchUserAndEvents = async () => {
      try {
        // Get the current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("Please log in to view your calendar");
          setLoading(false);
          return;
        }

        setUserId(user.id);

        // Fetch events for this user
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .eq("user_id", user.id);

        if (eventsError) {
          throw eventsError;
        }

        // Transform the data to match our Event type
        const transformedEvents: Event[] = eventsData.map((event: any) => ({
          id: event.id,
          user_id: event.user_id,
          title: event.title,
          description: event.description || "",
          startTime: new Date(event.start_time),
          endTime: new Date(event.end_time),
          allDay: event.all_day,
          location: event.location || "",
          notes: event.notes || null,
          color: event.color || "blue",
          created_at: new Date(event.created_at),
          updated_at: new Date(event.updated_at),
        }));

        setEvents(transformedEvents);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load calendar data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndEvents();
  }, []);

  // This function calls the Calendar component's method to open the sidebar
  const openCreateEventSidebar = () => {
    if (openCreateSidebarRef.current) {
      openCreateSidebarRef.current();
    }
  };

  // Handle adding a new event - only called when the form is submitted
  const handleAddEvent = async (
    newEventData: Omit<Event, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    if (!userId) {
      console.error("Cannot create event: No user ID available");
      throw new Error("You must be logged in to create events");
    }

    try {
      console.log("Creating event with data:", newEventData);
      console.log("User ID:", userId); // Log the user ID to check its format

      // Validate that userId is a valid UUID
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(userId)) {
        console.error("Invalid user ID format:", userId);
        throw new Error("Invalid user ID format");
      }

      // Convert to database format
      const dbEvent = {
        user_id: userId,
        title: newEventData.title,
        description: newEventData.description || "",
        start_time: newEventData.startTime.toISOString(),
        end_time: newEventData.endTime.toISOString(),
        all_day: newEventData.allDay,
        location: newEventData.location || "",
        notes: newEventData.notes || "",
        color: newEventData.color || "blue",
      };

      console.log("Sending to database:", dbEvent);

      const { data, error } = await supabase
        .from("events")
        .insert(dbEvent)
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error("No data returned from database");
      }

      console.log("Event created successfully:", data);

      // Add the new event to state
      const createdEvent: Event = {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        description: data.description || "",
        startTime: new Date(data.start_time),
        endTime: new Date(data.end_time),
        allDay: data.all_day,
        location: data.location || "",
        notes: data.notes || "",
        color: data.color || "blue",
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };

      setEvents([...events, createdEvent]);

      // Show success toast
      calendarToasts.eventCreated(newEventData.title);

      return data.id; // Return the ID of the created event
    } catch (err) {
      console.error("Error creating event:", err);

      // Show error toast
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      calendarToasts.eventError("create", errorMessage);

      if (err instanceof Error) {
        throw new Error(`Error creating event: ${err.message}`);
      } else {
        throw new Error("Unknown error creating event");
      }
    }
  };

  // Rest of the functions remain unchanged
  const handleUpdateEvent = async (updatedEvent: Event) => {
    try {
      // Find the current event to compare changes
      const currentEvent = events.find((event) => event.id === updatedEvent.id);

      if (!currentEvent) {
        throw new Error("Event not found");
      }

      // Check if there are actual changes
      const hasChanges =
        currentEvent.title !== updatedEvent.title ||
        currentEvent.description !== updatedEvent.description ||
        currentEvent.startTime.getTime() !== updatedEvent.startTime.getTime() ||
        currentEvent.endTime.getTime() !== updatedEvent.endTime.getTime() ||
        currentEvent.allDay !== updatedEvent.allDay ||
        currentEvent.location !== updatedEvent.location ||
        currentEvent.notes !== updatedEvent.notes ||
        currentEvent.color !== updatedEvent.color;

      // If no changes, don't update or show toast
      if (!hasChanges) {
        return;
      }

      // Convert to database format
      const dbEvent = {
        title: updatedEvent.title,
        description: updatedEvent.description,
        start_time: updatedEvent.startTime.toISOString(),
        end_time: updatedEvent.endTime.toISOString(),
        all_day: updatedEvent.allDay,
        location: updatedEvent.location,
        notes: updatedEvent.notes,
        color: updatedEvent.color,
      };

      const { error } = await supabase
        .from("events")
        .update(dbEvent)
        .eq("id", updatedEvent.id);

      if (error) throw error;

      setEvents(
        events.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      );

      // Show success toast only if there were changes
      calendarToasts.eventUpdated(updatedEvent.title);
    } catch (err) {
      console.error("Error updating event:", err);

      // Show error toast
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      calendarToasts.eventError("update", errorMessage);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      // Get the event title before deleting for the toast
      const eventToDelete = events.find((event) => event.id === eventId);
      const eventTitle = eventToDelete?.title || "Event";

      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;

      setEvents(events.filter((event) => event.id !== eventId));

      // Show success toast
      calendarToasts.eventDeleted(eventTitle);
    } catch (err) {
      console.error("Error deleting event:", err);

      // Show error toast
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      calendarToasts.eventError("delete", errorMessage);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading calendar...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>

        <motion.button
          className="cursor-pointer rounded-full p-3 bg-blue-600 text-white shadow-lg"
          onClick={openCreateEventSidebar}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Plus size={24} />
        </motion.button>
      </div>

      <Calendar
        events={events}
        onAddEvent={handleAddEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
        openCreateSidebarRef={openCreateSidebarRef}
      />
    </div>
  );
};

export default CalendarPage;
