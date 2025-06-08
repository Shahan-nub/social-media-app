"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";

export default function PhotoHero() {
  return (
    <section className="w-full text-white flex flex-col items-center justify-center px-6 md:px-12 lg:py-20 py-12">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Discover <span className="text-indigo-500">Incredible Photos</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-zinc-300">
          Explore beautiful moments captured by our vibrant community. Like, comment, and share your vision.
        </p>
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <Button asChild className="px-6 py-3 text-lg text-[#cac9c9]">
            <Link href="/upload-photo">
              <span className="flex items-center gap-2">
                <ImageIcon size={20} />
                Upload Photo
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

