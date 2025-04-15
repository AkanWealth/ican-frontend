"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import RoleManager from "@/components/admincomps/admin/Rolemanager";
import Toast from "@/components/genui/Toast";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

import { RolesData } from "@/libs/types";

type parsedRolesType = {
  id: string;
  name: string;
  description: string | null;
  isSuperAdmin: boolean;
  permissions: string[];
};

function RolesPage() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [roles, setRoles] = useState<RolesData[]>([]); // Update state type to RolesData[]
  const [parsedRoles, setParsedRoles] = useState<parsedRolesType[]>([]); // State to store parsed roles
  const [isLoading, setIsLoading] = useState(false); // Loading state

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

          // Map basic role data
          const basicRoleData = response.data.map((role: RolesData) => ({
            id: role.id,
            name: role.name,
            description: role.description,
            isSuperAdmin: role.isSuperAdmin,
            permissions: [],
          }));

          // Fetch permissions for each role
          const rolesWithPermissions = await Promise.all(
            basicRoleData.map(async (role: RolesData) => {
              try {
                const permResponse = await axios.get(
                  `${BASE_API_URL}/roles/${role.id}/permissions`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem(
                        "access_token"
                      )}`,
                    },
                  }
                );

                return {
                  ...role,
                  permissions: permResponse.data.permissions,
                };
              } catch (error) {
                console.error(
                  `Failed to fetch permissions for role ${role.name}:`,
                  error
                );
                Toast({
                  type: "error",
                  message: `Failed to fetch permissions for role ${role.name}`,
                });
                return role;
              }
            })
          );

          setParsedRoles(rolesWithPermissions);
        }
      } catch (error) {
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
        <button className="bg-blue-600 text-white rounded-md px-4 py-2">
          Create a New Role
        </button>
      </div>
      <hr />
      <Accordion type="single" collapsible className="w-full">
        {parsedRoles.map((role) => (
          <AccordionItem key={role.id} value={`item-${role.id}`}>
            <AccordionTrigger>
              {role.name.replace(/[_-]/g, " ")}
            </AccordionTrigger>
            <AccordionContent>
              <p>Description: {role.description}</p>
              <div className="flex flex-row justify-between items-center">
                <p>Role ID: {role.id}</p>
                <p>Total Permissions: {role.permissions.length}</p>
              </div>
              <p>Is Super Admin: {role.isSuperAdmin ? "Yes" : "No"}</p>
              <p>
                Permissions: {role.permissions.join(", ").replace(/[_-]/g, " ")}
              </p>
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
