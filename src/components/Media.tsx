"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { UploadCloud } from "lucide-react";
import { FileUploader } from "react-drag-drop-files";
import Image from "next/image";
import { useMediaStore } from "@/Store/upload";

// Dynamic import for heic2any to avoid SSR issues
const loadHeic2any = async () => {
  if (typeof window !== "undefined") {
    const heic2any = await import("heic2any");
    return heic2any.default;
  }
  return null;
};

export default function Media() {
  const [file, setFile] = useState<File | File[] | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { uploadFile, uploading } = useMediaStore();

  // Cleanup object URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  // Check if a file is HEIC format
  const isHeicFile = (file: File): boolean => {
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    return (
      fileType === "image/heic" ||
      fileType === "image/heif" ||
      fileName.endsWith(".heic") ||
      fileName.endsWith(".heif")
    );
  };

  const convertHeicToJpeg = async (file: File): Promise<File> => {
    // Only convert if it's actually a HEIC file
    if (!isHeicFile(file)) {
      return file; // Return the original file unchanged
    }

    try {
      const heic2any = await loadHeic2any();
      if (!heic2any) {
        console.warn("heic2any not available, using original file");
        return file;
      }

      console.log(`Converting HEIC file: ${file.name}`);

      const result = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.7,
      });

      const blob = Array.isArray(result) ? result[0] : result;

      const convertedFile = new File(
        [blob],
        file.name.replace(/\.(heic|heif)$/i, ".jpg"),
        {
          type: "image/jpeg",
        }
      );

      console.log(
        `Successfully converted ${file.name} to ${convertedFile.name}`
      );
      return convertedFile;
    } catch (error) {
      console.error("Error converting HEIC to JPG:", error);
      setError(
        `Failed to convert HEIC file: ${file.name}. Using original file.`
      );
      return file;
    }
  };

  const processFiles = async (files: File | File[]): Promise<File[]> => {
    const fileArray = Array.isArray(files) ? files : [files];

    const processedFiles = await Promise.all(
      fileArray.map(async (file) => {
        if (isHeicFile(file)) {
          console.log(`Processing HEIC file: ${file.name}`);
          return await convertHeicToJpeg(file);
        } else {
          console.log(`Keeping original file: ${file.name} (${file.type})`);
          return file; // Return non-HEIC files as-is
        }
      })
    );

    return processedFiles.filter(Boolean); // Remove any null/undefined files
  };

  const createPreviewUrls = (files: File[]) => {
    // Clean up existing URLs
    previewUrls.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });

    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
  };

  const handleChange = async (uploadedFile: File | File[]) => {
    try {
      setError(null);
      console.log("Processing uploaded files...");

      const processedFiles = await processFiles(uploadedFile);

      if (processedFiles.length === 0) {
        setError("No valid files to process.");
        return;
      }

      // Set the file(s) - keep as array if multiple, single file if one
      if (processedFiles.length === 1) {
        setFile(processedFiles[0]);
      } else {
        setFile(processedFiles);
      }

      createPreviewUrls(processedFiles);
    } catch (error) {
      console.error("Error handling file change:", error);
      setError("Error processing files. Please try again.");
    }
  };

  const handleUpload = async () => {
    if (!file || !year) {
      setError("Please select a year and a file to upload.");
      return;
    }

    try {
      setError(null);

      if (Array.isArray(file)) {
        for (const f of file) {
          console.log(`Uploading: ${f.name} (${f.type})`);
          await uploadFile(f, year);
        }
      } else {
        console.log(`Uploading: ${file.name} (${file.type})`);
        await uploadFile(file, year);
      }

      // Clean up after successful upload
      setFile(null);
      previewUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
      setPreviewUrls([]);
      console.log("Upload completed successfully");
    } catch (error) {
      console.error("Upload error:", error);
      setError("Upload failed. Please try again.");
    }
  };

  const fileTypes = ["JPG", "JPEG", "PNG", "GIF", "MP4", "MOV", "HEIC", "HEIF"];

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <h3>Select Year</h3>
        <Select onValueChange={(val) => setYear(parseInt(val))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2021">2021</SelectItem>
            <SelectItem value="2020">2020</SelectItem>
          </SelectContent>
        </Select>

        {/* Upload Box */}
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          multiple={true}
          maxSize={50} // 50MB limit
          onTypeError={(err: string) => setError(`File type error: ${err}`)}
          onSizeError={(file: string) => setError(`File too large: ${file}`)}
        >
          <div className="mt-4 border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400 transition-colors">
            <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Drag and drop your photos/videos here
            </p>
            <p className="text-xs text-gray-500">
              or click to browse (Max 50MB per file)
            </p>
            <p className="text-xs text-gray-400 mt-1">
              HEIC files will be automatically converted to JPEG
            </p>
          </div>
        </FileUploader>
      </div>

      {/* Preview */}
      {file && previewUrls.length > 0 && (
        <div className="mt-2">
          <h4 className="font-medium text-sm mb-1">Preview:</h4>
          {Array.isArray(file) ? (
            file.map((f, idx) => (
              <div key={idx} className="mb-2">
                <p className="text-xs text-gray-500 mb-1">
                  {f.name} ({f.type})
                </p>
                {f.type.startsWith("image/") ? (
                  <Image
                    width={1920}
                    height={1080}
                    src={previewUrls[idx]}
                    alt={`preview-${idx}`}
                    className="max-h-48 w-auto rounded-md border object-contain"
                    unoptimized // For blob URLs
                  />
                ) : f.type.startsWith("video/") ? (
                  <video
                    src={previewUrls[idx]}
                    controls
                    className="max-h-48 rounded-md border"
                  />
                ) : (
                  <p className="text-gray-600 text-sm">{f.name}</p>
                )}
              </div>
            ))
          ) : (
            <>
              <p className="text-xs text-gray-500 mb-1">
                {file.name} ({file.type})
              </p>
              {file.type.startsWith("image/") ? (
                <Image
                  width={1920}
                  height={1080}
                  src={previewUrls[0]}
                  alt="preview"
                  className="max-h-48 w-auto rounded-md border object-contain"
                  unoptimized // For blob URLs
                />
              ) : file.type.startsWith("video/") ? (
                <video
                  src={previewUrls[0]}
                  controls
                  className="max-h-48 rounded-md border"
                />
              ) : (
                <p className="text-gray-600 text-sm">{file.name}</p>
              )}
            </>
          )}
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || !year || uploading}
        className="cursor-pointer mt-4"
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}
