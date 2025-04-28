"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

import { User } from "@/libs/types";
import { useToast } from "@/hooks/use-toast";
import { handleUnauthorizedRequest } from "@/utils/refresh_token";

function AdminDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { toast } = useToast();
  const [adminData, setAdminData] = useState<User>();

  useEffect(() => {
    async function fetchAdminData() {
      const id = (await params).id;

      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/users/${id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };
      try {
        const result = await axios.request(config);

        setAdminData(result.data);

        toast({
          title: "Success",
          description: "User details fetched successfully",
          variant: "default",
        });
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 401
        ) {
          await handleUnauthorizedRequest(config, router, setAdminData);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch user activities data.",
            variant: "destructive",
          });
        }
      }
    }

    fetchAdminData();
  }, [params, router, toast]);

  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h2 className="font-semibol text-2xl text-black">Manage Roles </h2>
          <p className=" text-base text-neutral-600  ">Create new role here</p>
        </div>
        <div className="flex flex-row items-center gap-4 justify-end"></div>
      </div>
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <div className="grid grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-6">
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              <span className="text-base text-black font-medium">
                User Name
              </span>
              <span className="text-base text-black font-medium">
                {adminData?.firstname || "N/A"}
              </span>
            </p>

            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              <span className="text-base text-black font-medium">Email</span>
              <span className="text-base text-black font-medium">
                {adminData?.email || "N/A"}
              </span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Role Name
              <span className="text-base text-black font-medium">
                {adminData?.role?.name || "N/A"}
              </span>
            </p>
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Role Description
              <span className="text-base text-black font-medium">
                {adminData?.role?.description || "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDetails;
