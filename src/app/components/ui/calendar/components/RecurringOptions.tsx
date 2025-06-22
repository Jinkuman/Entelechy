import { useState, useEffect } from "react";
import { RecurringPattern, CustomRecurring } from "@/app/schemas/eventSchema";

interface RecurringOptionsProps {
  isRecurring: boolean;
  recurringPattern: RecurringPattern;
  customRecurring?: CustomRecurring;
  onRecurringChange: (isRecurring: boolean) => void;
  onPatternChange: (pattern: RecurringPattern) => void;
  onCustomRecurringChange: (customRecurring?: CustomRecurring) => void;
  uniqueId?: string;
}

const RecurringOptions = ({
  isRecurring,
  recurringPattern,
  customRecurring,
  onRecurringChange,
  onPatternChange,
  onCustomRecurringChange,
  uniqueId = "default",
}: RecurringOptionsProps) => {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  // Initialize selected days from custom recurring data
  useEffect(() => {
    if (customRecurring?.selectedDays) {
      setSelectedDays(customRecurring.selectedDays);
    }
  }, [customRecurring?.selectedDays]);

  const handlePatternChange = (pattern: RecurringPattern) => {
    onPatternChange(pattern);

    if (pattern === "custom") {
      // Initialize custom recurring with default values
      onCustomRecurringChange({
        interval: 1,
        unit: "weeks",
        selectedDays:
          selectedDays.length > 0 ? selectedDays : [new Date().getDay()],
      });
    } else {
      onCustomRecurringChange(undefined);
    }
  };

  const handleCustomRecurringChange = (
    field: keyof CustomRecurring,
    value: any
  ) => {
    if (!customRecurring) return;

    onCustomRecurringChange({
      ...customRecurring,
      [field]: value,
    });
  };

  const toggleDay = (dayIndex: number) => {
    const newSelectedDays = selectedDays.includes(dayIndex)
      ? selectedDays.filter((day) => day !== dayIndex)
      : [...selectedDays, dayIndex].sort();

    setSelectedDays(newSelectedDays);

    if (customRecurring) {
      handleCustomRecurringChange("selectedDays", newSelectedDays);
    }
  };

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-4">
      {/* Recurring Toggle */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`isRecurring-${uniqueId}`}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
          checked={isRecurring}
          onChange={(e) => onRecurringChange(e.target.checked)}
        />
        <label
          htmlFor={`isRecurring-${uniqueId}`}
          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
        >
          Repeat event
        </label>
      </div>

      {/* Recurring Pattern Options */}
      {isRecurring && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Repeat
          </label>

          <div className="space-y-2">
            {[
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
              { value: "monthly", label: "Monthly" },
              { value: "yearly", label: "Yearly" },
              { value: "custom", label: "Custom" },
            ].map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`recurring-pattern-${option.value}-${uniqueId}`}
                  name={`recurringPattern-${uniqueId}`}
                  value={option.value}
                  checked={recurringPattern === option.value}
                  onChange={(e) => {
                    handlePatternChange(e.target.value as RecurringPattern);
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                <label
                  htmlFor={`recurring-pattern-${option.value}-${uniqueId}`}
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>

          {/* Custom Recurring Options */}
          {recurringPattern === "custom" && (
            <div className="space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
              {/* Day Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Repeat on
                </label>
                <div className="grid grid-cols-7 gap-1">
                  {dayNames.map((dayName, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => toggleDay(index)}
                      className={`p-2 text-xs rounded-lg border transition-colors ${
                        selectedDays.includes(index)
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {shortDayNames[index]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interval */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400">
                    Every
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="52"
                    className="w-full px-2 py-1 text-sm border dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    value={customRecurring?.interval || 1}
                    onChange={(e) =>
                      handleCustomRecurringChange(
                        "interval",
                        parseInt(e.target.value) || 1
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400">
                    Week(s)
                  </label>
                  <div className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded border dark:border-gray-600">
                    Week(s)
                  </div>
                </div>
              </div>

              {/* End Options */}
              <div className="space-y-2">
                <label className="block text-xs text-gray-600 dark:text-gray-400">
                  End
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={`end-never-${uniqueId}`}
                      name={`endType-${uniqueId}`}
                      checked={
                        !customRecurring?.endDate &&
                        !customRecurring?.endAfterOccurrences
                      }
                      onChange={() => {
                        handleCustomRecurringChange("endDate", undefined);
                        handleCustomRecurringChange(
                          "endAfterOccurrences",
                          undefined
                        );
                      }}
                      className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label
                      htmlFor={`end-never-${uniqueId}`}
                      className="ml-2 block text-xs text-gray-700 dark:text-gray-300"
                    >
                      Never
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={`end-date-${uniqueId}`}
                      name={`endType-${uniqueId}`}
                      checked={!!customRecurring?.endDate}
                      onChange={() => {
                        handleCustomRecurringChange(
                          "endAfterOccurrences",
                          undefined
                        );
                        if (!customRecurring?.endDate) {
                          const defaultEndDate = new Date();
                          defaultEndDate.setMonth(
                            defaultEndDate.getMonth() + 1
                          );
                          handleCustomRecurringChange(
                            "endDate",
                            defaultEndDate
                          );
                        }
                      }}
                      className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label
                      htmlFor={`end-date-${uniqueId}`}
                      className="ml-2 block text-xs text-gray-700 dark:text-gray-300"
                    >
                      On
                    </label>
                    {customRecurring?.endDate && (
                      <input
                        type="date"
                        className="ml-2 px-2 py-1 text-xs border dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        value={
                          customRecurring.endDate.toISOString().split("T")[0]
                        }
                        onChange={(e) =>
                          handleCustomRecurringChange(
                            "endDate",
                            new Date(e.target.value)
                          )
                        }
                      />
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={`end-occurrences-${uniqueId}`}
                      name={`endType-${uniqueId}`}
                      checked={!!customRecurring?.endAfterOccurrences}
                      onChange={() => {
                        handleCustomRecurringChange("endDate", undefined);
                        if (!customRecurring?.endAfterOccurrences) {
                          handleCustomRecurringChange(
                            "endAfterOccurrences",
                            10
                          );
                        }
                      }}
                      className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label
                      htmlFor={`end-occurrences-${uniqueId}`}
                      className="ml-2 block text-xs text-gray-700 dark:text-gray-300"
                    >
                      After
                    </label>
                    {customRecurring?.endAfterOccurrences && (
                      <>
                        <input
                          type="number"
                          min="1"
                          max="999"
                          className="ml-2 w-16 px-2 py-1 text-xs border dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          value={customRecurring.endAfterOccurrences}
                          onChange={(e) =>
                            handleCustomRecurringChange(
                              "endAfterOccurrences",
                              parseInt(e.target.value) || 1
                            )
                          }
                        />
                        <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                          occurrences
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecurringOptions;
