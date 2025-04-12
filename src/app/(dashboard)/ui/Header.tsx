'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Search, BellIcon,ChevronDown} from 'lucide-react';
import Notification from '@/components/Notification';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



export const Header = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  return (
    <header className="h-[6rem] fixed top-0 right-0 left-60 z-30 p-2">
      <div className="h-full bg-white rounded-[50px] border border-gray-400 shadow-sm px-12 flex items-center justify-between">
        <div className="flex items-center">
          {/* <Search className="w-6 h-6 text-black" />
          <span className="ml-2 text-xl text-grey-600">Search</span> */}

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="w-5 h-5 text-black" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="w-full h-12 pl-12 pr-4 rounded-full test-xl
                       focus:outline-none  focus:ring-1 focus:ring-blue-500
                       text-base transition-colors text-black
                       placeholder:text-black"
            />
          </div>
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-8"> 
        <div className="relative">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <BellIcon
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
               className="w-6 h-6 " />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">5</span>
            </div>
            {isNotificationOpen && (
              <div
                ref={notificationRef}
                className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50"
              >
                <Notification />
              </div>
            )}
            </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 outline-none">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img 
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
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};