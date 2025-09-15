"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center  text-center justify-center p-24 space-y-4">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-bold mb-6"
      >
        Annual Reunion Memories
      </motion.h1>
      <p className="text-lg max-w-xl">
        Relive the joy of every reunion with photos and videos.
      </p>

      <Link href={"/Gallery"}>
        <Button className="cursor-pointer">View Gallery</Button>
      </Link>
    </div>
  );
}
