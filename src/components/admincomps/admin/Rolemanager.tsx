"use client";

import React, { useState } from "react";

import { BASE_API_URL } from "@/utils/setter";
import { useToast } from "@/hooks/use-toast";

import InputEle from "@/components/genui/InputEle";

import { useRouter } from "next/navigation";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

import apiClient from "@/services-admin/apiClient";

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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const OPTIONS: Option[] = [
    { label: "Add Content", value: "ADD_CONTENT", group: "Content" },
    { label: "Add FAQ", value: "ADD_FAQ", group: "Content" },
    { label: "Add Permission", value: "ADD_PERMISSION", group: "User" },
    { label: "Add to Waitlist", value: "ADD_TO_WAITLIST" },
    { label: "Assign Role", value: "ASSIGN_ROLE", group: "User" },
    { label: "Change Password", value: "CHANGE_PASSWORD", group: "User" },
    { label: "Create Advert", value: "CREATE_ADVERT", group: "Content" },
    { label: "Create Billing", value: "CREATE_BILLING", group: "Billing" },
    { label: "Create Blog", value: "CREATE_BLOG", group: "Content" },
    { label: "Create Content", value: "CREATE_CONTENT", group: "Content" },
    { label: "Create Event", value: "CREATE_EVENT", group: "Event" },
    { label: "Create Gallery", value: "CREATE_GALLERY", group: "Content" },
    { label: "Create Payment", value: "CREATE_PAYMENT", group: "Billing" },
    { label: "Create Role", value: "CREATE_ROLE", group: "Content" },
    { label: "Create StudyPack", value: "CREATE_STUDYPACK", group: "Content" },
    {
      label: "Create Technical Session",
      value: "CREATE_TECHNICAL_SESSION",
      group: "Content",
    },
    { label: "Create User", value: "CREATE_USER", group: "User" },
    { label: "Delete Advert", value: "DELETE_ADVERT", group: "Content" },
    { label: "Delete Blog", value: "DELETE_BLOG", group: "Content" },
    { label: "Delete Content", value: "DELETE_CONTENT", group: "Content" },
    { label: "Delete FAQ", value: "DELETE_FAQ", group: "Content" },
    { label: "Delete Feedback", value: "DELETE_FEEDBACK", group: "Event" },
    { label: "Delete Gallery", value: "DELETE_GALLERY", group: "Content" },
    { label: "Delete Permission", value: "DELETE_PERMISSION", group: "User" },
    { label: "Delete Role", value: "DELETE_ROLE", group: "User" },
    { label: "Delete StudyPack", value: "DELETE_STUDYPACK", group: "Content" },
    {
      label: "Delete Technical Session",
      value: "DELETE_TECHNICAL_SESSION",
      group: "Content",
    },
    { label: "Delete User", value: "DELETE_USER", group: "User" },
    { label: "Edit Advert", value: "EDIT_ADVERT", group: "Content" },
    { label: "Edit Content", value: "EDIT_CONTENT", group: "Content" },
    { label: "Edit Event", value: "EDIT_EVENT", group: "Event" },
    { label: "Edit FAQ", value: "EDIT_FAQ", group: "Content" },
    { label: "Edit Feedback", value: "EDIT_FEEDBACK", group: "Event" },
    { label: "Edit Gallery", value: "EDIT_GALLERY", group: "Content" },
    { label: "Edit StudyPack", value: "EDIT_STUDYPACK", group: "Content" },
    {
      label: "Edit Technical Session",
      value: "EDIT_TECHNICAL_SESSION",
      group: "Content",
    },
    { label: "Register Event", value: "REGISTER_EVENT", group: "Event" },
    { label: "Delete Event", value: "DELETE_EVENT", group: "Event" },
    {
      label: "Respond to Message",
      value: "RESPOND_TO_MESSAGE",
      group: "Contact",
    },
    { label: "Submit Feedback", value: "SUBMIT_FEEDBACK", group: "Event" },
    { label: "Suspend User", value: "SUSPEND_USER", group: "User" },
    {
      label: "Update Advert Status",
      value: "UPDATE_ADVERT_STATUS",
      group: "Content",
    },
    { label: "Update Billing", value: "UPDATE_BILLING", group: "Billing" },
    { label: "Update Blog", value: "UPDATE_BLOG", group: "Content" },
    { label: "Update Content", value: "UPDATE_CONTENT", group: "Content" },
    { label: "Update Contact", value: "UPDATE_CONTACT", group: "User" },
    {
      label: "Update Event Registration",
      value: "UPDATE_EVENT_REGISTRATION",
      group: "Event",
    },
    {
      label: "Update Event Registrations",
      value: "UPDATE_EVENT_REGISTRATIONS",
      group: "Event",
    },
    {
      label: "Update Event Status",
      value: "UPDATE_EVENT_STATUS",
      group: "Event",
    },
    { label: "Update Profile", value: "UPDATE_PROFILE", group: "User" },
    {
      label: "Update Qualification",
      value: "UPDATE_QUALIFICATION",
      group: "User",
    },
    { label: "Update Role", value: "UPDATE_ROLE", group: "User" },
    {
      label: "Update Role Permissions",
      value: "UPDATE_ROLE_PERMISSIONS",
      group: "User",
    },
    { label: "Update User", value: "UPDATE_USER" },
    { label: "Update Work Experience", value: "UPDATE_WORK_EXPERIENCE" },
    { label: "View Admin", value: "VIEW_ADMIN", group: "User" },
    { label: "View Advert", value: "VIEW_ADVERT", group: "Content" },
    { label: "VIEW_ALL_ADVERT", value: "VIEW_ALL_ADVERT", group: "Content" },
    {
      label: "View All Billings",
      value: "VIEW_ALL_BILLINGS",
      group: "Billing",
    },
    { label: "View All Blogs", value: "VIEW_ALL_BLOGS", group: "Content" },
    { label: "View All Content", value: "VIEW_ALL_CONTENT", group: "Content" },
    { label: "View All Events", value: "VIEW_ALL_EVENTS", group: "Event" },
    {
      label: "View All Event Registrations by User",
      value: "VIEW_ALL_EVENT_REGISTRATIONS_BY_USER",
      group: "Event",
    },
    { label: "View All FAQ", value: "VIEW_ALL_FAQ", group: "Content" },
    { label: "View All Gallery", value: "VIEW_ALL_GALLERY", group: "Content" },
    {
      label: "View All Messages",
      value: "VIEW_ALL_MESSAGES",
      group: "Contact",
    },
    {
      label: "View All Payments",
      value: "VIEW_ALL_PAYMENTS",
      group: "Billing",
    },
    {
      label: "View All StudyPacks",
      value: "VIEW_ALL_STUDYPACKS",
      group: "Content",
    },
    {
      label: "View All Technical Sessions",
      value: "VIEW_ALL_TECHNICAL_SESSION",
      group: "Content",
    },
    { label: "View All Users", value: "VIEW_ALL_USERS", group: "User" },
    { label: "View Billing", value: "VIEW_BILLING", group: "Billing" },
    { label: "View Blog", value: "VIEW_BLOG", group: "Content" },
    { label: "View Content", value: "VIEW_CONTENT", group: "Content" },
    { label: "View Event", value: "VIEW_EVENT", group: "Event" },
    {
      label: "View Event Attendance",
      value: "VIEW_EVENT_ATTENDANCE",
      group: "Event",
    },
    {
      label: "View Event Registration Trend",
      value: "VIEW_EVENT_REGISTRATION_TREND",
      group: "Event",
    },
    {
      label: "View Event Registrations",
      value: "VIEW_EVENT_REGISTRATIONS",
      group: "Event",
    },
    {
      label: "View Event Registrations by User",
      value: "VIEW_EVENT_REGISTRATIONS_BY_USER",
      group: "Event",
    },
    { label: "View FAQ", value: "VIEW_FAQ", group: "Content" },
    { label: "View Feedback", value: "VIEW_FEEDBACK", group: "Content" },
    { label: "View Gallery", value: "VIEW_GALLERY", group: "Content" },
    {
      label: "View ICAN Member Registrations",
      value: "VIEW_ICAN_MEMBER_REGISTRATIONS",
      group: "Event",
    },
    { label: "View Message", value: "VIEW_MESSAGE", group: "Contact" },
    {
      label: "View Overdue Payments",
      value: "VIEW_OVERDUE_PAYMENTS",
      group: "Billing",
    },
    { label: "View Payment", value: "VIEW_PAYMENT", group: "Billing" },
    {
      label: "View Payment by Billing",
      value: "VIEW_PAYMENT_BY_BILLING",
      group: "Billing",
    },
    {
      label: "View Payment Data",
      value: "VIEW_PAYMENT_DATA",
      group: "Billing",
    },
    {
      label: "View Payment Trend",
      value: "VIEW_PAYMENT_TREND",
      group: "Billing",
    },
    { label: "View Permission", value: "VIEW_PERMISSION", group: "User" },
    { label: "View Role", value: "VIEW_ROLE", group: "User" },
    { label: "View Roles", value: "VIEW_ROLES", group: "User" },
    { label: "View StudyPack", value: "VIEW_STUDYPACK", group: "Content" },
    {
      label: "View Technical Session",
      value: "VIEW_TECHNICAL_SESSION",
      group: "Content",
    },
    { label: "View User", value: "VIEW_USER", group: "User" },
    { label: "View User Activity", value: "VIEW_USER_ACTIVITY", group: "User" },
    {
      label: "View User Login Trend",
      value: "VIEW_USER_LOGIN_TREND",
      group: "User",
    },
    {
      label: "View User Registration Trend",
      value: "VIEW_USER_REGISTRATION_TREND",
      group: "User",
    },
    { label: "View Waitlist", value: "VIEW_WAITLIST", group: "Event" },
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

          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        data: submitData,
      };
      const response = await apiClient.post(
        "/roles/create",
        submitData,
        config
      );

      setFormData(initialFormData);
      setPermissions([]);
      setShowModal(false);

      router.refresh();
      window.location.reload();
      toast({
        title: "Role Created",
        description: "New role created successfully",
        variant: "default",
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error creating role:", error);
      router.refresh();
      window.location.reload();
      toast({
        title: "Error",
        description: "An error occurred while creating the role",
        variant: "destructive",
      });
    }
    setIsLoading(false);
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
      <div className="bg-white p-8 rounded-lg w-[800px]">
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
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
            >
              {isLoading ? "Creating..." : "Create Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Rolemanager;
