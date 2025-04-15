export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <header className="p-4 bg-zinc-200 dark:bg-zinc-800 shadow">
        <h1 className="text-2xl font-bold text-center text-zinc-900 dark:text-zinc-100">
          Entelechy
        </h1>
      </header>
      <main className="flex flex-col items-center justify-center flex-grow p-4">
        {/* Future content for logged in users will go here */}
        <p className="text-zinc-800 dark:text-zinc-200">
          Welcome to Entelechy!
        </p>
      </main>
    </div>
  );
}
