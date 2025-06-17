"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Search, BellIcon, ChevronDown } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { topMenuItems, bottomMenuItems } from "./Sidebar";

import { User } from "@/libs/types";



import { parseCookies } from "nookies";
import apiClient from "@/services/apiClient";
import Cookies from "universal-cookie";

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const cookies = useMemo(() => new Cookies(), []); // Wrap cookies in useMemo

  // Fetch the user's profile picture using cookies
  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        if (typeof window === "undefined") return; // Ensure code runs only on the client side

        const cookies = parseCookies();
        const userDataCookie = cookies["user_data"];
        const userData = userDataCookie ? JSON.parse(userDataCookie) : null;
        const userId = userData?.id;

        if (!userId) {
          console.error("User ID not found in cookies");
          return;
        }

        // Use apiClient instead of direct axios call
        const userDetails = await apiClient.get<User>(`/users/${userId}`);

        const profilePictureUrl = userDetails.profilePicture;
        console.log("Profile Picture URL:", profilePictureUrl); // Log the URL for debugging

        if (profilePictureUrl) {
          setProfilePicture(profilePictureUrl); // Update the profile picture state
        } else {
          console.warn("Profile picture not found in user data");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchProfilePicture();
  }, [cookies]); // Include cookies in the dependency array

  const findMenuItem = (pathname: string) => {
    return (
      topMenuItems.find((item) => item.href === pathname) ||
      bottomMenuItems.find((item) => item.href === pathname)
    );
  };
  const item = pathname ? findMenuItem(pathname) : null;

  return (
    <header className="h-24 w-full py-6 bg-white shadow-sm px-8 flex items-center justify-between">
      <div className="flex flex-row items-center gap-4">
        {item && <item.icon className="w-6 h-6 fill-primary" />}
        <p className=" text-black  whitespace-nowrap">{item?.label}</p>
      </div>

      {/* Profile Section */}
      <div className="flex items-center space-x-8">
        <div
          onClick={() => router.push("/admin/notifications")}
          className=" relative w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
        >
          <BellIcon className="w-6 h-6 " />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-2 outline-none">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                width={40}
                height={40}
                src={profilePicture || "/Ellipse 1732.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/admin/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/admin/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
export default Header;
