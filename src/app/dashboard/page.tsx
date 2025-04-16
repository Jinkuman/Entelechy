// app/dashboard/page.tsx (or pages/dashboard.tsx)
import { Sidebar } from "@/components/sidebar";

export default function Dashboard() {
  return (
    <>
      {/* Render the Sidebar component */}
      <Sidebar />

      {/* 
        Wrap your main content in a div that adds enough top padding 
        so the content isn’t hidden behind the Sidebar header.
      */}
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 pt-14">
        <header className="p-4 bg-zinc-200 dark:bg-zinc-800 shadow">
          <h1 className="text-2xl font-bold text-center text-zinc-900 dark:text-zinc-100">
            Entelechy Dashboard
          </h1>
        </header>
        <main className="flex flex-col items-center justify-center flex-grow p-4">
          {/* Future content for logged in users will go here */}
          <p className="text-zinc-800 dark:text-zinc-200">
            Welcome to Entelechy!
          </p>
        </main>
      </div>
    </>
  );
}
