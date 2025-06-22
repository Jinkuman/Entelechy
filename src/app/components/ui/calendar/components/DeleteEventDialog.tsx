import { motion } from "framer-motion";
import { Event } from "@/app/schemas/eventSchema";
import { isRecurringInstance } from "./utils/recurringUtils";

interface DeleteEventDialogProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onDeleteOriginal: () => void;
  onDeleteInstance: () => void;
}

const DeleteEventDialog = ({
  event,
  isOpen,
  onClose,
  onDeleteOriginal,
  onDeleteInstance,
}: DeleteEventDialogProps) => {
  if (!isOpen) return null;

  const isRecurring = event.isRecurring && event.recurringPattern !== "none";
  const isInstance = isRecurringInstance(event);

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Delete Event
        </h3>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to delete "{event.title}"?
        </p>

        {isRecurring && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              This is a recurring event. Choose your deletion option:
            </p>

            <div className="space-y-3">
              <button
                onClick={onDeleteOriginal}
                className="w-full text-left p-3 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                <div className="font-medium">Delete entire series</div>
                <div className="text-xs">
                  Remove all future occurrences of this event
                </div>
              </button>

              {isInstance && (
                <button
                  onClick={onDeleteInstance}
                  className="w-full text-left p-3 bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
                >
                  <div className="font-medium">Delete this occurrence only</div>
                  <div className="text-xs">
                    Remove only this specific instance
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        {!isRecurring && (
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onDeleteOriginal}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        )}

        {isRecurring && (
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DeleteEventDialog;
