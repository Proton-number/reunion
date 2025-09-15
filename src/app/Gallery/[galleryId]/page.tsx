"use client";

import { useParams } from "next/navigation";
import React from "react";

function GalleryDetails() {
  const { galleryId } = useParams();
  return <div>This is the gallery details page for gallery {galleryId}</div>;
}

export default GalleryDetails;
