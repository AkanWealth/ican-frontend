"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import InputEle from "@/components/genui/InputEle";

import { AuthProvider } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";
import { AdminProtectedRoute } from "@/app/(admin)/admin/LoginAuthentication/AdminProtectedRoute";

import { BASE_API_URL } from "@/utils/setter";

import apiClient from "@/services-admin/apiClient";

import { User } from "@/libs/types";

import { useToast } from "@/hooks/use-toast";

function Profile() {
  const { toast } = useToast();
  const [adminDetails, setAdminDetails] = useState({
    email: "",
    id: "",
    role: "",
  });
  const [admin, setAdmin] = useState<User>({} as User);

  // Function to fetch admin details from API - memoized with useCallback
  const fetchAdminDetails = useCallback(
    async (userId: string) => {
      try {
        const response = await apiClient.get(`${BASE_API_URL}/users/${userId}`);

        setAdmin((prevAdmin) => ({
          ...prevAdmin,
          ...response,
        }));

        toast({
          title: "Success",
          description: "Admin details fetched successfully",
          variant: "default",
        });
      } catch (error) {
        console.error("Error fetching admin details:", error);
        toast({
          title: "Error",
          description: "Failed to fetch admin details",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  // Effect to get admin data from cookie and fetch details
  useEffect(() => {
    const storedAdmin = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_data="))
      ?.split("=")[1];

    if (storedAdmin) {
      try {
        const decodedAdmin = decodeURIComponent(storedAdmin);
        const parsedAdmin = JSON.parse(decodedAdmin);
        setAdminDetails(parsedAdmin);

        if (parsedAdmin.id) {
          fetchAdminDetails(parsedAdmin.id);
        }
      } catch (error) {
        console.error("Error parsing admin data from cookie:", error);
      }
    }
  }, [fetchAdminDetails, toast]); // Run once on mount

  const handleSaveChanges = async () => {
    // Implement save changes logic here

    const config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${BASE_API_URL}/users/profile`,
      headers: {
        "Content-Type": "application/json",
      },
      data: admin,
    };

    try {
      const result = await apiClient.request(config);
      console.log(result);
      toast({
        title: "Admin details saved successfully",
        description: "Admin details saved successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving admin details:", error);
      toast({
        title: "Error saving admin details",
        description: "Error saving admin details",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-col mb-6 w-full items-start justify-between">
        <div className="flex flex-col gap-3"></div>
        <h2 className="font-semibold text-2xl text-black">Profile</h2>
        <p>Update and Manage your Profile here</p>
      </div>
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">Admin Profile</h2>
        <hr className="w-full" />
        <div>
          <div className="mx-auto flex flex-col items-center gap-2">
            {/* <Image src="./img.png" width={50} height={50}  alt="Profile img" /> */}
            <h5 className="flex flex-col items-center text-center text-black text-xl font-medium">
              {admin.firstname} {admin.surname}
              <span className="text-xs text-neutral-400">
                {admin?.role?.name}
              </span>
            </h5>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <h5 className="text-base w-full border-b border-gray-600 text-neutral-900">
              Admin Details
            </h5>
            <div className="grid grid-cols-2  gap-4 ">
              <InputEle
                id="first_name"
                label="First Name"
                type="text"
                placeholder="First Name"
                value={admin.firstname}
                onChange={(e) =>
                  setAdmin({ ...admin, firstname: e.target.value })
                }
              />
              <InputEle
                id="last_name"
                label="Last Name"
                type="text"
                placeholder="Last Name"
                value={admin.surname}
                onChange={(e) =>
                  setAdmin({ ...admin, surname: e.target.value })
                }
              />
              <InputEle
                id="email"
                label="Email"
                type="email"
                placeholder="Email"
                value={admin.email}
                onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
              />
              <InputEle
                id="membershipId"
                label="Membership ID"
                type="text"
                placeholder="Membership ID"
                value={admin.membershipId}
                disabled
                onChange={(e) =>
                  setAdmin({ ...admin, membershipId: e.target.value })
                }
              />
              <InputEle
                id="role"
                label="Role"
                type="text"
                placeholder="Role"
                value={admin?.role?.name}
                disabled
                onChange={(e) => {
                  const updatedRole = { ...admin.role, name: e.target.value };
                  setAdmin({ ...admin, role: updatedRole });
                }}
              />
            </div>
            <div className="flex w-full justify-center items-center flex-row gap-4">
              <button
                className="px-4 py-2 bg-primary text-white rounded-md"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PackedProfile() {
  return (
    <AuthProvider>
      <AdminProtectedRoute>
        <Profile />
      </AdminProtectedRoute>
    </AuthProvider>
  );
}
