// src/components/KanbanView.tsx
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { taskSchema } from "@/app/schemas/taskSchema";
import {
  getImportanceColor,
  formatImportanceDisplay,
} from "../utils/taskUtils";
import type { z } from "zod";

type Task = z.infer<typeof taskSchema>;

interface KanbanViewProps {
  tasksByStatus: Record<string, Task[]>;
  handleDragEnd: (result: any) => void;
  onTaskClick: (task: Task) => void;
}

const KanbanView = ({
  tasksByStatus,
  handleDragEnd,
  onTaskClick,
}: KanbanViewProps) => {
  // Function to format date display
  const formatDate = (date: Date | null) => {
    if (!date) return "No date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-4">
        {(["uncompleted", "in_progress", "completed"] as const).map(
          (statusKey, idx) => (
            <motion.div
              key={statusKey}
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium dark:text-white">
                  {statusKey === "uncompleted"
                    ? "Uncompleted"
                    : statusKey === "in_progress"
                    ? "In Progress"
                    : "Completed"}
                </h3>
                <motion.span
                  className="bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5 text-sm dark:text-gray-300"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {tasksByStatus[statusKey].length}
                </motion.span>
              </div>
              <Droppable droppableId={statusKey}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-50 dark:bg-zinc-900/50 min-h-[24rem] rounded p-2"
                  >
                    <AnimatePresence>
                      {tasksByStatus[statusKey].map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                transform: snapshot.isDragging
                                  ? provided.draggableProps.style?.transform
                                  : "none", // Prevent transform conflicts
                              }}
                              className={`bg-white dark:bg-zinc-800 p-4 rounded mb-2 border dark:border-zinc-700 hover:shadow-md transition-shadow duration-200 ${
                                !snapshot.isDragging ? "cursor-pointer" : ""
                              }`}
                              onClick={() => {
                                // Only trigger click when not dragging
                                if (!snapshot.isDragging) {
                                  onTaskClick(task);
                                }
                              }}
                            >
                              {/* Use motion effects with CSS instead of motion.div */}
                              <div
                                className={`transition-transform duration-200 ${
                                  !snapshot.isDragging
                                    ? "hover:scale-[1.02] active:scale-[0.98]"
                                    : ""
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium dark:text-white">
                                    {task.title}
                                  </h4>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span
                                    className={`text-xs px-2 py-1 rounded ${getImportanceColor(
                                      task.importance
                                    )}`}
                                  >
                                    {formatImportanceDisplay(task.importance)}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(task.dueDate)}
                                  </span>
                                </div>
                                {task.description && (
                                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {task.description}
                                  </div>
                                )}
                                {task.category && (
                                  <div className="mt-2">
                                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                                      {task.category}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </motion.div>
          )
        )}
      </div>
    </DragDropContext>
  );
};

export default KanbanView;
