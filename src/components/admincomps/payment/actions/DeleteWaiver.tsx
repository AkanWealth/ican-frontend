import React, { useState } from "react";
import { MdSubtitles, MdDeleteOutline } from "react-icons/md";
import { HiOutlineTag } from "react-icons/hi";
import apiClient from "@/services-admin/apiClient";
import { BASE_API_URL } from "@/utils/setter";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface DeleteWaiverProps {
  id: string;
  code: string;
  billName: string;
  amount: string;
  createdAt: string;
  onClose: () => void;
}

function DeleteWaiver({
  id,
  code,
  billName,
  amount,
  createdAt,
  onClose,
}: DeleteWaiverProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    const config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${BASE_API_URL}/payments/waivers/${id}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };

    try {
      await apiClient.delete(`/payments/waivers/${id}`, config);
      toast({
        title: "Success",
        description: "Waiver deleted successfully.",
      });
      router.refresh();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete waiver.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col p-6 rounded-xl gap-6 bg-white max-w-md w-full mx-4">
        {/* Header with icon and title */}
        <div className="flex items-start gap-4">
          <div className="rounded-full p-3 bg-red-100">
            <MdDeleteOutline className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h5 className="font-semibold text-xl text-gray-900 mb-2">
              Delete Waiver
            </h5>
            <p className="text-sm text-gray-600 leading-relaxed">
              Are you sure you want to delete this waiver? This action cannot be
              undone.
            </p>
          </div>
        </div>

        {/* Waiver details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <MdSubtitles className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Code:</span>
            <span className="text-sm font-medium text-gray-900">{code}</span>
          </div>
          <div className="flex items-center gap-3">
            <HiOutlineTag className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Bill Name:</span>
            <span className="text-sm font-medium text-gray-900">
              {billName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <HiOutlineTag className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Amount:</span>
            <span className="text-sm font-medium text-gray-900">{amount}</span>
          </div>
          <div className="flex items-center gap-3">
            <HiOutlineTag className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Created:</span>
            <span className="text-sm font-medium text-gray-900">
              {new Date(createdAt).toLocaleDateString("en-GB")}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteWaiver;
