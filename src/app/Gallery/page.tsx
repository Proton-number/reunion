"use client";

import React from "react";
import { ChevronRight, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Media from "@/components/Media";

function Gallery() {
  const photosByYear: Record<number, string[]> = {
    2024: [
      "/images/2024-1.jpg",
      "/images/2024-2.jpg",
      "/images/2024-3.jpg",
      "/images/2024-4.jpg",
    ],
    2023: [
      "/images/2023-1.jpg",
      "/images/2023-2.jpg",
      "/images/2023-3.jpg",
      "/images/2024-4.jpg",
    ],
    2022: [
      "/images/2022-1.jpg",
      "/images/2022-2.jpg",
      "/images/2022-3.jpg",
      "/images/2022-4.jpg",
    ],
    // Add more years as needed
  };

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
                {photosByYear[Number(year)].map((src, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden rounded-lg shadow"
                  >
                    <Image
                      src={src}
                      alt={`${year} photo ${index + 1}`}
                      width={500}
                      height={500}
                      className="object-cover w-full aspect-square transition-transform duration-200 hover:scale-105"
                    />
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
