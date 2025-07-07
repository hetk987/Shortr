"use client";

/**
 * Shortr Frontend - Main Application Page
 *
 * This is the main React component for the URL shortener frontend.
 * Features include:
 * - Create new short links with custom aliases
 * - Display and manage existing short links
 * - Copy links to clipboard
 * - Delete links with confirmation
 * - Real-time updates and error handling
 * - Responsive design for mobile and desktop
 *
 * Technologies used:
 * - React with TypeScript
 * - shadcn/ui components
 * - Tailwind CSS for styling
 * - Lucide React for icons
 * - Sonner for toast notifications
 */

import { useState, useEffect, useCallback } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";
import { Trash2, ExternalLink, Copy, Plus, BarChart3 } from "lucide-react";

/**
 * TypeScript interface for short link data structure
 * Matches the backend API response format
 */
interface ShortLink {
  alias: string;
  url: string;
  count: number;
  createdAt: string;
}

export default function Home() {
  // State management for form inputs
  const [alias, setAlias] = useState("");
  const [url, setUrl] = useState("");

  // State management for links data and loading states
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);

  // API configuration - use environment variable or default to Docker service name
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://backend:80";

  /**
   * Fetch all short links from the backend API
   * Updates the links state and handles loading states
   */
  const fetchLinks = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/`);
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch {
      toast.error("Failed to fetch links");
    } finally {
      setIsLoadingLinks(false);
    }
  }, [API_BASE]);

  /**
   * Fetch all short links from the API on component mount
   */
  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  /**
   * Create a new short link
   * Validates input, sends POST request to API, and updates the UI
   */
  const createLink = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!alias || !url) {
      toast.error("Please fill in both alias and URL");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ alias, url }),
      });

      if (response.ok) {
        toast.success("Short link created successfully!");
        // Clear form and refresh links list
        setAlias("");
        setUrl("");
        fetchLinks();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create link");
      }
    } catch {
      toast.error("Failed to create link");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a short link by alias
   * Sends DELETE request to API and refreshes the links list
   */
  const deleteLink = async (alias: string) => {
    try {
      const response = await fetch(`${API_BASE}/${alias}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Link deleted successfully!");
        fetchLinks();
      } else {
        toast.error("Failed to delete link");
      }
    } catch {
      toast.error("Failed to delete link");
    }
  };

  /**
   * Copy a short link to the clipboard
   * Uses the current hostname and port for the copy URL
   */
  const copyToClipboard = (text: string) => {
    // Use the current hostname for the copy URL (works in Docker and local development)
    const currentHost = window.location.hostname;
    const currentPort = window.location.port ? `:${window.location.port}` : "";
    const protocol = window.location.protocol;
    const copyUrl = `${protocol}//${currentHost}${currentPort}/${text}`;
    navigator.clipboard.writeText(copyUrl);
    toast.success("Copied to clipboard!");
  };

  /**
   * Format date string to readable format
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Toast notifications container */}
      <Toaster />

      <div className="container mx-auto px-4 py-8">
        {/* Application Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Shortr
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Create beautiful, short URLs in seconds
          </p>
        </div>

        {/* Create New Link Form Card */}
        <Card className="max-w-2xl mx-auto mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Short Link
            </CardTitle>
            <CardDescription>
              Enter your custom alias and the URL you want to shorten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={createLink} className="space-y-4">
              {/* Form inputs in responsive grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alias">Custom Alias</Label>
                  <Input
                    id="alias"
                    placeholder="my-link"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">Target URL</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Short Link"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Links Management Card */}
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Your Short Links
            </CardTitle>
            <CardDescription>
              Manage and track your shortened URLs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Loading state */}
            {isLoadingLinks ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
                <p className="mt-2 text-slate-600">Loading links...</p>
              </div>
            ) : links.length === 0 ? (
              /* Empty state */
              <div className="text-center py-8 text-slate-600">
                <p>No short links created yet.</p>
                <p className="text-sm">Create your first one above!</p>
              </div>
            ) : (
              /* Links list */
              <div className="space-y-4">
                {links.map((link) => (
                  <div
                    key={link.alias}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {/* Link information */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-medium text-slate-900 dark:text-slate-100">
                          {link.alias}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {link.count} clicks
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {link.url}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        Created {formatDate(link.createdAt)}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 ml-4">
                      {/* Copy button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(link.alias)}
                        className="h-8 w-8 p-0"
                        title="Copy link"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>

                      {/* Open link button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(`${API_BASE}/${link.alias}`, "_blank")
                        }
                        className="h-8 w-8 p-0"
                        title="Open link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>

                      {/* Delete button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteLink(link.alias)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete link"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
