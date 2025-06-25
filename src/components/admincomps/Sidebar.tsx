"use client";
import React, { useContext } from "react";
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
import { TbCurrencyNaira } from "react-icons/tb";
import { IoMdCalendar } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { logout } from "@/lib/auth";
import { AuthContext } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";

// Permission IDs
const PERMISSIONS = {
  ADMIN_MANAGEMENT: "299243fa-a5e1-4945-9786-ae6817a0493a",
  MEMBERS_MANAGEMENT: "89bac9c8-b107-4ced-800a-15429684157f",
  CONTENT_MANAGEMENT: "b3b82851-91f7-4f30-8b35-ea391f43d868",
  EVENT_MANAGEMENT: "abfc07a9-9c65-49c6-8767-f46a0a621806",
  BILLING_PAYMENT: "80bf8302-3c25-407f-9e68-e15b23d833c9",
};

// Export the full list of possible top menu items (with permission keys)
export const topMenuItems = [
  { icon: MdHome, label: "Dashboard", href: "/admin" },
  {
    icon: MdOutlinePeopleAlt,
    label: "Admin Management",
    href: "/admin/admins",
    permission: PERMISSIONS.ADMIN_MANAGEMENT,
  },
  {
    icon: MdOutlinePeopleAlt,
    label: "Members Management",
    href: "/admin/members",
    permission: PERMISSIONS.MEMBERS_MANAGEMENT,
  },
  {
    icon: MdCollectionsBookmark,
    label: "Content Management",
    href: "/admin/content",
    permission: PERMISSIONS.CONTENT_MANAGEMENT,
  },
  {
    icon: IoMdCalendar,
    label: "Event Management",
    href: "/admin/events",
    permission: PERMISSIONS.EVENT_MANAGEMENT,
  },
  {
    icon: TbCurrencyNaira,
    label: "Payment Management",
    href: "/admin/payment",
    permission: PERMISSIONS.BILLING_PAYMENT,
  },
  {
    icon: MdOutlineAnalytics,
    label: "Billings",
    href: "/admin/billing",
    permission: PERMISSIONS.BILLING_PAYMENT,
  },
];

// Export the bottom menu items (always visible)
export const bottomMenuItems = [
  { icon: MdOutlinePerson, label: "Profile", href: "/admin/profile" },
  { icon: MdOutlineSettings, label: "Settings", href: "/admin/settings" },
];

