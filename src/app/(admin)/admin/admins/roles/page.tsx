"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import RoleManager from "@/components/admincomps/admin/Rolemanager";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

import { RolesData } from "@/libs/types";

type parsedRolesType = {
  id: string;
  name: string;
  description: string | null;
  isSuperAdmin: boolean;
};

function RolesPage() {
  const [showModal, setShowModal] = useState<boolean>(false);
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
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      };

      try {
        // Fetch roles
        const response = await axios.request(config);

        if (response.status === 200) {
          setRoles(response.data);
        }
      } catch (error) {

        // Handle error


        console.error("Failed to fetch roles:", error);
        Toast({
          type: "error",
          message: "Failed to fetch roles",
        });
      }
    };

    fetchRolesAndPermissions();
  }, []); // Only run once on mount

  // Parse roles data to extract required fields

  return (
    <div className="rounded-3xl bg-white p-6">
      <div className="flex flex-row justify-between py-4 items-center">
        <h2 className="text-lg font-semibold">Roles and Permissions</h2>
        <button
          onClick={() => {
            setShowModal(true);
          }}
          className="bg-blue-600 text-white rounded-md px-4 py-2"
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
            <AccordionContent>
              <p>Description: {role.description}</p>
              <p>Is Super Admin: {role.isSuperAdmin ? "Yes" : "No"}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {showModal && (
        <RoleManager showModal={showModal} setShowModal={setShowModal} />
      )}
    </div>
  );
}

export default RolesPage;
