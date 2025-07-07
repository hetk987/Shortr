export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Loading Shortr
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Preparing your URL shortener...
        </p>
      </div>
    </div>
  );
}
