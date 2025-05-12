"use client";

import React, { useState, useEffect } from "react";

import apiClient from "@/services-admin/apiClient";

import { BASE_API_URL } from "@/utils/setter";
import { useToast } from "@/hooks/use-toast";

import InputEle from "@/components/genui/InputEle";

import { User } from "@/libs/types";
import { useRouter } from "next/navigation";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

// Props interface for role manager component
interface RolemanagerProps {
  id?: string;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}
interface FormData {
  name: string;
  description: string;
  isSuperAdmin: boolean;
}
const initialFormData: FormData = {
  name: "",
  description: "",
  isSuperAdmin: false,
};

function EditRole({ id, showModal, setShowModal }: RolemanagerProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await apiClient.get(`${BASE_API_URL}/roles/${id}`);
        setFormData(response);
        toast({
          title: "Role Fetched",
          description: response.message,
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching the role",
          variant: "destructive",
        });
      }
    };
    fetchRole();
  }, [id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Extract just the permission values from selected permissions

    // Update formData with selected permissions
    const submitData = JSON.stringify({
      name: formData.name.replace(/[^a-zA-Z]/g, "_"),
      description: formData.description,
      isSuperAdmin: formData.isSuperAdmin,
    });

    try {
      // Submit new role to backend
      const config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/roles/${id}`,

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        data: submitData,
      };
      const response = await apiClient.request(config);

      setFormData(initialFormData);
      setShowModal(false);
      toast({
        title: "Role Edited",
        description: response.message,
        variant: "default",
      });
      setIsLoading(false);
      router.refresh();
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.error("Error creating role:", error);
      toast({
        title: "Error",
        description: "An error occurred while editing the role",
        variant: "destructive",
      });
    }
    setIsLoading(false);
    router.refresh();
    window.location.reload();
  };

  return (
    <div
      className="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          // Close modal when clicking outside
          setShowModal(false);
        }
      }}
    >
      <div className="bg-white p-8 rounded-lg w-[800px] max-w-[90%] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Create New Role</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputEle
            label="Role Name"
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <InputEle
            label="Description"
            type="text"
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isSuperAdmin"
              checked={formData.isSuperAdmin}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isSuperAdmin: (e.target as HTMLInputElement).checked,
                })
              }
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="isSuperAdmin" className="text-sm font-medium">
              Is Super Admin
            </label>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
              }}
              className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
            >
              {isLoading ? "Editing..." : "Edit Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRole;
