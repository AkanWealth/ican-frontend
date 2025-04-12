"use client";
import React, {useState} from "react";
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
import { constants } from "node:buffer";

function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [notifications, setNotifications] = useState([
    {
      header: "Admin Created",
      message: "A new admin has been created",
      date: "2 minutes ago",
    },
  ]);

  const findMenuItem = (pathname: string) => {
    return (
      topMenuItems.find((item) => item.href === pathname) ||
      bottomMenuItems.find((item) => item.href === pathname)
    );
  };
  const item = findMenuItem(pathname);

  return (
    <header className="h-24 w-full py-6 bg-white shadow-sm px-8 flex items-center justify-between">
      <div className="flex flex-row items-center gap-4">
        {item && <item.icon className="w-6 h-6 fill-primary" />}
        <p className=" text-black  whitespace-nowrap">{item?.label}</p>
      </div>

      {/* Profile Section */}
      <div className="flex items-center space-x-8">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-2 outline-none">
            <div className=" relative w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <BellIcon className="w-6 h-6 " />
              <span className="absolute z-10 -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white">
                {notifications.length}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-row items-center gap-2 justify-start">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <BellIcon className="w-6 h-6 " />
              </div>
              Notifications ({notifications.length})
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.slice(0, 4).map((notification, index) => (
                <DropdownMenuItem
                  key={index}
                  className="text-primary flex flex-row gap-2"
                >
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <BellIcon className="w-4 h-4 " />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <h5 className="text-sm text-black font-medium">
                      {notification?.header}
                    </h5>
                    <p className="text-xs text-neutral-600">
                      {notification?.message}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem className="text-gray-500">
                <Image
                  width={400}
                  height={400}
                  src="/nonotifications.png"
                  alt="No Notifications"
                />
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={() => router.push("/admin/notifications")}
              className="text-primary"
            >
              All Notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-2 outline-none">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                width={40}
                height={40}
                src="/Ellipse 1732.png"
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
