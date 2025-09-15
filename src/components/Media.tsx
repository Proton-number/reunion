"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { UploadCloud } from "lucide-react";
import { FileUploader } from "react-drag-drop-files";
export default function Media() {
  const [file, setFile] = useState<File | File[] | null>(null);

  const handleChange = (file: File | File[]) => {
    setFile(file);
  };
  const fileTypes = ["JPG", "PNG", "GIF"];
  return (
    <div className="flex flex-col gap-4">
      <h3>Select Year</h3>
      <Select>
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
        uploadedLabel="Uploaded Successfully! Upload another?"
      >
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400">
          <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            Drag and drop your photos/videos here
          </p>
          <p className="text-xs text-gray-500">or click to browse</p>
        </div>
      </FileUploader>

      {/* Preview */}
      {file && (
        <div className="mt-2">
          <h4 className="font-medium text-sm mb-1">Preview:</h4>
          {Array.isArray(file) ? (
            file.map((f, idx) => (
              <div key={idx} className="mb-2">
                {f.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(f)}
                    alt={`preview-${idx}`}
                    className="max-h-48 rounded-md border"
                  />
                ) : f.type.startsWith("video/") ? (
                  <video
                    src={URL.createObjectURL(f)}
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
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="max-h-48 rounded-md border"
                />
              ) : file.type.startsWith("video/") ? (
                <video
                  src={URL.createObjectURL(file)}
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

      <Button className="cursor-pointer">Upload</Button>
    </div>
  );
}
