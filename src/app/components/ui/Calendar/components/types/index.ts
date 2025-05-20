export interface ColorOption {
  name: string;
  bg: string;
  dot: string;
  text: string;
}

export type ViewMode = "day" | "week" | "month" | "year";
export type NavigationDirection = "next" | "prev";

export interface CalendarProps {
  events: Event[];
  onAddEvent?: () => void;
  onUpdateEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: number) => void;
}
