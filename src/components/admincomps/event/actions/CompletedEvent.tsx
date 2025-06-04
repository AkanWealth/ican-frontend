import React, { useState } from "react";
import { MdSubtitles, MdCheckCircle } from "react-icons/md";
import { HiOutlineTag } from "react-icons/hi";

import apiClient from "@/services-admin/apiClient";

import { BASE_API_URL } from "@/utils/setter";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface CancelEventProps {
  id: string;
  eventName: string;
  date: string;
  onClose: () => void;
}

function CancelEvent({ id, eventName, date, onClose }: CancelEventProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleCancel = async () => {
    let data = JSON.stringify({
      status: "COMPLETED",
    });

    setIsLoading(true);
    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${BASE_API_URL}/events/${id}/status`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      withCredentials: true,
      data: data,
    };

    try {
      const response = await apiClient.request(config);
      toast({
        title: "Event Completed",
        description: "event completed successfully",
        variant: "default",
      });

      onClose(); // Close the modal after successful update
      setIsLoading(false);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "failed to cancel event",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col p-6 rounded-xl gap-6 bg-white max-w-md w-full mx-4">
        {/* Header with icon and title */}
        <div className="flex items-start gap-4">
          <div className="rounded-full p-3 bg-green-100">
            <MdCheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h5 className="font-semibold text-xl text-gray-900 mb-2">
              Mark as Completed
            </h5>
            <p className="text-sm text-gray-600 leading-relaxed">
              If you mark this event as completed, the event has been completed
              and members will be notified via email. Are you sure you want to
              proceed?
            </p>
          </div>
        </div>

        {/* Event details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <MdSubtitles className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Name:</span>
            <span className="text-sm font-medium text-gray-900">
              {eventName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <HiOutlineTag className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Date:</span>
            <span className="text-sm font-medium text-gray-900">
              {new Date(date).toLocaleDateString("en-GB")}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Marking as Completed..." : "Mark as Completed"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelEvent;
