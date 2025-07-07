import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "error" | "info";
  onClose: (id: string) => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ id, title, description, type = "info", onClose, ...props }, ref) => {
    const iconMap = {
      success: "✓",
      error: "✕",
      info: "ℹ",
    };

    const colorMap = {
      success:
        "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400",
      error:
        "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400",
      info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300",
          colorMap[type]
        )}
        {...props}
      >
        <span className="text-lg font-semibold">{iconMap[type]}</span>
        <div className="flex-1">
          <h4 className="font-medium">{title}</h4>
          {description && (
            <p className="mt-1 text-sm opacity-90">{description}</p>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className="rounded p-1 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
);
Toast.displayName = "Toast";

export { Toast };
