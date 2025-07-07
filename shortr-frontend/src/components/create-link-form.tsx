"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { linksApi } from "@/lib/api";
import { CreateLinkRequest } from "@/types";

interface CreateLinkFormProps {
  onLinkCreated: () => void;
  onError: (message: string) => void;
}

export function CreateLinkForm({
  onLinkCreated,
  onError,
}: CreateLinkFormProps) {
  const [formData, setFormData] = useState<CreateLinkRequest>({
    alias: "",
    url: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await linksApi.create(formData);
      setFormData({ alias: "", url: "" });
      onLinkCreated();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create link";
      onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Link
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="alias" className="text-sm font-medium">
                Custom Alias
              </label>
              <Input
                id="alias"
                value={formData.alias}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, alias: e.target.value }))
                }
                placeholder="Enter custom alias"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">
                Destination URL
              </label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, url: e.target.value }))
                }
                placeholder="https://example.com"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Link
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
