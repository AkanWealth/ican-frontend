"use client";
import React from "react";
import { LogOut } from "lucide-react";
import {
  MdOutlinePeopleAlt,
  MdCollectionsBookmark,
  MdAttachMoney,
  MdOutlinePerson,
  MdOutlineAnalytics,
  MdHome,
  MdOutlineSettings,
} from "react-icons/md";
import { IoMdCalendar } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { logout } from "@/lib/auth";

const topMenuItems = [
  { icon: MdHome, label: "Dashboard", href: "/admin" },
  {
    icon: MdOutlinePeopleAlt,
    label: "Admin Management",
    href: "/admin/admins",
  },

  {
    icon: MdOutlinePeopleAlt,
    label: "Members Management",
    href: "/admin/members",
  },
  {
    icon: MdCollectionsBookmark,
    label: "Content Management",
    href: "/admin/content",
  },
  { icon: IoMdCalendar, label: "Event Management", href: "/admin/events" },

  { icon: MdAttachMoney, label: "Payment", href: "/admin/payment" },
  { icon: MdOutlineAnalytics, label: "Billing", href: "/admin/billing" },
];

const bottomMenuItems = [
  { icon: MdOutlinePerson, label: "Profile", href: "/admin/profile" },
  { icon: MdOutlineSettings, label: "Settings", href: "/admin/settings" },
];

function Sidebar() {
  const pathname = usePathname();
  const findMenuItem = (pathname: string) => {
    return (
      topMenuItems.find((item) => item.href === pathname) ||
      bottomMenuItems.find((item) => item.href === pathname)
    );
  };
  const item = pathname ? findMenuItem(pathname) : null;
  const activePage = item?.label;

  return (
    <aside className="h-fit w-fit bg-white text-black border-r flex flex-col p-4">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 py-12 border-b border-gray-200">
        <Image alt="Logo" width={200} height={80} src="/Logo_big.png" />
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col">
        {/* Top Menu Group */}
        <div className="flex flex-col py-12">
          <div className="my-4 flex flex-col gap-4">
            {topMenuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`py-3 px-4 flex flex-row gap-2 ${
                  activePage === item.label
                    ? "bg-primary text-white fill-white"
                    : "hover:bg-gray-200"
                } justify-start items-center rounded-lg text-neutral-600`}
              >
                <item.icon className="w-6 h-6" />
                <p className="whitespace-nowrap test-xs">{item.label}</p>
              </Link>
            ))}
          </div>
          <hr className="border border-neutral-300" />

          {/* Bottom Menu Group */}
          <div className="mt-4 flex flex-col gap-4">
            {bottomMenuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`py-3 px-4 flex flex-row gap-2 ${
                  activePage === item.label &&
                  "bg-primary text-white fill-white"
                } hover:bg-blue-500 hover:text-white hover:fill-white justify-start items-center rounded-lg text-neutral-900`}
              >
                <item.icon className="w-6 h-6" />
                <p className="whitespace-nowrap test-xs">{item.label}</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <button
            
            onClick={logout}
            className="flex text-red-500 fill-red-500 items-center space-x-3 px-6 py-2 rounded-lg mt-32 mb-20"
          >
            <LogOut className="w-5 h-5 transform scale-x-[-1]" />
            <span className=" test-xs">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
export { topMenuItems, bottomMenuItems };
