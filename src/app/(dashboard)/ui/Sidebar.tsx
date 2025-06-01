"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  LayoutGridIcon,
  Calendar,
  Banknote,
  FileText,
  ListOrderedIcon,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { FaRegUser, FaRegCalendarCheck } from "react-icons/fa";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

const topMenuItems = [
  { icon: LayoutGridIcon, label: "Overview", href: "/Overview" },
  { icon: Banknote, label: "Payment", href: "/Payment" },
  { icon: FaRegCalendarCheck, label: "Events", href: "/Event" },
  { icon: FileText, label: "Resources", href: "/Resource" },
  // { icon: ListOrderedIcon, label: 'MCPD Records', href: '/MCPDRecords' },
];

const bottomMenuItems = [
  { icon: FaRegUser, label: "Profile", href: "/Profile" },
  { icon: Settings, label: "Settings", href: "/Setting" },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleNavigation = (href: string) => {
    if (isMobileView) {
      setIsOpen(false);
    }
    router.push(href);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };
  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobileView && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-6 left-6 z-40 text-gray-700 bg-white p-2 "
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 bg-blue-900 text-white flex flex-col transition-all duration-300 ease-in-out z-50 overflow-hidden",
          isMobileView
            ? isOpen
              ? "translate-x-0 w-64 shadow-2xl"
              : "-translate-x-full w-64"
            : "translate-x-0 w-60 lg:w-60"
        )}
      >
        {/* Content Container with Hidden Scrollbar */}
        <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
          {/* Close Button (Only for Mobile) */}
          {isMobileView && (
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white z-10"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          )}

          {/* Logo - Fixed at Top */}
          <div className="h-16 flex items-center py-12 border-b border-gray-200 px-6 flex-shrink-0">
            <Image src="/Icanlogo.png" alt="Logo" width={170} height={90} />
          </div>

          {/* Scrollable Navigation Section */}
          <div className="flex flex-col flex-grow overflow-y-auto p-4 scrollbar-hide">
            {/* Navigation Menu */}
            <nav className="flex flex-col flex-grow py-8 space-y-4">
              {topMenuItems.map((item, index) => {
                const active = isActiveLink(item.href);
                return (
                  <div
                    key={index}
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "flex items-center px-6 py-2 rounded-lg transition-colors cursor-pointer",
                      active
                        ? "bg-white text-blue-900"
                        : "hover:bg-blue-800 text-white"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0",
                        active ? "text-blue-900" : "text-white"
                      )}
                    />
                    <span className="ml-3 whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </nav>

            {/* Bottom Menu Items */}
            <div className="space-y-4 mt-20">
              {bottomMenuItems.map((item, index) => {
                const active = isActiveLink(item.href);
                return (
                  <div
                    key={index}
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "flex items-center px-6 py-2 rounded-lg transition-colors cursor-pointer",
                      active
                        ? "bg-white text-blue-900"
                        : "hover:bg-blue-800 text-white"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0",
                        active ? "text-blue-900" : "text-white"
                      )}
                    />
                    <span className="ml-3 whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Logout - Always Visible at Bottom of Scrollable Area */}
            <div
              onClick={handleLogout}
              className="flex items-center px-6 py-2 mt-40 mb-4 cursor-pointer hover:bg-blue-800 rounded-lg"
            >
              <LogOut className="w-5 h-5 transform scale-x-[-1] flex-shrink-0" />
              <span className="ml-3 whitespace-nowrap">Logout</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileView && isOpen && (
        <div
          className="fixed inset-0  bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
