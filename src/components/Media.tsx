"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { UploadCloud } from "lucide-react";
import Image from "next/image";
import { useMediaStore } from "@/Store/upload";
import heic2any from "heic2any";

// Dynamically import FileUploader (disable SSR)
const FileUploader = dynamic(
  () => import("react-drag-drop-files").then((mod) => mod.FileUploader),
  { ssr: false }
);

export default function Media() {
  const [file, setFile] = useState<File | File[] | null>(null);
  const [year, setYear] = useState<number | null>(null);

  const { uploadFile, uploading } = useMediaStore();

  const convertHeicToJpeg = async (file: File): Promise<File> => {
    if (
      file.type === "image/heic" ||
      file.name.toLowerCase().endsWith(".heic")
    ) {
      try {
        const result = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.7,
        });

        const blob = Array.isArray(result) ? result[0] : result;

        return new File([blob], file.name.replace(/\.heic$/i, ".jpg"), {
          type: "image/jpeg",
        });
      } catch (error) {
        console.error("Error converting HEIC to JPG:", error);
        return file;
      }
    }
    return file;
  };

  const handleChange = async (file: File | File[]) => {
    try {
      if (Array.isArray(file)) {
        const convertedFiles = await Promise.all(
          file.map((f) => convertHeicToJpeg(f))
        );
        setFile(convertedFiles.filter(Boolean));
      } else {
        const convertedFile = await convertHeicToJpeg(file);
        setFile(convertedFile);
      }
    } catch (error) {
      console.error("Error handling file change:", error);
    }
  };

  const handleUpload = async () => {
    if (!file || !year) {
      alert("Please select a year and a file to upload.");
      return;
    }

    if (Array.isArray(file)) {
      for (const f of file) {
        await uploadFile(f, year);
      }
    } else {
      await uploadFile(file, year);
    }
    setFile(null);
  };

  const fileTypes = ["JPG", "PNG", "GIF", "MP4", "MOV", "HEIC"];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3>Select Year</h3>
        <Select onValueChange={(val) => setYear(parseInt(val))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
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
          <div className="mt-4 border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400">
            <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Drag and drop your photos/videos here
            </p>
            <p className="text-xs text-gray-500">or click to browse</p>
          </div>
        </FileUploader>
      </div>

      <div>
        {/* Preview */}
        {typeof window !== "undefined" && file && (
          <div className="mt-2">
            <h4 className="font-medium text-sm mb-1">Preview:</h4>
            {Array.isArray(file) ? (
              file.map((f, idx) => (
                <div key={idx} className="mb-2">
                  {f.type.startsWith("image/") ? (
                    <Image
                      width={1920}
                      height={1080}
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
                  <Image
                    width={1920}
                    height={1080}
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

        <Button
          onClick={handleUpload}
          disabled={!file || !year || uploading}
          className="cursor-pointer mt-4"
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
}
