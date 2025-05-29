import supabase from "@/lib/supabaseClient";
import { taskSchema } from "@/app/schemas/taskSchema";
import { z } from "zod";

export type Task = z.infer<typeof taskSchema>;

export async function fetchUserTasks(userId: string): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data
      .map((task) => {
        try {
          // Transform snake_case to camelCase to match your Zod schema
          const transformedTask = {
            id: task.id,
            user_id: task.user_id,
            title: task.title,
            description: task.description,
            status: task.status,
            importance: task.importance,
            dueDate: task.due_date ? new Date(task.due_date) : null, // snake_case to camelCase
            category: task.category,
            created_at: new Date(task.created_at),
            updated_at: new Date(task.updated_at),
          };

          // Validate with Zod schema
          return taskSchema.parse(transformedTask);
        } catch (parseError) {
          console.error("Error parsing task:", parseError, task);
          return null;
        }
      })
      .filter(Boolean) as Task[];
  } catch (err) {
    console.error("Unexpected error in fetchUserTasks:", err);
    return [];
  }
}

export async function updateTaskStatus(
  taskId: string,
  newStatus: Task["status"]
): Promise<void> {
  try {
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  } catch (err) {
    console.error("Unexpected error in updateTaskStatus:", err);
    throw err;
  }
}

export function cycleTaskStatus(currentStatus: Task["status"]): Task["status"] {
  const statusCycle: Record<Task["status"], Task["status"]> = {
    uncompleted: "in_progress",
    in_progress: "completed",
    completed: "uncompleted",
  };
  return statusCycle[currentStatus] || "uncompleted";
}
