"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Trash2, ExternalLink, Copy, Plus, BarChart3 } from "lucide-react";

interface ShortLink {
  alias: string;
  url: string;
  count: number;
  createdAt: string;
}

export default function Home() {
  const [alias, setAlias] = useState("");
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:80";

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch(`${API_BASE}/`);
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (error) {
      toast.error("Failed to fetch links");
    } finally {
      setIsLoadingLinks(false);
    }
  };

  const createLink = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setAlias("");
        setUrl("");
        fetchLinks();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create link");
      }
    } catch (error) {
      toast.error("Failed to create link");
    } finally {
      setIsLoading(false);
    }
  };

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
    } catch (error) {
      toast.error("Failed to delete link");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(`${API_BASE}/${text}`);
    toast.success("Copied to clipboard!");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Toaster />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Shortr
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Create beautiful, short URLs in seconds
          </p>
        </div>

        {/* Create Link Form */}
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

        {/* Links List */}
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
            {isLoadingLinks ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
                <p className="mt-2 text-slate-600">Loading links...</p>
              </div>
            ) : links.length === 0 ? (
              <div className="text-center py-8 text-slate-600">
                <p>No short links created yet.</p>
                <p className="text-sm">Create your first one above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {links.map((link) => (
                  <div
                    key={link.alias}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
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
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(link.alias)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(`${API_BASE}/${link.alias}`, "_blank")
                        }
                        className="h-8 w-8 p-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteLink(link.alias)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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
