"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { Aperture, Image, TvMinimalPlay } from "lucide-react";

export const Header = () => {
  const { data: session, status } = useSession();
  console.log(session, status);
  const handleSignout = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully.");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };
  return (
    <div className="flex w-full items-center justify-between pb-4 px-4">
      <div className="flex items-center gap-3">
        <Aperture />
        <div className="hidden md:flex text-lg lg:text-xl font-semibold font-stretch-50%">
          <Link href="/">ConnectHub</Link>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm md:text-base font-medium">
        <Link href="/photos"><Image /></Link>
        <Link href="/videos"><TvMinimalPlay /></Link>
        <Link href="/upload-video">Post Video</Link>
        <Link href="/upload-photo">Post Photo</Link>

        {session && (
          <Button className="" variant="link" onClick={handleSignout}>
            Sign out
          </Button>
        )}
        {!session && <Link href="/login">Login</Link>}
      </div>
    </div>
  );
};
