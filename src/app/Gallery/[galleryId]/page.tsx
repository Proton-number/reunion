"use client";

import { Card } from "@/components/ui/card";
import { useMediaStore } from "@/Store/upload";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

function GalleryDetails() {
  const { galleryId } = useParams();
  const year = Number(galleryId);

  const { media, fetchAllMedia } = useMediaStore();
  const galleryMedia = media[year] || []; // scoped to selected year

  useEffect(() => {
    if (year) {
      fetchAllMedia(year);
    }
  }, [year, fetchAllMedia]);

  return (
    <div className="p-10 max-w-10xl mx-auto">
      <h1 className="font-bold text-4xl pb-10">All Photos - {year}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {galleryMedia.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden rounded-lg shadow p-0 w-full aspect-square flex items-center justify-center "
          >
            <Image
              src={item.file_url}
              alt={`${item.year} photo`}
              width={800}
              height={800}
              className="object-cover w-full h-full aspect-square transition-transform duration-200 hover:scale-105"
            />
          </Card>
        ))}
      </div>
    </div>
  );
}

export default GalleryDetails;
