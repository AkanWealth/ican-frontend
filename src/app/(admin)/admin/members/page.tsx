"use client";

import React, { useState, useEffect } from "react";

import apiClient from "@/services-admin/apiClient";
import { useToast } from "@/hooks/use-toast";

import { UserTable } from "@/components/admincomps/user/datatable/UserTable";
import { memberscolumns } from "@/components/admincomps/user/datatable/columns";
import { User } from "@/libs/types";
import { BASE_API_URL } from "@/utils/setter";
import { AuthProvider } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";
import { AdminProtectedRoute } from "@/app/(admin)/admin/LoginAuthentication/AdminProtectedRoute";

function MembersPage() {
  const [data, setData] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/users/users`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };
      try {
        const result = await apiClient.request(config);

        setData(result.data);
   
      } catch (error) {
        toast({
          title: "Error fetching members data!",
          description: "Error fetching members data!",
          variant: "destructive",
        });
      }
    }
    fetchData();
  }, [toast]);

  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="font-semibol text-2xl text-black">
            Member&apos;s Account
          </h2>
          <p>Manage user details here</p>
        </div>
      </div>

      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">All Members</h2>
        <div>
          <UserTable columns={memberscolumns} data={data} />
        </div>
      </div>
    </div>
  );
}

export default function PackedMembersPage() {
  return (
    <AuthProvider>
      <AdminProtectedRoute>
        <MembersPage />
      </AdminProtectedRoute>
    </AuthProvider>
  );
}
