"use client";

import React, { useState, useEffect } from "react";

import apiClient from "@/services-admin/apiClient";

import { BASE_API_URL } from "@/utils/setter";
import { useToast } from "@/hooks/use-toast";

import InputEle from "@/components/genui/InputEle";

import { User } from "@/libs/types";

// Props interface for CreateNewAdmin component
interface CreateNewAdminProps {
  id?: any;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}
// Form data interface
export interface FormData {
  userId: string;
  roleId: string;
}

// Initial form state
const initialFormData: FormData = {
  userId: "",
  roleId: "",
};

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

function CreateNewAdmin({ showModal, setShowModal }: CreateNewAdminProps) {
  // Component implementation
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  // State to store roles
  const [roles, setRoles] = useState<RolesData[]>([]);
  // State to store users
  const [users, setUsers] = useState<User[]>([]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle modal close
  const onClose = () => {
    // Reset form data to initial state
    setFormData(initialFormData);
    // Reset loading state
    setIsLoading(false);
    setShowModal(false);
  };

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
  useEffect(() => {
    const fetchUsers = async () => {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/users/users`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };

      try {
        const response = await apiClient.get("/users/users", config);

        // Update roles state with fetched data
        setUsers(response.data.data);
        console.log(response.data.data);
        toast({
          title: "Success",
          description: "Users fetched successfully",
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

    fetchUsers();
  }, [toast]); // Empty dependency array means this runs once on mount

  const selectedUser = Array.isArray(users)
    ? users.find((user) => user.id === formData.userId)
    : null;
  const selectedRole = Array.isArray(roles)
    ? roles.find((role) => role.id === formData.roleId)
    : null;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.post(
        `${BASE_API_URL}/roles/assign`,
        formData
      );

        

      toast({
        title: "Success",
        description: "Administrator created successfully",
        variant: "default",
      });

      onClose();
      setFormData(initialFormData);
    } catch (error) {
      // Show error message
      toast({
        title: "Error",
        description: "Failed to create administrator",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          // Close modal when clicking outside
          onClose();
        }
      }}
    >
      <div className="bg-white p-8 rounded-lg w-[500px]">
        <h2 className="text-2xl font-semibold mb-6">
          Create New Administrator
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-base text-black font-medium">
            Name: {selectedUser?.firstname} {selectedUser?.surname}
            <br />
            Email: {selectedUser?.email}
            <br />
            Current Role: {selectedUser?.role.name.replace(/[_-]/g, " ")}
            <br />
            New Role: {selectedRole?.name.replace(/[_-]/g, " ")}
          </p>

          <InputEle
            label="User"
            type="select"
            id="userId"
            value={formData.userId}
            options={
              Array.isArray(users)
                ? [
                    { value: "", label: "Select User" },
                    ...users.map((user) => ({
                      value: user.id,
                      label: `${user.firstname} ${user.surname}`,
                    })),
                  ]
                : [{ value: "", label: "Select User" }]
            }
            onChange={(e) =>
              setFormData({ ...formData, userId: e.target.value })
            }
          />
          <InputEle
            label="Role Type"
            type="select"
            id="roleId"
            value={formData.roleId}
            options={[
              { value: "", label: "Select Role" },
              ...roles.map((role) => ({
                value: role.id,
                label: role.name.replace(/[_-]/g, " "),
              })),
            ]}
            onChange={(e) =>
              setFormData({ ...formData, roleId: e.target.value })
            }
          />

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateNewAdmin;
