"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="w-full text-white flex flex-col items-center justify-center px-6 md:px-12 lg:py-20 py-12">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Share Your <span className="text-indigo-500">Moments</span> with the World
        </h1>
        <p className="mt-6 text-lg md:text-xl text-zinc-300">
          Upload stunning photos and videos. Connect, inspire, and grow your creative community on ConnectHub.
        </p>
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <Button asChild className="px-6 py-3 text-lg text-[#cac9c9]">
            <Link href="/upload-photo">Upload Photo</Link>
          </Button>
          <Button asChild variant="outline" className="px-6 py-3 text-lg border-white text-white hover:bg-white hover:text-black">
            <Link href="/upload-video" className="flex items-center gap-2">
              <PlayCircle size={20} />
              Upload Video
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
