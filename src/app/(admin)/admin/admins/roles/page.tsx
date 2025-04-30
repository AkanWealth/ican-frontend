"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import RoleManager from "@/components/admincomps/admin/Rolemanager";

import { AuthProvider } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";
import { AdminProtectedRoute } from "@/app/(admin)/admin/LoginAuthentication/AdminProtectedRoute";

import apiClient from "@/services-admin/apiClient";

import EditRole from "@/components/admincomps/admin/EditRole";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { handleUnauthorizedRequest } from "@/utils/refresh_token";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

import { RolesData } from "@/libs/types";

import { Pencil } from "lucide-react";
import { MdArrowBack } from "react-icons/md";
type parsedRolesType = {
  id: string;
  name: string;
  description: string | null;
  isSuperAdmin: boolean;
};

function RolesPage() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<RolesData | null>(null);
  const [roles, setRoles] = useState<RolesData[]>([]); // Update state type to RolesData[]
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const { toast } = useToast();
  const router = useRouter(); // Router instance

  // Fetch roles and parse permissions on component mount
  useEffect(() => {
    const fetchRolesAndPermissions = async () => {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/roles`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };

      try {
        // Fetch roles
        const response = await apiClient.get("/roles", config);
        setRoles(response);
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    };

    fetchRolesAndPermissions();
  }, [router, toast]); // Include router and toast as dependencies

  // Parse roles data to extract required fields

  return (
    <div className="rounded-3xl bg-white p-6">
      <div className="flex flex-row justify-between py-4 items-center">
        {" "}
        <button
          onClick={() => router.back()}
          className="flex flex-row items-center gap-2 text-primary"
        >
          <MdArrowBack className="w-6 h-6" /> Back
        </button>
        <h2 className="text-lg font-semibold">Roles and Permissions</h2>
        <button
          onClick={() => {
            setShowModal(true);
          }}
          className="bg-primary text-base font-semibold text-white rounded-md px-4 py-2"
        >
          Create a New Role
        </button>
      </div>
      <hr />
      <Accordion type="single" collapsible className="w-full">
        {roles.map((role) => (
          <AccordionItem key={role.id} value={`item-${role.id}`}>
            <AccordionTrigger>
              {role.name.replace(/[_-]/g, " ")}
            </AccordionTrigger>
            <AccordionContent className="flex flex-row justify-between items-start">
              <div>
                <p>Description: {role.description}</p>
                <p>Super Admin: {role.isSuperAdmin ? "Yes" : "No"}</p>
              </div>
              <button
                onClick={() => {
                  setActiveRole(role);
                  setShowEditModal(true);
                }}
                className="bg-primary flex flex-row gap-1 items-center h-fit w-fit text-base text-white rounded-md  p-2"
              >
                <Pencil /> Edit
              </button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {showModal && (
        <RoleManager showModal={showModal} setShowModal={setShowModal} />
      )}
      {showEditModal && (
        <EditRole
          id={activeRole?.id}
          showModal={showEditModal}
          setShowModal={setShowEditModal}
        />
      )}
    </div>
  );
}

export default function PackedRolesPage() {
  return (
    <AuthProvider>
      <AdminProtectedRoute>
        <RolesPage />
      </AdminProtectedRoute>
    </AuthProvider>
  );
}
