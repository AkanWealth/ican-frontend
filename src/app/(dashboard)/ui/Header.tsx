"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, BellIcon, ChevronDown } from "lucide-react";
import Image from "next/image";
import Notification from "@/components/membercomps/Notification";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { parseCookies, destroyCookie } from "nookies";
import apiClient from "@/services/apiClient";
import Cookies from "universal-cookie";

interface UserData {
  id: string;
  firstname: string;
  surname: string;
  email: string;
  profilePicture?: string;
}

export const Header = () => {
  const cookies = useMemo(() => new Cookies(), []); // Wrap cookies in useMemo
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const s3Loader = ({
    src,
    width,
    quality,
  }: {
    src: string;
    width: number;
    quality?: number;
  }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [cookies]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen && !isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen, isMobile]);

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
        const userDetails = await apiClient.get<UserData>(`/users/${userId}`);

        const profilePictureUrl = userDetails.profilePicture;
        console.log("Profile Picture URL:", profilePictureUrl); // Log the URL for debugging

        if (profilePictureUrl) {
          setProfilePicture(profilePictureUrl); // Update the profile picture state
        } else {
          console.warn("Profile picture not found in user data");
          setProfilePicture("/Ellipse 1732.png");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchProfilePicture();
  }, [cookies]); // Include cookies in the dependency array

  const handleLogout = () => {
    // Remove cookies instead of localStorage
    destroyCookie(null, "access_token");
    destroyCookie(null, "refresh_token");
    destroyCookie(null, "user_data");

    router.push("/login");
  };

  return (
    <header
      className={` h-[6rem] fixed top-0 right-0 ${
        isMobile || isTablet ? "left-0 w-full" : "left-10 lg:left-60"
      } z-30 p-2 transition-all duration-300`}
    >
      <div className="h-full bg-white border-b border-gray-400 shadow-sm px-4 md:px-12 flex items-center justify-between">
        {/* Search Bar */}
        <div
          className={`flex items-center ${
            isMobile ? "ml-10" : isTablet ? "ml-6" : "ml-0"
          }`}
        >
          <div className="relative group md:w-auto">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Search className="w-5 h-5 text-black" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className={`h-10 pl-10 pr-4 rounded-full text-base focus:outline-none focus:ring-1 focus:ring-blue-500 text-black placeholder:text-black ${
                isMobile ? "w-48" : "w-full"
              }`}
            />
          </div>
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-4 md:space-x-8">
          {!isMobile && (
            <div className="relative">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <BellIcon
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="w-5 h-5 md:w-6 md:h-6"
                />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  5
                </span>
              </div>
              {isNotificationOpen && (
                <div
                  ref={notificationRef}
                  className="absolute right-0 mt-2 w-64 md:w-80 bg-white rounded-lg shadow-lg z-50"
                >
                  <Notification />
                </div>
              )}
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 outline-none">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
                <Image
                  src={profilePicture || "/default-avatar.png"} // Use default avatar if profile picture is not available
                  alt="Profile"
                  // fill="true"
                  width={500}
                  height={500}
                  unoptimized={true}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isMobile && (
                <>
                  <DropdownMenuItem className="flex justify-between items-center">
                    Notifications
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      5
                    </span>
                  </DropdownMenuItem>
                  <div className="max-h-60 overflow-y-auto">
                    <Notification />
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => router.push("/Profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/Setting")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
