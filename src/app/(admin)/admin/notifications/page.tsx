"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";
import { BellIcon } from "lucide-react";

import NewNotification from "@/components/admincomps/notifications/NewNotification";

import { AuthProvider } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";
import { AdminProtectedRoute } from "@/app/(admin)/admin/LoginAuthentication/AdminProtectedRoute";

function NotificationPage() {
  const router = useRouter();

  return (
    <div className="rounded-3xl p-6 max-w-5xl mx-auto">
      <div className="flex flex-col mb-6 w-full items-start justify-start">
        <button
          className="text-gray-500 text-base flex flex-row gap-2 font-semibold w-fit my-2 h-fit hover:text-gray-700 transition-colors"
          onClick={() => router.back()}
        >
          <MdArrowBack className="w-6 h-6" />
          Back
        </button>
        <div className="flex items-center gap-3 mt-2">
          <div className="p-2 bg-blue-100 rounded-full">
            <BellIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-2xl text-black">
              Create Notification
            </h2>
            <p className="text-gray-600">
              Send notifications to users and administrators
            </p>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="rounded-3xl p-6 border border-neutral-200 bg-white shadow-sm">
        <div className="mb-4 pb-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold">New Notification</h3>
          <p className="text-sm text-gray-500">
            Complete the form below to create and send a new notification
          </p>
        </div>

        {/* Display NewNotification component directly */}
        <NewNotification />
      </div>
    </div>
  );
}

export default function PackedNotificationPage() {
  return (
    <AuthProvider>
      <AdminProtectedRoute>
        <NotificationPage />
      </AdminProtectedRoute>
    </AuthProvider>
  );
}
