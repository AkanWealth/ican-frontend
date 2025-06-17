"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { UserTable } from "@/components/admincomps/user/datatable/UserTable";
import { adminscolumns } from "@/components/admincomps/user/datatable/columns";
import { User } from "@/libs/types";

import { AuthProvider } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";
import { AdminProtectedRoute } from "@/app/(admin)/admin/LoginAuthentication/AdminProtectedRoute";

import apiClient from "@/services-admin/apiClient";
import { BASE_API_URL } from "@/utils/setter";

import CreateNewAdmin from "@/components/admincomps/admin/CreateNewAdmin";

import { useToast } from "@/hooks/use-toast";
import ExportMembers from "@/components/admincomps/user/export/ExportMembers";

function AdminManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/users/users`,
      };
      try {
        const result = await apiClient.get("/users/users", config);
        // Filter out users with role.name === "MEMBER"
        const filteredData = result.data.filter(
          (user: User) => user.role.name !== "MEMBER"
        );
        setData(filteredData);
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
    fetchData();
  }, [router, toast]);

  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="font-semibol text-2xl text-black">
            All Administrators
          </h2>
          <p>View and manage all admins details here</p>
        </div>
        <div className="flex flex-row items-center gap-4 justify-end">
          <button
            onClick={() => router.push("admins/roles")}
            className="rounded-full py-2 px-3 bg-transparent text-primary border-primary text-base w-fit"
          >
            Manage Roles
          </button>
          <button
            onClick={() => setShowModal(true)}
            className=" py-2 px-3 text-white bg-primary  text-base rounded-full w-fit"
          >
            Add Administrator
          </button>
        </div>
      </div>
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-xl font-semibold text-left">Administrators</h2>
          <ExportMembers members={data} />
        </div>
        <div>
          <UserTable columns={adminscolumns} data={data} />
        </div>
      </div>
      {showModal && (
        <CreateNewAdmin setShowModal={setShowModal} showModal={showModal} />
      )}
    </div>
  );
}

export default function PackedAdminManagementPage() {
  return (
    <AuthProvider>
      <AdminProtectedRoute>
        <AdminManagementPage />
      </AdminProtectedRoute>
    </AuthProvider>
  );
}
