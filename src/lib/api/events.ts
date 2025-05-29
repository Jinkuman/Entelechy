import supabase from "@/lib/supabaseClient";
import { Event, eventSchema } from "@/app/schemas/eventSchema";

export async function fetchUserEvents(userId: string): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("user_id", userId)
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Supabase error fetching events:", error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log("No events found for user:", userId);
      return [];
    }

    console.log("Raw events data:", data);

    const validEvents: Event[] = [];

    for (let i = 0; i < data.length; i++) {
      const event = data[i];
      try {
        console.log(`Processing event ${i}:`, event);

        // Check if required fields exist
        if (!event.id || !event.user_id || !event.title) {
          console.warn("Skipping event with missing required fields:", event);
          continue;
        }

        const transformedEvent = {
          id: event.id,
          user_id: event.user_id,
          title: event.title,
          description: event.description || "",
          startTime: new Date(event.start_time),
          endTime: new Date(event.end_time),
          allDay: Boolean(event.all_day),
          location: event.location,
          notes: event.notes,
          color: event.color || "blue",
          created_at: new Date(event.created_at),
          updated_at: new Date(event.updated_at),
        };

        console.log("Transformed event:", transformedEvent);

        const validatedEvent = eventSchema.parse(transformedEvent);
        validEvents.push(validatedEvent);
      } catch (parseError) {
        console.warn(`Skipping invalid event ${i}:`, {
          error: parseError,
          eventData: event,
        });
        // Continue processing other events instead of crashing
        continue;
      }
    }

    console.log(
      `Successfully processed ${validEvents.length} out of ${data.length} events`
    );
    return validEvents;
  } catch (err) {
    console.error("Unexpected error in fetchUserEvents:", err);
    return [];
  }
}

export function getUpcomingEvents(
  events: Event[],
  currentDate: Date = new Date()
): Event[] {
  return events.filter((event) => event.startTime > currentDate).slice(0, 4);
}
