"use client";

import React, { useEffect } from "react";
import { ChevronRight, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Media from "@/components/Media";
import { useMediaStore } from "@/Store/upload";

function Gallery() {
  const photosByYear: Record<number, string[]> = {
    2024: [],
    2023: [],
    2021: [],
    2020: [],
  };
  const { media, fetchMediaByYear } = useMediaStore();

  useEffect(() => {
    // Fetch media for each year present in photosByYear
    Object.keys(photosByYear).forEach((year) => {
      fetchMediaByYear(Number(year));
    });
  }, [fetchMediaByYear]);

  return (
    <div className="p-10 max-w-10xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between ">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h1 className="font-bold text-5xl pt-5 ">Gallery</h1>
          <p className="text-lg max-w-xl pt-4">
            A collection of memorable moments from our annual reunions.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
              {" "}
              <Upload />
              Upload New Photos
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Share Your Memories</DialogTitle>
            </DialogHeader>
            <Media />
          </DialogContent>
        </Dialog>
      </div>
      <div className="pt-15 ">
        {Object.keys(photosByYear) // Get years
          .sort((a, b) => Number(b) - Number(a)) // Sort years descending
          .map((year) => (
            <div key={year} className="mb-12">
              {/* top side  */}
              <div className="flex items-start sm:items-center justify-between pb-6 gap-3">
                <h1 className="font-bold text-3xl sm:text-5xl">{year}</h1>
                <Link href={`/Gallery/${year}`}>
                  <div className="flex items-center gap-1 sm:gap-2 cursor-pointer text-base sm:text-lg">
                    <p className="underline underline-offset-2">See more</p>
                    <ChevronRight size={20} />
                  </div>
                </Link>
              </div>

              {/* Cards for images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {media[Number(year)]?.length === 0 || !media[Number(year)]
                  ? Array.from({ length: 4 }).map((_, idx) => (
                      <Card
                        key={idx}
                        className="overflow-hidden rounded-lg shadow"
                      >
                        <div className="relative w-full aspect-square">
                          <Skeleton className="absolute inset-0 h-full w-full" />
                        </div>
                      </Card>
                    ))
                  : media[Number(year)]
                      .slice(0, 4) // Show only 4 items per year
                      .map((item) => (
                        <Card
                          key={item.id}
                          className="overflow-hidden rounded-lg shadow p-0 w-full aspect-square flex items-center justify-center "
                        >
                          {item.type === "image" ? (
                            <Image
                              src={item.file_url}
                              alt={`${year} photo`}
                              width={800}
                              height={800}
                              className="object-cover w-full h-full aspect-square transition-transform duration-200 hover:scale-105"
                            />
                          ) : (
                            <video
                              controls
                              src={item.file_url}
                              className="object-cover w-full h-full aspect-square"
                              style={{ background: "black" }}
                            />
                          )}
                        </Card>
                      ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Gallery;
