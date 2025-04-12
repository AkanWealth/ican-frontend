import React from 'react';
import {
  LayoutGridIcon,
  Calendar, 
  Banknote,
  FileText, ListOrderedIcon,
  Settings,
  LogOut
} from 'lucide-react';
import { FaRegUser, FaRegCalendarCheck } from 'react-icons/fa';

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from 'next/link';



const topMenuItems = [
  { icon: LayoutGridIcon, label: 'Overview', href: '/dashboard' },
  { icon: Banknote, label: 'Payment', href: '/payment' },
  { icon: FaRegCalendarCheck, label: 'Events', href: '/events' },
  { icon: FileText, label: 'Resources', href: '/resources' },
  { icon: ListOrderedIcon, label: 'MCPD Records', href: '/MCPDRecords' },
];

const bottomMenuItems = [
  { icon: FaRegUser, label: 'Profile', href: '/Profile' },
  { icon: Settings, label: 'Settings', href: '/Setting' }
];

export const Sidebar = () => {
  return (
    <aside className="sticky top-0 flex-shrink-0 w-60 bg-blue-900 text-white border-r flex flex-col p-4">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 py-12 border-b border-gray-200">
        <Image alt="Logo" width={300} height={150} src="/Logo_small_white.png" />
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col">
        {/* Top Menu Group */}
        <div className="flex-grow py-12">
          <div className="space-y-8">
            {topMenuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-6 rounded-lg",
                  "transition-colors",
                  "text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="hover:text-green-500 test-xs">{item.label}</span>
              </a>
            ))}
          </div>
{/* 
          <div className="my-6" /> */}

          {/* Bottom Menu Group */}
          <div className="mt-32 space-y-8">
            {bottomMenuItems.map((item, index) => (
               <Link 
               key={index} 
               href={item.href}
               className={cn(
                "flex items-center space-x-3 px-6 rounded-lg",
                "transition-colors",
                "text-white"
              )}>
               
                 <item.icon className="w-5 h-5" />
                 <span className="hover:text-green-500">{item.label}</span>
               
             </Link>
            ))}
          </div>
        </div>

        
        <div>
          <a
            href="/logout"
            className="flex items-center space-x-3 px-6 py-2 rounded-lg mt-32 mb-20"
          >
            <LogOut className="w-5 h-5 transform scale-x-[-1]" />
            <span className="hover:text-green-500 test-xs">Logout</span>
          </a>
        </div>
      </nav>
    </aside>
  );
};