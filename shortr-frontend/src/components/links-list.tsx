"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { linksApi } from "@/lib/api";
import { formatDate, formatNumber, copyToClipboard } from "@/lib/utils";
import { ShortLink, SortOption } from "@/types";

interface LinksListProps {
  refreshTrigger: number;
  onError: (message: string) => void;
}

export function LinksList({ refreshTrigger, onError }: LinksListProps) {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("createdAt-desc");
  const [editingLink, setEditingLink] = useState<ShortLink | null>(null);
  const [editUrl, setEditUrl] = useState("");

  const fetchLinks = useCallback(async () => {
    try {
      const data = await linksApi.getAll();
      setLinks(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch links";
      onError(message);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks, refreshTrigger]);

  // Filter and sort links
  const filteredLinks = links
    .filter(
      (link) =>
        link.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.url.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "createdAt-desc":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "createdAt-asc":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "count-desc":
          return b.count - a.count;
        case "count-asc":
          return a.count - b.count;
        case "alias-asc":
          return a.alias.localeCompare(b.alias);
        default:
          return 0;
      }
    });

  const handleDelete = async (alias: string) => {
    if (!confirm(`Delete link "${alias}"?`)) return;

    try {
      await linksApi.delete(alias);
      setLinks((prev) => prev.filter((link) => link.alias !== alias));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete link";
      onError(message);
    }
  };

  const handleEdit = async () => {
    if (!editingLink || !editUrl) return;

    try {
      await linksApi.update(editingLink.alias, editUrl);
      setLinks((prev) =>
        prev.map((link) =>
          link.alias === editingLink.alias
            ? { ...link, url: editUrl, count: 0 }
            : link
        )
      );
      setEditingLink(null);
      setEditUrl("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update link";
      onError(message);
    }
  };

  const handleCopy = async (alias: string) => {
    const shortUrl = `${window.location.origin}/${alias}`;
    try {
      await copyToClipboard(shortUrl);
      onError("Link copied to clipboard!");
    } catch {
      onError("Failed to copy link");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading links...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Your Links ({filteredLinks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by alias or URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="count-desc">Most Clicks</option>
              <option value="count-asc">Least Clicks</option>
              <option value="alias-asc">Alphabetical</option>
            </select>
          </div>

          {/* Links List */}
          {filteredLinks.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm
                  ? "No links match your search."
                  : "No links found. Create your first shortlink above!"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLinks.map((link) => (
                <div
                  key={link.alias}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-400">
                        {link.alias}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatNumber(link.count)} clicks
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {link.url}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created {formatDate(link.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(link.alias)}
                      title="Copy link"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/${link.alias}`, "_blank")}
                      title="Visit link"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingLink(link);
                        setEditUrl(link.url);
                      }}
                      title="Edit link"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(link.alias)}
                      title="Delete link"
                      className="text-red-600 hover:text-red-700"
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

      {/* Edit Modal */}
      {editingLink && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Alias</label>
                <Input value={editingLink.alias} disabled className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">URL</label>
                <Input
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingLink(null);
                    setEditUrl("");
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleEdit}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
