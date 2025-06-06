"use client";

import React, { useState } from "react";
import {
  MdSubtitles,
  MdOutlineDateRange,
  MdDeleteOutline,
} from "react-icons/md";
import { HiOutlineTag } from "react-icons/hi";

import apiClient from "@/services-admin/apiClient";

import { BASE_API_URL } from "@/utils/setter";

import { useToast } from "@/hooks/use-toast";

interface DeleteContentProps {
  id: string;
  title: string;
  category: string;
  contentCategory: string;
  date: string;
  onClose: () => void;
}

function DeleteContent({
  id,
  title,
  category,
  contentCategory,
  date,
  onClose,
}: DeleteContentProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const config = {
      method: "DELETE",
      maxBodyLength: Infinity,
      url: `${BASE_API_URL}/${
        contentCategory === "technical"
          ? "technical-sessions"
          : contentCategory === "resources"
          ? "resources/content"
          : contentCategory
      }/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    try {
      const response = await apiClient.request(config);
      console.log("Content deleted successfully:", response);
      toast({
        title: "Content Deleted",
        description: "The content has been successfully deleted.",
        variant: "default",
      });
      setIsLoading(false);

      onClose();
    } catch (error) {
      console.error("Error deleting:", error);
      toast({
        title: "Error Deleting Content",
        description: "There was an error while trying to delete the content.",
        variant: "destructive",
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col p-4 rounded-xl gap-4 bg-white">
        <div className="flex flex-row justify-start gap-4">
          <div className="rounded-full  h-fit w-fit p-4 bg-red-200">
            <MdDeleteOutline className="w-6 h-6 fill-red-600" />
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <h5 className="font-semibold text-xl text-black">
                Unpublish Content
              </h5>
              <p className="text-sm text-neutral-600">
                Are you sure you want to unpublish this content?
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex flex-row items-center gap-4">
                <p className="flex text-neutral-700 font-medium text-base flex-row  items-center gap-2">
                  <MdSubtitles className="w-4 h-4" /> Title:
                </p>
                <p className="text-black font-medium text-base ">{title}</p>
              </div>
              <div className="flex flex-row items-center gap-4">
                <p className="flex text-neutral-700 font-medium text-base  items-center flex-row gap-2">
                  <MdOutlineDateRange className="w-4 h-4" /> Date Published:
                </p>
                <p className="text-black font-medium text-base ">{date}</p>
              </div>
              <div className="flex flex-row items-center gap-4">
                <p className="flex text-neutral-700 font-medium text-base   items-centerflex-row gap-2">
                  <HiOutlineTag className="w-4 h-4" /> Category:
                </p>
                <p className="text-black font-medium text-base ">{category}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className={`flex items-center w-2/5 text-center justify-center ${
              isLoading ? "bg-red-400" : "bg-red-600"
            } font-semibold text-base text-white rounded-full py-3 px-4 h-10`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Delete"
            )}
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

export default DeleteContent;
