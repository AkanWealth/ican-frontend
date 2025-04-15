"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

import { User } from "@/libs/types";

function AdminDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [adminData, setAdminData] = useState<User>([]);
  const [permissions, setPermissions] = useState<any>([]);

  useEffect(() => {
    async function fetchAdminData() {
      const id = params.id;

      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/users/${id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      };
      try {
        const result = await axios.request(config);
        if (result.status === 200) {
          setAdminData(result.data);
          setPermissions(result.data.permissions);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        // Handle error appropriately, e.g. show error message to user
      } finally {
        // Any cleanup code if needed
      }
    }

    fetchAdminData();
  });

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
          <p className=" text-sm text-neutral-600 flex flex-col gap-1">
            Role Name
            <span className="text-base text-black font-medium">Admin</span>
          </p>
          <p className=" text-sm text-neutral-600 flex flex-col gap-1">
            Role Description
            <span className="text-base text-black font-medium">Admin</span>
          </p>
        </div>
        <p className=" text-sm text-neutral-600 flex flex-col gap-1">
          Permissions
          <span className="text-base text-black font-medium">
            {permissions.join(", ")}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AdminDetails;
