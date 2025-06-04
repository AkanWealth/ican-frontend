"use client";

import React, { useState, useEffect } from "react";

import apiClient from "@/services-admin/apiClient";

import { BASE_API_URL } from "@/utils/setter";
import { useToast } from "@/hooks/use-toast";

import InputEle from "@/components/genui/InputEle";

import { User } from "@/libs/types";
import { useRouter } from "next/navigation";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const router = useRouter();
  // State to store roles
  const [roles, setRoles] = useState<RolesData[]>([]);
  // State to store users
  const [users, setUsers] = useState<User[]>([]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

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
        setUsers(response.data);
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
      router.refresh();
      window.location.reload();
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
      <div className="bg-white p-8 rounded-lg w-[800px] max-w-[90%] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">
          Create New Administrator
        </h2>
        <p className="text-sm text-gray-500">
          Create a new administrator to manage the platform. This will grant
          them access to all features and settings.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formData.userId && (
            <p className="text-base text-black font-medium">
              Name: {selectedUser?.firstname} {selectedUser?.surname}
              <br />
              Email: {selectedUser?.email}
              <br />
              Current Role: {selectedUser?.role.name.replace(/[_-]/g, " ")}
              <br />
              New Role: {selectedRole?.name.replace(/[_-]/g, " ")}
            </p>
          )}

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between p-3 rounded border border-gray-400 bg-white text-base font-sans font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {value
                  ? users.find((user) => user.id === value)?.firstname +
                    " " +
                    users.find((user) => user.id === value)?.surname
                  : "Select User..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-white border border-gray-400 rounded shadow-lg">
              <Command>
                <CommandInput
                  placeholder="Search User..."
                  className="h-9 p-3 rounded border border-gray-400 bg-white text-base font-sans font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <CommandList>
                  <CommandEmpty className="p-3 text-gray-500">
                    No User found.
                  </CommandEmpty>
                  <CommandGroup>
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.id}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setFormData({ ...formData, userId: currentValue });
                          setOpen(false);
                        }}
                        className={cn(
                          "p-3 rounded cursor-pointer text-base font-sans font-normal",
                          value === user.id
                            ? "bg-blue-100"
                            : "hover:bg-gray-100 focus:bg-blue-50"
                        )}
                      >
                        {user.firstname} {user.surname}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === user.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

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