function Sidebar() {
  const pathname = usePathname();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }
  let { hasPermission, userPermissions } = authContext;

  // Fallback: If userPermissions is empty, try to get from localStorage
  if (!userPermissions || userPermissions.length === 0) {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userPermissions");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            userPermissions = parsed;
            // Optionally, you can redefine hasPermission to use this array
            hasPermission = (permId: string) => parsed.includes(permId);
          }
        } catch (e) {
          // Optionally log or handle parse error
          console.error("Failed to parse userPermissions from localStorage", e);
        }
      }
    }
  }

  // Precompute permission-based menu items before assigning to menuItems for clarity and maintainability.
  const permissionMenuItems = [
    hasPermission(PERMISSIONS.ADMIN_MANAGEMENT)
      ? {
          icon: MdOutlinePeopleAlt,
          label: "Admin Management",
          href: "/admin/admins",
        }
      : null,
    hasPermission(PERMISSIONS.MEMBERS_MANAGEMENT)
      ? {
          icon: MdOutlinePeopleAlt,
          label: "Members Management",
          href: "/admin/members",
        }
      : null,
    hasPermission(PERMISSIONS.CONTENT_MANAGEMENT)
      ? {
          icon: MdCollectionsBookmark,
          label: "Content Management",
          href: "/admin/content",
        }
      : null,
    hasPermission(PERMISSIONS.EVENT_MANAGEMENT)
      ? {
          icon: IoMdCalendar,
          label: "Event Management",
          href: "/admin/events",
        }
      : null,
    hasPermission(PERMISSIONS.BILLING_PAYMENT)
      ? {
          icon: TbCurrencyNaira,
          label: "Payment Management",
          href: "/admin/payment",
        }
      : null,
    hasPermission(PERMISSIONS.BILLING_PAYMENT)
      ? {
          icon: MdOutlineAnalytics,
          label: "Billings",
          href: "/admin/billing",
        }
      : null,
  ].filter(Boolean);

  const menuItems = [
    { icon: MdHome, label: "Dashboard", href: "/admin" },
    ...permissionMenuItems,
  ].filter(Boolean);

  // Log the permissionMenuItems before filtering
  console.log("[Sidebar] Raw permissionMenuItems (before filter):", [
    hasPermission(PERMISSIONS.ADMIN_MANAGEMENT)
      ? {
          icon: MdOutlinePeopleAlt,
          label: "Admin Management",
          href: "/admin/admins",
        }
      : null,
    hasPermission(PERMISSIONS.MEMBERS_MANAGEMENT)
      ? {
          icon: MdOutlinePeopleAlt,
          label: "Members Management",
          href: "/admin/members",
        }
      : null,
    hasPermission(PERMISSIONS.CONTENT_MANAGEMENT)
      ? {
          icon: MdCollectionsBookmark,
          label: "Content Management",
          href: "/admin/content",
        }
      : null,
    hasPermission(PERMISSIONS.EVENT_MANAGEMENT)
      ? {
          icon: IoMdCalendar,
          label: "Event Management",
          href: "/admin/events",
        }
      : null,
    hasPermission(PERMISSIONS.BILLING_PAYMENT)
      ? {
          icon: TbCurrencyNaira,
          label: "Payment Management",
          href: "/admin/payment",
        }
      : null,
    hasPermission(PERMISSIONS.BILLING_PAYMENT)
      ? {
          icon: MdOutlineAnalytics,
          label: "Billings",
          href: "/admin/billing",
        }
      : null,
  ]);

  // Log the filtered permissionMenuItems
  console.log("[Sidebar] Filtered permissionMenuItems:", permissionMenuItems);

  // Log the final menuItems array
  console.log("[Sidebar] Final menuItems:", menuItems);

  const bottomMenuItems = [
    { icon: MdOutlinePerson, label: "Profile", href: "/admin/profile" },
    { icon: MdOutlineSettings, label: "Settings", href: "/admin/settings" },
  ];

  // Helper to find a menu item by pathname
  /**
   * Finds a menu item (from either menuItems or bottomMenuItems) by pathname.
   * Handles the case where menuItems may contain boolean values due to conditional entries.
   *
   * @param pathname - The path to search for.
   * @returns The matching menu item object, or undefined if not found.
   */
  const findMenuItem = (pathname: string) => {
    // Type guard to ensure item is not false
    const isMenuItem = (
      item: (typeof menuItems)[number] | false
    ): item is Exclude<(typeof menuItems)[number], false> => Boolean(item);

    return (
      menuItems.find((item) => item && item.href === pathname) ||
      bottomMenuItems.find((item) => item.href === pathname)
    );
  };
  const item = pathname ? findMenuItem(pathname) : null;

  const activePage = item?.label;

  return (
    <aside className="h-full w-fit bg-white no-scrollbar text-black border-r flex flex-col justify-between p-4">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 py-12 border-b border-gray-200">
        <Image alt="Logo" width={200} height={80} src="/Logo_big.png" />
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col h-full justify-between">
        {/* Top Menu Group */}
        <div className="flex flex-col py-12">
          <div className="my-4 flex flex-col gap-4">
            {menuItems.filter(Boolean).map((item, index) => {
              const menuItem = item as {
                icon: React.ElementType;
                label: string;
                href: string;
              };
              return (
                <Link
                  key={index}
                  href={menuItem.href}
                  className={`py-3 px-4 flex flex-row gap-2 ${
                    activePage === menuItem.label
                      ? "bg-primary text-white fill-white"
                      : "hover:bg-gray-200"
                  } justify-start items-center rounded-lg text-neutral-600`}
                >
                  <menuItem.icon className="w-6 h-6" />
                  <p className="whitespace-nowrap test-xs">{menuItem.label}</p>
                </Link>
              );
            })}
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
                } hover:bg-gray-200  justify-start items-center rounded-lg text-neutral-900`}
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
            className="flex w-full text-red-500 fill-red-500 items-center space-x-3 px-6 py-2 rounded-lg hover:bg-red-100 hover:text-red-600 hover:fill-red-600"
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
export { AuthContext };
