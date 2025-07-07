"use client";

import { useState } from "react";
import { Link } from "lucide-react";
import { CreateLinkForm } from "@/components/create-link-form";
import { BulkUpload } from "@/components/bulk-upload";
import { LinksList } from "@/components/links-list";
import { ToastContainer, useToasts } from "@/components/toast-container";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toasts, addToast, removeToast } = useToasts();

  const handleLinkCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    addToast({
      title: "Success!",
      description: "Link created successfully",
      type: "success",
    });
  };

  const handleUploadComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleError = (message: string) => {
    addToast({
      title: "Error",
      description: message,
      type: "error",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Shortr</h1>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                URL Shortener & Link Management
              </p>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        <CreateLinkForm
          onLinkCreated={handleLinkCreated}
          onError={handleError}
        />

        <BulkUpload
          onUploadComplete={handleUploadComplete}
          onError={handleError}
        />

        <LinksList refreshTrigger={refreshTrigger} onError={handleError} />
      </main>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
