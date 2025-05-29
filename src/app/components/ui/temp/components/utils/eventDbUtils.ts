// calendar/utils/eventDbUtils.ts

import supabase from "@/lib/supabaseClient";
import { Event } from "@/app/schemas/eventSchema";

// Fetch all events for a user
export const fetchUserEvents = async (userId: number): Promise<Event[]> => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching events:", error);
    throw error;
  }

  // Convert the database format to our Event type
  return data.map((event: any) => ({
    id: event.id,
    user_id: event.user_id,
    title: event.title,
    description: event.description,
    startTime: new Date(event.start_time),
    endTime: new Date(event.end_time),
    allDay: event.all_day,
    location: event.location,
    notes: event.notes,
    color: event.color,
    created_at: new Date(event.created_at),
    updated_at: new Date(event.updated_at),
  }));
};

// Create a new event
export const createEvent = async (
  userId: number,
  event: Omit<Event, "id" | "user_id" | "created_at" | "updated_at">
): Promise<Event> => {
  // Convert our Event type to the database format
  const dbEvent = {
    user_id: userId,
    title: event.title,
    description: event.description,
    start_time: event.startTime.toISOString(),
    end_time: event.endTime.toISOString(),
    all_day: event.allDay,
    location: event.location,
    notes: event.notes,
    color: event.color,
  };

  const { data, error } = await supabase
    .from("events")
    .insert(dbEvent)
    .select()
    .single();

  if (error) {
    console.error("Error creating event:", error);
    throw error;
  }

  // Convert back to our Event type
  return {
    id: data.id,
    user_id: data.user_id,
    title: data.title,
    description: data.description,
    startTime: new Date(data.start_time),
    endTime: new Date(data.end_time),
    allDay: data.all_day,
    location: data.location,
    notes: data.notes,
    color: data.color,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
  };
};

// Update an existing event
export const updateEvent = async (event: Event): Promise<Event> => {
  // Convert our Event type to the database format
  const dbEvent = {
    title: event.title,
    description: event.description,
    start_time: event.startTime.toISOString(),
    end_time: event.endTime.toISOString(),
    all_day: event.allDay,
    location: event.location,
    notes: event.notes,
    color: event.color,
  };

  const { data, error } = await supabase
    .from("events")
    .update(dbEvent)
    .eq("id", event.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating event:", error);
    throw error;
  }

  // Convert back to our Event type
  return {
    id: data.id,
    user_id: data.user_id,
    title: data.title,
    description: data.description,
    startTime: new Date(data.start_time),
    endTime: new Date(data.end_time),
    allDay: data.all_day,
    location: data.location,
    notes: data.notes,
    color: data.color,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
  };
};

// Delete an event
export const deleteEvent = async (eventId: number): Promise<void> => {
  const { error } = await supabase.from("events").delete().eq("id", eventId);

  if (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};
