import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mb-6">
          <Link className="w-8 h-8 text-slate-600 dark:text-slate-400" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Page not found
        </h2>

        <p className="text-slate-600 dark:text-slate-400 mb-6">
          The page you're looking for doesn't exist. It might have been moved or
          deleted.
        </p>

        <Button onClick={() => (window.location.href = "/")} className="w-full">
          Go to homepage
        </Button>
      </div>
    </div>
  );
}
