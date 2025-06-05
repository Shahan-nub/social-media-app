"use client";
import {
  Aperture,
  ChevronUp,
  Home,
  Image,
  ImageUp,
  MonitorUp,
  User2,
  Video,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Link from "next/link";
import axios from "axios";
import { setUser } from "@/lib/features/userSlice";
import { useEffect } from "react";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Photos",
    url: "/photos",
    icon: Image,
  },
  {
    title: "Videos",
    url: "/videos",
    icon: Video,
  },
  {
    title: "Upload Photo",
    url: "/upload-photo",
    icon: ImageUp,
  },
  {
    title: "Upload Video",
    url: "/upload-video",
    icon: MonitorUp,
  },
];

export function AppSidebar() {
  const { data: session} = useSession();
  
  const email = session?.user.email;

  const dispatch = useDispatch();

  const username = useSelector((state: RootState) => state.user.username);

  useEffect(() => {
    const getUser = async () => {
      try {

        const user = await axios.post("/api/get-user", { email });

        if(user){
          dispatch(setUser({ email: email!, username: user.data.data.username }));
        }
      } catch (error) {
        console.log(error);
      }
    };

    if(email) getUser();
  }, [email, dispatch]);

  // console.log(username);
  const handleSignout = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to sign out");
    }
  };
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex gap-2 p-2">
          <Aperture />
          <span>ConnectHub</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="gap-2">Explore</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {username}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                {session && (
                  <DropdownMenuItem>
                    <div className="" onClick={handleSignout}>
                      Sign out
                    </div>
                  </DropdownMenuItem>
                )}
                {!session && (
                  <DropdownMenuItem>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
