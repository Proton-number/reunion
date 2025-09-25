"use client";

import { supabase } from "@/lib/supabase";
import { create } from "zustand";

interface Media {
  id: string;
  year: number;
  file_url: string;
  type: string;
  created_at: string;
}

interface MediaStore {
  media: Record<number, Media[]>; // ✅ store media per year
  uploading: boolean;
  loading: boolean;
  fetchMediaByYear: (year: number) => Promise<void>;
  fetchAllMedia: (year: number) => Promise<void>;
  uploadFile: (file: File, year: number) => Promise<void>;
}

export const useMediaStore = create<MediaStore>((set) => ({
  media: {}, // ✅ now a dictionary
  uploading: false,
  loading: false,

  fetchMediaByYear: async (year) => {
    set({ loading: true });

    const { data: files, error } = await supabase.storage
      .from("reunion-media")
      .list(`${year}/`, {
        limit: 4,
        sortBy: { column: "created_at", order: "asc" },
      });

    if (error) {
      console.error("Error fetching bucket files:", error);
      set({ loading: false });
      return;
    }

    const mediaFiles = files.map((file) => {
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("reunion-media")
        .getPublicUrl(`${year}/${file.name}`);

      return {
        id: file.id ?? file.name,
        year,
        file_url: publicUrl,
        type: file.name.endsWith(".mp4") ? "video" : "image",
        created_at: file.created_at ?? new Date().toISOString(),
      };
    });

    set((state) => ({
      media: {
        ...state.media,
        [year]: mediaFiles, // ✅ scoped to year
      },
      loading: false,
    }));
  },

  fetchAllMedia: async (year) => {
    set({ loading: true });

    const { data: files, error } = await supabase.storage
      .from("reunion-media")
      .list(`${year}/`, {
        sortBy: { column: "created_at", order: "asc" },
      });

    if (error) {
      console.error("Error fetching bucket files:", error);
      set({ loading: false });
      return;
    }

    const mediaFiles = files.map((file) => {
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("reunion-media")
        .getPublicUrl(`${year}/${file.name}`);

      return {
        id: file.id ?? file.name,
        year,
        file_url: publicUrl,
        type: file.name.endsWith(".mp4") ? "video" : "image",
        created_at: file.created_at ?? new Date().toISOString(),
      };
    });

    set((state) => ({
      media: {
        ...state.media,
        [year]: mediaFiles, // ✅ scoped to year
      },
      loading: false,
    }));
  },

  uploadFile: async (file, year) => {
    set({ uploading: true });
    try {
      const fileName = `${year}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("reunion-media")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("reunion-media").getPublicUrl(fileName);

      const file_url = publicUrl;

      const { data, error: insertError } = await supabase
        .from("media")
        .insert([
          {
            year,
            file_url,
            type: file.type.startsWith("video") ? "video" : "image",
          },
        ])
        .select();

      if (insertError) throw insertError;

      set((state) => ({
        media: {
          ...state.media,
          [year]: [data![0], ...(state.media[year] || [])], // ✅ update only that year
        },
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      set({ uploading: false });
    }
  },
}));
