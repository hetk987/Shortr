"use client";

import { useState } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { linksApi } from "@/lib/api";
import { parseCSV } from "@/lib/utils";
import { CreateLinkRequest } from "@/types";

interface BulkUploadProps {
  onUploadComplete: () => void;
  onError: (message: string) => void;
}

export function BulkUpload({ onUploadComplete, onError }: BulkUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewLinks, setPreviewLinks] = useState<CreateLinkRequest[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const links = parseCSV(text);

      if (links.length === 0) {
        onError("No valid links found in CSV file");
        return;
      }

      setPreviewLinks(links);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(
      (file) => file.type === "text/csv" || file.name.endsWith(".csv")
    );

    if (csvFile) {
      processFile(csvFile);
    } else {
      onError("Please drop a CSV file");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUpload = async () => {
    if (previewLinks.length === 0) return;

    setIsUploading(true);
    try {
      const result = await linksApi.bulkCreate({ links: previewLinks });

      if (result.errors.length > 0) {
        onError(`${result.errors.length} links failed to upload`);
      } else {
        onError(`Successfully uploaded ${result.created.length} links`);
      }

      setPreviewLinks([]);
      onUploadComplete();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload links";
      onError(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {previewLinks.length === 0 ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 dark:border-gray-600"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Drag and drop a CSV file here, or
              <label className="text-blue-600 cursor-pointer hover:underline ml-1">
                click to browse
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-sm text-gray-500">
              CSV format: alias,url (one per line)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Preview ({previewLinks.length} links)
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewLinks([])}
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-60 overflow-y-auto">
              {previewLinks.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm mb-2"
                >
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                    {link.alias}
                  </span>
                  <span className="text-gray-500">→</span>
                  <span className="text-gray-600 dark:text-gray-400 truncate">
                    {link.url}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Links
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
