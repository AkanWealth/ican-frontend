"use client";

import React, { useState, useEffect } from "react";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import { useToast } from "@/hooks/use-toast";

import InputEle from "@/components/genui/InputEle";

import { User } from "@/libs/types";

import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

// Props interface for role manager component
interface RolemanagerProps {
  id?: any;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}
interface FormData {
  name: string;
  permissions: string[];
}
const initialFormData: FormData = {
  name: "",
  permissions: [],
};

function Rolemanager({ id, showModal, setShowModal }: RolemanagerProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [permissions, setPermissions] = useState<Option[]>([]);

  const OPTIONS: Option[] = [
    { label: "ADD_CONTENT", value: "ADD_CONTENT", group: "Content" },
    { label: "ADD_FAQ", value: "ADD_FAQ", group: "Content" },
    { label: "ADD_PERMISSION", value: "ADD_PERMISSION", group: "User" },
    { label: "ADD_TO_WAITLIST", value: "ADD_TO_WAITLIST" },
    { label: "ASSIGN_ROLE", value: "ASSIGN_ROLE", group: "User" },
    { label: "CHANGE_PASSWORD", value: "CHANGE_PASSWORD", group: "User" },
    { label: "CREATE_ADVERT", value: "CREATE_ADVERT", group: "Content" },
    { label: "CREATE_BILLING", value: "CREATE_BILLING", group: "Billing" },
    { label: "CREATE_BLOG", value: "CREATE_BLOG", group: "Content" },
    { label: "CREATE_CONTENT", value: "CREATE_CONTENT", group: "Content" },
    { label: "CREATE_EVENT", value: "CREATE_EVENT", group: "Event" },
    { label: "CREATE_GALLERY", value: "CREATE_GALLERY", group: "Content" },
    { label: "CREATE_PAYMENT", value: "CREATE_PAYMENT", group: "Billing" },
    { label: "CREATE_ROLE", value: "CREATE_ROLE", group: "Content" },
    { label: "CREATE_STUDYPACK", value: "CREATE_STUDYPACK", group: "Content" },
    {
      label: "CREATE_TECHNICAL_SESSION",
      value: "CREATE_TECHNICAL_SESSION",
      group: "Content",
    },
    { label: "CREATE_USER", value: "CREATE_USER", group: "User" },
    { label: "DELETE_ADVERT", value: "DELETE_ADVERT", group: "Content" },
    { label: "DELETE_BLOG", value: "DELETE_BLOG", group: "Content" },
    { label: "DELETE_CONTENT", value: "DELETE_CONTENT", group: "Content" },
    { label: "DELETE_FAQ", value: "DELETE_FAQ", group: "Content" },
    { label: "DELETE_FEEDBACK", value: "DELETE_FEEDBACK", group: "Event" },
    { label: "DELETE_GALLERY", value: "DELETE_GALLERY", group: "Content" },
    { label: "DELETE_PERMISSION", value: "DELETE_PERMISSION", group: "User" },
    { label: "DELETE_ROLE", value: "DELETE_ROLE", group: "User" },
    { label: "DELETE_STUDYPACK", value: "DELETE_STUDYPACK", group: "Content" },
    {
      label: "DELETE_TECHNICAL_SESSION",
      value: "DELETE_TECHNICAL_SESSION",
      group: "Content",
    },
    { label: "DELETE_USER", value: "DELETE_USER", group: "User" },
    { label: "EDIT_ADVERT", value: "EDIT_ADVERT", group: "Content" },
    { label: "EDIT_CONTENT", value: "EDIT_CONTENT", group: "Content" },
    { label: "EDIT_EVENT", value: "EDIT_EVENT", group: "Event" },
    { label: "EDIT_FAQ", value: "EDIT_FAQ", group: "Content" },
    { label: "EDIT_FEEDBACK", value: "EDIT_FEEDBACK", group: "Event" },
    { label: "EDIT_GALLERY", value: "EDIT_GALLERY", group: "Content" },
    { label: "EDIT_STUDYPACK", value: "EDIT_STUDYPACK", group: "Content" },
    {
      label: "EDIT_TECHNICAL_SESSION",
      value: "EDIT_TECHNICAL_SESSION",
      group: "Content",
    },
    { label: "REGISTER_EVENT", value: "REGISTER_EVENT", group: "Event" },
    {
      label: "RESPOND_TO_MESSAGE",
      value: "RESPOND_TO_MESSAGE",
      group: "Contact",
    },
    { label: "SUBMIT_FEEDBACK", value: "SUBMIT_FEEDBACK", group: "Event" },
    { label: "SUSPEND_USER", value: "SUSPEND_USER", group: "User" },
    {
      label: "UPDATE_ADVERT_STATUS",
      value: "UPDATE_ADVERT_STATUS",
      group: "Content",
    },
    { label: "UPDATE_BILLING", value: "UPDATE_BILLING", group: "Billing" },
    { label: "UPDATE_BLOG", value: "UPDATE_BLOG", group: "Content" },
    { label: "UPDATE_CONTENT", value: "UPDATE_CONTENT", group: "Content" },
    { label: "UPDATE_CONTACT", value: "UPDATE_CONTACT", group: "User" },
    {
      label: "UPDATE_EVENT_REGISTRATION",
      value: "UPDATE_EVENT_REGISTRATION",
      group: "Event",
    },
    {
      label: "UPDATE_EVENT_REGISTRATIONS",
      value: "UPDATE_EVENT_REGISTRATIONS",
      group: "Event",
    },
    {
      label: "UPDATE_EVENT_STATUS",
      value: "UPDATE_EVENT_STATUS",
      group: "Event",
    },
    { label: "UPDATE_PROFILE", value: "UPDATE_PROFILE", group: "User" },
    {
      label: "UPDATE_QUALIFICATION",
      value: "UPDATE_QUALIFICATION",
      group: "User",
    },
    { label: "UPDATE_ROLE", value: "UPDATE_ROLE", group: "User" },
    {
      label: "UPDATE_ROLE_PERMISSIONS",
      value: "UPDATE_ROLE_PERMISSIONS",
      group: "User",
    },
    { label: "UPDATE_USER", value: "UPDATE_USER" },
    { label: "UPDATE_WORK_EXPERIENCE", value: "UPDATE_WORK_EXPERIENCE" },
    { label: "VIEW_ADMIN", value: "VIEW_ADMIN", group: "User" },
    { label: "VIEW_ADVERT", value: "VIEW_ADVERT", group: "Content" },
    { label: "VIEW_ALL_ADVERT", value: "VIEW_ALL_ADVERT", group: "Content" },
    {
      label: "VIEW_ALL_BILLINGS",
      value: "VIEW_ALL_BILLINGS",
      group: "Billing",
    },
    { label: "VIEW_ALL_BLOGS", value: "VIEW_ALL_BLOGS", group: "Content" },
    { label: "VIEW_ALL_CONTENT", value: "VIEW_ALL_CONTENT", group: "Content" },
    { label: "VIEW_ALL_EVENTS", value: "VIEW_ALL_EVENTS", group: "Event" },
    {
      label: "VIEW_ALL_EVENT_REGISTRATIONS_BY_USER",
      value: "VIEW_ALL_EVENT_REGISTRATIONS_BY_USER",
      group: "Event",
    },
    { label: "VIEW_ALL_FAQ", value: "VIEW_ALL_FAQ", group: "Content" },
    { label: "VIEW_ALL_GALLERY", value: "VIEW_ALL_GALLERY", group: "Content" },
    {
      label: "VIEW_ALL_MESSAGES",
      value: "VIEW_ALL_MESSAGES",
      group: "Contact",
    },
    {
      label: "VIEW_ALL_PAYMENTS",
      value: "VIEW_ALL_PAYMENTS",
      group: "Billing",
    },
    {
      label: "VIEW_ALL_STUDYPACKS",
      value: "VIEW_ALL_STUDYPACKS",
      group: "Content",
    },
    {
      label: "VIEW_ALL_TECHNICAL_SESSION",
      value: "VIEW_ALL_TECHNICAL_SESSION",
      group: "Content",
    },
    { label: "VIEW_ALL_USERS", value: "VIEW_ALL_USERS", group: "User" },
    { label: "VIEW_BILLING", value: "VIEW_BILLING", group: "Billing" },
    { label: "VIEW_BLOG", value: "VIEW_BLOG", group: "Content" },
    { label: "VIEW_CONTENT", value: "VIEW_CONTENT", group: "Content" },
    { label: "VIEW_EVENT", value: "VIEW_EVENT", group: "Event" },
    {
      label: "VIEW_EVENT_ATTENDANCE",
      value: "VIEW_EVENT_ATTENDANCE",
      group: "Event",
    },
    {
      label: "VIEW_EVENT_REGISTRATION_TREND",
      value: "VIEW_EVENT_REGISTRATION_TREND",
      group: "Event",
    },
    {
      label: "VIEW_EVENT_REGISTRATIONS",
      value: "VIEW_EVENT_REGISTRATIONS",
      group: "Event",
    },
    {
      label: "VIEW_EVENT_REGISTRATIONS_BY_USER",
      value: "VIEW_EVENT_REGISTRATIONS_BY_USER",
      group: "Event",
    },
    { label: "VIEW_FAQ", value: "VIEW_FAQ", group: "Content" },
    { label: "VIEW_FEEDBACK", value: "VIEW_FEEDBACK", group: "Content" },
    { label: "VIEW_GALLERY", value: "VIEW_GALLERY", group: "Content" },
    {
      label: "VIEW_ICAN_MEMBER_REGISTRATIONS",
      value: "VIEW_ICAN_MEMBER_REGISTRATIONS",
      group: "Event",
    },
    { label: "VIEW_MESSAGE", value: "VIEW_MESSAGE", group: "Contact" },
    {
      label: "VIEW_OVERDUE_PAYMENTS",
      value: "VIEW_OVERDUE_PAYMENTS",
      group: "Billing",
    },
    { label: "VIEW_PAYMENT", value: "VIEW_PAYMENT", group: "Billing" },
    {
      label: "VIEW_PAYMENT_BY_BILLING",
      value: "VIEW_PAYMENT_BY_BILLING",
      group: "Billing",
    },
    {
      label: "VIEW_PAYMENT_DATA",
      value: "VIEW_PAYMENT_DATA",
      group: "Billing",
    },
    {
      label: "VIEW_PAYMENT_TREND",
      value: "VIEW_PAYMENT_TREND",
      group: "Billing",
    },
    { label: "VIEW_PERMISSION", value: "VIEW_PERMISSION", group: "User" },
    { label: "VIEW_ROLE", value: "VIEW_ROLE", group: "User" },
    { label: "VIEW_ROLES", value: "VIEW_ROLES", group: "User" },
    { label: "VIEW_STUDYPACK", value: "VIEW_STUDYPACK", group: "Content" },
    {
      label: "VIEW_TECHNICAL_SESSION",
      value: "VIEW_TECHNICAL_SESSION",
      group: "Content",
    },
    { label: "VIEW_USER", value: "VIEW_USER", group: "User" },
    { label: "VIEW_USER_ACTIVITY", value: "VIEW_USER_ACTIVITY", group: "User" },
    {
      label: "VIEW_USER_LOGIN_TREND",
      value: "VIEW_USER_LOGIN_TREND",
      group: "User",
    },
    {
      label: "VIEW_USER_REGISTRATION_TREND",
      value: "VIEW_USER_REGISTRATION_TREND",
      group: "User",
    },
    { label: "VIEW_WAITLIST", value: "VIEW_WAITLIST", group: "Event" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Extract just the permission values from selected permissions
    const selectedPermissionValues = permissions.map(
      (permission) => permission.value
    );

    // Update formData with selected permissions
    const submitData = JSON.stringify({
      name: formData.name.replace(/[^a-zA-Z]/g, "_"),
      permissions: selectedPermissionValues,
    });

    try {
      // Submit new role to backend
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/roles/create`,

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        data: submitData,
      };
      const response = await axios.request(config);

      if (response.status === 200) {
        // Show success message

        // Reset form and close modal
        setFormData(initialFormData);
        setPermissions([]);
        setShowModal(false);

        toast({
          title: "Role Created",
          description: "The role  has been successfully created.",
          variant: "default",
        });
      } else {
        // Show error message
        toast({
          title: "Error",
          description: "There was an error creating the role.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating role:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
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
      <div className="bg-white p-8 rounded-lg w-[500px]">
        <h2 className="text-2xl font-semibold mb-6">Create New Role</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputEle
            label="Role Name"
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <p className="text-primary">
            Number of selected roles: {permissions.length}
          </p>
          <MultipleSelector
            value={permissions}
            onChange={setPermissions}
            defaultOptions={OPTIONS}
            placeholder="Select Permissions for the role you like..."
            groupBy="group"
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                No more roles to assign.
              </p>
            }
          />

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
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
            >
              Create Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Rolemanager;
