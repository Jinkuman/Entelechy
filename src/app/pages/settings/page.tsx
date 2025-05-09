"use client";
import { useState, useEffect } from "react";
import {
  Save,
  Bell,
  Moon,
  Sun,
  User,
  Lock,
  Globe,
  Sliders,
  Check,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";

// Section animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
    },
  }),
};

// Animation for save notification
const notificationVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [theme, setTheme] = useState("light");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [language, setLanguage] = useState("english");
  const [saveCount, setSaveCount] = useState(0);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    // Update the document class when theme changes
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Optional: Store theme preference in localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 2. Add this to initialize the theme from localStorage on component mount
  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(savedTheme);
  }, []);

  // Show save notification
  const handleSave = () => {
    setSaveCount((prev) => prev + 1);
    setShowSaveNotification(true);
    setTimeout(() => {
      setShowSaveNotification(false);
    }, 3000);
  };

  const tabs = [
    { id: "general", name: "General", icon: <Sliders className="w-5 h-5" /> },
    { id: "account", name: "Account", icon: <User className="w-5 h-5" /> },
    {
      id: "notifications",
      name: "Notifications",
      icon: <Bell className="w-5 h-5" />,
    },
    { id: "security", name: "Security", icon: <Lock className="w-5 h-5" /> },
    { id: "language", name: "Language", icon: <Globe className="w-5 h-5" /> },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
          <div>
            <span className="text-gray-700">Ajinkya Dhamdhere</span>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        {/* Tab navigation */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-2">
          <div className="flex overflow-x-auto space-x-1 md:space-x-4">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2 }}
              >
                {tab.icon}
                <span className="ml-2 text-sm font-medium">{tab.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Settings content */}
        <div className="p-6">
          {/* Settings content based on active tab */}
          {activeTab === "general" && (
            <div className="space-y-8">
              <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                initial="hidden"
                animate="visible"
                custom={0}
                variants={sectionVariants}
              >
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Theme Preferences
                </h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {theme === "light" ? (
                      <Sun className="w-5 h-5 text-yellow-500 mr-3" />
                    ) : (
                      <Moon className="w-5 h-5 text-indigo-500 mr-3" />
                    )}
                    <span className="text-gray-700">Dark Mode</span>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      theme === "dark" ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        theme === "dark" ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                initial="hidden"
                animate="visible"
                custom={1}
                variants={sectionVariants}
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Interface Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Show completed tasks</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Compact view</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                initial="hidden"
                animate="visible"
                custom={2}
                variants={sectionVariants}
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Default View
                </h2>
                <div className="space-y-3">
                  {["Dashboard", "Tasks", "Calendar", "Notes"].map((view) => (
                    <label
                      key={view}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="default-view"
                        checked={view === "Dashboard"}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        onChange={() => {}}
                      />
                      <span className="text-gray-700">{view}</span>
                    </label>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                initial="hidden"
                animate="visible"
                custom={3}
                variants={sectionVariants}
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Date & Time Format
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date format
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time format
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option>12-hour (1:30 PM)</option>
                      <option>24-hour (13:30)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-8">
              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                initial="hidden"
                animate="visible"
                custom={0}
                variants={sectionVariants}
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Notification Settings
                </h2>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 text-blue-500 mr-3" />
                    <span className="text-gray-700">Enable notifications</span>
                  </div>
                  <button
                    onClick={() =>
                      setNotificationsEnabled(!notificationsEnabled)
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      notificationsEnabled ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationsEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Task reminders</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Due date alerts</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Calendar events</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                initial="hidden"
                animate="visible"
                custom={1}
                variants={sectionVariants}
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Notification Timing
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default reminder time
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option>15 minutes before</option>
                      <option>30 minutes before</option>
                      <option>1 hour before</option>
                      <option>1 day before</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task due notifications
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option>At due time</option>
                      <option>1 hour before</option>
                      <option>1 day before</option>
                      <option>2 days before</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-8">
              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                initial="hidden"
                animate="visible"
                custom={0}
                variants={sectionVariants}
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Account Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Ajinkya Dhamdhere"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="user@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Zone
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option>Pacific Time (UTC-7)</option>
                      <option>Mountain Time (UTC-6)</option>
                      <option>Central Time (UTC-5)</option>
                      <option>Eastern Time (UTC-4)</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                initial="hidden"
                animate="visible"
                custom={1}
                variants={sectionVariants}
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Profile Picture
                </h2>
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                      A
                    </div>
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      Change Photo
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                initial="hidden"
                animate="visible"
                custom={2}
                variants={sectionVariants}
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Workspace Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Workspace Name
                    </label>
                    <input
                      type="text"
                      defaultValue="My Workspace"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                initial="hidden"
                animate="visible"
                custom={3}
                variants={sectionVariants}
              >
                <h2 className="text-lg font-semibold text-red-500 mb-4">
                  Danger Zone
                </h2>
                <div className="space-y-4">
                  <button className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    Delete Account
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-8">
              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                initial="hidden"
                animate="visible"
                custom={0}
                variants={sectionVariants}
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Change Password
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                initial="hidden"
                animate="visible"
                custom={1}
                variants={sectionVariants}
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Two-Factor Authentication
                </h2>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-700">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                initial="hidden"
                animate="visible"
                custom={2}
                variants={sectionVariants}
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Login History
                </h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-800">
                          Chrome on Windows
                        </p>
                        <p className="text-sm text-gray-500">IP: 192.168.1.1</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        May 2, 2025 at 9:42 AM
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-800">
                          Safari on MacOS
                        </p>
                        <p className="text-sm text-gray-500">IP: 192.168.1.1</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        Apr 30, 2025 at 5:15 PM
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === "language" && (
            <div className="space-y-8">
              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                initial="hidden"
                animate="visible"
                custom={0}
                variants={sectionVariants}
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Language Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      App Language
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="japanese">Japanese</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                initial="hidden"
                animate="visible"
                custom={1}
                variants={sectionVariants}
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Regional Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Day of Week
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option>Sunday</option>
                      <option>Monday</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country/Region
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                      <option>Germany</option>
                      <option>France</option>
                      <option>Japan</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Save button */}
          <div className="mt-8 flex justify-end">
            <motion.button
              onClick={handleSave}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </motion.button>
          </div>

          {/* Save notification */}
          {showSaveNotification && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={notificationVariants}
              className="fixed bottom-4 right-4 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center"
            >
              <Check className="w-5 h-5 mr-2" />
              <span>Settings saved successfully!</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
