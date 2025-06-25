"use client";

import React, { useState, useEffect } from "react";
import { MdPublishedWithChanges, MdSubtitles } from "react-icons/md";
import { HiOutlineTag } from "react-icons/hi";
import { BASE_API_URL } from "@/utils/setter";

import InputEle from "@/components/genui/InputEle";

import { useToast } from "@/hooks/use-toast";
import apiClient from "@/services-admin/apiClient";

interface ChangeRoleProps {
  id: string;
  fullName: string;
  role: string;
  onClose: () => void;
}

interface RolesData {
  id: string;
  name: string;
  description: string | null;
  isSuperAdmin: boolean;
  createdAt: string;
  permissions: {
    id: string;
    roleId: string;
    permissionId: string;
  }[];
}
export interface FormData {
  roleId: string;
}
const initialFormData: FormData = {
  roleId: "",
};

function ChangeRole({ id, fullName, role, onClose }: ChangeRoleProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [roles, setRoles] = useState<RolesData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch roles on component mount using axios
  useEffect(() => {
    const fetchRoles = async () => {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/roles`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };

      try {
        const response = await apiClient.get("/roles", config);
        setRoles(response);

        toast({
          title: "Success",
          description: "Roles fetched successfully",
          variant: "default",
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        toast({
          title: "Error",
          description: "Failed to fetch roles",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, [toast]); // Empty dependency array means this runs once on mount

  const selectedRole = Array.isArray(roles)
    ? roles.find((role) => role.id === formData.roleId)
    : null;

  const handleConfirm = () => {
    console.log({ id, fullName, role });
    setIsLoading(true);
    async function enableUser() {
      const data = JSON.stringify({
        userId: id,
        roleId: formData.roleId,
      });
      console.log(data);
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/roles/assign`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json", // Fixed ContentType -> Content-Type
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          Cookie: localStorage.getItem("refreshToken"), // Added Cookie header
        },
        data: data,
      };
      try {
        const results = await apiClient.request(config);
        console.log(results);
        toast({
          title: "Admin demoted to member",
          description: "Admin demoted to member successfully",
          variant: "default",
          duration: 2000,
        });
        onClose();
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Error",
          description: error.response?.message || "An error occurred",
          variant: "destructive",
          duration: 2000,
        });
      }
    }
    enableUser();
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col p-4 rounded-xl gap-4 bg-white">
        <div className="flex flex-row justify-start gap-4">
          <div className="rounded-full  h-fit w-fit p-4 bg-green-200">
            <MdPublishedWithChanges className="w-6 h-6 fill-green-400" />
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <h5 className="font-semibold text-xl text-black">
                Change Admin Role
              </h5>
              <p className="text-sm text-neutral-600">
                Are you sure you want to change this admins role?
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex flex-row items-center gap-4">
                <p className="flex text-neutral-700 font-medium text-base flex-row  items-center gap-2">
                  <MdSubtitles className="w-4 h-4" /> Name:
                </p>
                <p className="text-black font-medium text-base ">{fullName}</p>
              </div>

              <div className="flex flex-row items-center gap-4">
                <p className="flex text-neutral-700 font-medium text-base   items-centerflex-row gap-2">
                  <HiOutlineTag className="w-4 h-4" /> Current Role:
                </p>
                <p className="text-black font-medium text-base ">
                  {role
                    .replace(/[_-]/g, " ")
                    .replace(/^([a-zA-Z])/, (l) => l.toUpperCase())}
                </p>
              </div>

              <InputEle
                label="Select New Role"
                type="select"
                id="roleId"
                value={formData.roleId}
                options={[
                  { value: "", label: "Select Role" },
                  ...roles.map((role) => ({
                    value: role.id,
                    // Convert role name to sentence case after replacing underscores/hyphens with spaces
                    label: (() => {
                      const name = role.name.replace(/[_-]/g, " ");
                      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
                    })(),
                  })),
                ]}
                onChange={(e) =>
                  setFormData({ ...formData, roleId: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleConfirm}
            className="flex items-center w-2/5 text-center justify-center bg-primary font-semibold text-base text-white rounded-full py-3 px-4 h-10"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Confirm"
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

export default ChangeRole;
