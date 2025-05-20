import React from "react";
import {
  MdSubtitles,
  MdOutlineDateRange,
  MdDeleteOutline,
  MdOutlineMoney,
} from "react-icons/md";
import { HiOutlineTag } from "react-icons/hi";

import apiClient from "@/services-admin/apiClient";

import { BASE_API_URL } from "@/utils/setter";

import { useToast } from "@/hooks/use-toast";

import axios from "axios";

interface DeleteBillingProps {
  id: string;
  name: string;
  type: string;
  amount: string;
  createdAt: string;
  onClose: () => void;
}

function DeleteBilling({
  id,
  name,
  type,
  amount,
  createdAt,
  onClose,
}: DeleteBillingProps) {
  const { toast } = useToast();
  const token = localStorage.getItem("access_token");
  const handleDelete = async () => {
    console.log({ id, name, type, amount, createdAt });
    // Configure delete request
    const config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${BASE_API_URL}/billing/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    // Send delete request using try-catch
    try {
      const response = await apiClient.request(config);
      console.log("Delete successful:", response.data);
      toast({
        title: "Success",
        description: "Billing record deleted successfully",
        variant: "default",
      });
      window.location.reload();
      onClose(); // Close modal after successful deletion
    } catch (error) {
      console.error("Delete failed:", error);
      toast({
        title: "Error",
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || "Failed to delete billing record"
          : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col p-8 rounded-xl gap-4 bg-white w-[800px] max-w-[90%] max-h-[90vh] overflow-y-auto">
        <div className="flex flex-row justify-start gap-4">
          <div className="rounded-full  h-fit w-fit p-4 bg-red-200">
            <MdDeleteOutline className="w-6 h-6 fill-red-600" />
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <h5 className="font-semibold text-xl text-black">
                Delete Billing Record
              </h5>
              <p className="text-sm text-neutral-600">
                Are you sure you want to delete this billing record?
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex flex-row items-center gap-4">
                <p className="flex text-neutral-700 font-medium text-base flex-row  items-center gap-2">
                  <MdSubtitles className="w-4 h-4" /> Name:
                </p>
                <p className="text-black font-medium text-base ">{name}</p>
              </div>
              <div className="flex flex-row items-center gap-4">
                <p className="flex text-neutral-700 font-medium text-base   items-centerflex-row gap-2">
                  <HiOutlineTag className="w-4 h-4" /> Type:
                </p>
                <p className="text-black font-medium text-base ">{type}</p>
              </div>
              <div className="flex flex-row items-center gap-4">
                <p className="flex text-neutral-700 font-medium text-base   items-centerflex-row gap-2">
                  <MdOutlineMoney className="w-4 h-4" /> Amount:
                </p>
                <p className="text-black font-medium text-base ">{amount}</p>
              </div>
              <div className="flex flex-row items-center gap-4">
                <p className="flex text-neutral-700 font-medium text-base  items-center flex-row gap-2">
                  <MdOutlineDateRange className="w-4 h-4" /> Created At:
                </p>
                <p className="text-black font-medium text-base ">
                  {new Date(createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleDelete}
            className="flex items-center w-2/5 text-center justify-center bg-red-600 font-semibold text-base text-white rounded-full py-3 px-4 h-10"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex items-center w-2/5 text-center justify-center bg-transparent font-semibold text-base text-neutral-700 border border-primary rounded-full py-3 px-4 h-10"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteBilling;
