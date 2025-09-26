"use client";

import { Card } from "@/components/ui/card";
import { useMediaStore } from "@/Store/upload";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

  if (!galleryMedia.length) {
    // Show loading skeletons if no media for the year
    return (
      <div className="p-10 max-w-10xl mx-auto">
        <h1 className="font-bold text-4xl pb-10">All Photos - {year}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Card key={idx} className="overflow-hidden rounded-lg shadow">
              <div className="relative w-full aspect-square">
                <Skeleton className="absolute inset-0 h-full w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-10xl mx-auto">
      <h1 className="font-bold text-4xl pb-10">All Photos - {year}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {galleryMedia.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden rounded-lg shadow p-0 w-full aspect-square flex items-center justify-center "
          >
            {item.type === "image" ? (
              <Image
                src={item.file_url}
                alt={`${item.year} photo`}
                width={800}
                height={800}
                className="object-cover w-full h-full aspect-square transition-transform duration-200 hover:scale-105"
              />
            ) : (
              <video
                controls
                src={item.file_url}
                className="object-cover w-full h-full aspect-square  hover:scale-105 transition-transform duration-200"
                style={{ background: "black" }}
              />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default GalleryDetails;
