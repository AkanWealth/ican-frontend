import React from 'react';
import {
  Home, 
  Calendar, 
  CreditCard,
  FileText, Notebook,
  User,
  Settings,
  LogOut
} from 'lucide-react';

import { cn } from "@/lib/utils";
import Image from "next/image";



const topMenuItems = [
  { icon: Home, label: 'Overview', href: '/' },
  { icon: CreditCard, label: 'Payment', href: '/payment' },
  { icon: Calendar, label: 'Events', href: '/events' },
  { icon: FileText, label: 'Resources', href: '/resources' },
  { icon: Notebook, label: 'MCPD Records', href: '/mcpd-records' },
];

const bottomMenuItems = [
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/settings' }
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
                <span className="hover:text-green-500">{item.label}</span>
              </a>
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