"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack, MdDelete } from "react-icons/md";
import { BellIcon } from "lucide-react";
import { PlusIcon } from "lucide-react";


import NewNotification from "@/components/admincomps/notifications/NewNotification";

function NotificationPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);  
  const [notifications, setNotifications] = useState([
    {
      header: "Admin Created",
      message: "A new admin has been created",
      date: "2 minutes ago",
    },
  ]);

  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-col mb-6 w-full items-start justify-start">
        <button
          className="text-gray-500 text-base flex flex-row gap-2  font-semibold w-fit my-2 h-fit"
          onClick={() => router.back()}
        >
          <MdArrowBack className="w-6 h-6 " />
          Back
        </button>
        <h2 className="font-semibol text-2xl text-black">Notifications</h2>
        <p>Update and Manage your Profile here</p>
      </div>
      {/* Tab sections */}
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-xl w-full font-semibold text-left border-b border-gray-500 ">
            Notifications
            </h2>
            <button className="bg-blue-500 text-white rounded-md px-4 py-2" onClick={() => setIsOpen(true)}>
            <PlusIcon className="w-4 h-4" />
            New Notification
          </button>
        </div>
        <div>
          {notifications.length > 0
            ? notifications.slice(0, 4).map((notification, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="flex flex-row items-center justify-start gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <BellIcon className="w-4 h-4 " />
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <h5 className="text-sm text-black font-medium">
                        {notification.header}
                      </h5>
                      <p className="text-xs text-neutral-600">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex-row items-end flex gap-2">
                    <p className="text-xs text-neutral-600">
                      {notification.date}
                    </p>
                    <button className="text-blue-500 text-xs">
                      View details
                    </button>
                    <button>
                      {" "}
                      <MdDelete className="w-4 text-red-500 h-4 " />
                    </button>
                  </div>
                </div>
              ))
            : "p0"}
        </div>
      </div>
      {isOpen && <NewNotification />}
    </div>
  );
}

export default NotificationPage;
