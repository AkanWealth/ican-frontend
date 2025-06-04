"use client";

import React, { useState } from "react";

import { BASE_API_URL } from "@/utils/setter";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import InputEle from "@/components/genui/InputEle";
import { useRouter } from "next/navigation";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

import apiClient from "@/services-admin/apiClient";
import { ArrowLeft } from "lucide-react";
// Props interface for role manager component
interface RolemanagerProps {
  id?: any;
}
interface FormData {
  name: string;
  permissions: string[];
}
const initialFormData: FormData = {
  name: "",
  permissions: [],
};
/**
 * All Available Permissions (for reference)
 *
 * ADD_CONTEN
 * ADD_CONTENT
 * ADD_FAQ
 * Add_PAYMENT
 * ADD_PAYMENT
 * ADD_PERMISSION
 * ADD_TO_WAITLIST
 * ASSIGN_ROLE
 * CHANGE_PASSWORD
 * CREATE_ADVERT
 * CREATE_BILLING
 * CREATE_BLOG
 * CREATE_CONTENT
 * CREATE_EVENT
 * CREATE_GALLERY
 * CREATE_PAYMENT
 * CREATE_PAYMET
 * CREATE_ROLE
 * CREATE_STUDYPACK
 * CREATE_TECHNICAL_SESSION
 * CREATE_USER
 * DELETE_ADVERT
 * DELETE_BLOG
 * DELETE_CONTENT
 * DELETE_EVENT
 * DELETE_FAQ
 * DELETE_FEEDBACK
 * DELETE_GALLERY
 * DELETE_PERMISSION
 * DELETE_ROLE
 * DELETE_STUDYPACK
 * DELETE_TECHNICAL_SESSION
 * DELETE_USER
 * EDIT_ADVERT
 * EDIT_CONTENT
 * EDIT_EVENT
 * EDIT_FAQ
 * EDIT_FEEDBACK
 * EDIT_GALLERY
 * EDIT_STUDYPACK
 * EDIT_TECHNICAL_SESSION
 * EDIT-CONTACT-DETAILS
 * EDIT-PROFILE
 * EDIT-QUALIFICATION
 * EDIT-WORK-EXPERIENCE
 * MAKE_DONATION
 * REGISTER_EVENT
 * RESPOND_TO_MESSAGE
 * SUBMIT_FEEDBACK
 * SUSPEND_USER
 * UPDATE_ADVERT_STATUS
 * UPDATE_BILLING
 * UPDATE_BLOG
 * UPDATE_CONTACT
 * UPDATE_CONTENT
 * UPDATE_EVENT_REGISTRATION
 * UPDATE_EVENT_REGISTRATIONS
 * UPDATE_EVENT_STATUS
 * UPDATE_PROFILE
 * UPDATE_QUALIFICATION
 * UPDATE_ROLE
 * UPDATE_ROLE_PERMISSIONS
 * UPDATE_USER
 * UPDATE_WORK_EXPERIENCE
 * UPDATE-BIODATA
 * UPDATE-PROFILE
 * VIEW_ADMIN
 * VIEW_ADVERT
 * VIEW_ALL_ADVERT
 * VIEW_ALL_BILLINGS
 * VIEW_ALL_BLOGS
 * VIEW_ALL_CONTENT
 * VIEW_ALL_EVENT_REGISTRATIONS_BY_USER
 * VIEW_ALL_EVENTS
 * VIEW_ALL_FAQ
 * VIEW_ALL_GALLERY
 * VIEW_ALL_MEETINGS
 * VIEW_ALL_MESSAGES
 * VIEW_ALL_PAYMENTS
 * VIEW_ALL_STUDYPACKS
 * VIEW_ALL_TECHNICAL_SESSION
 * VIEW_ALL_USERS
 * VIEW_ATTENDANCE
 * VIEW_ATTENDANCE_METRICS
 * VIEW_BILLING
 * VIEW_BLOG
 * VIEW_CONTENT
 * VIEW_DONUT_SUMMARY
 * VIEW_EVENT
 * VIEW_EVENT_ATTENDANCE
 * VIEW_EVENT_REGISTRATION_TREND
 * VIEW_EVENT_REGISTRATIONS
 * VIEW_EVENT_REGISTRATIONS_BY_USER
 * VIEW_FAQ
 * VIEW_FEEDBACK
 * VIEW_GALLERY
 * VIEW_GRAPH_SUMMARY
 * VIEW_ICAN_MEMBER_REGISTRATIONS
 * VIEW_MESSAGE
 * VIEW_MONTHLY_CHART
 * VIEW_OUTSTANDING_BREAKDOWN
 * VIEW_OVERDUE_PAYMENTS
 * VIEW_PAYMENT
 * VIEW_PAYMENT_BY_BILLING
 * VIEW_PAYMENT_DATA
 * VIEW_PAYMENT_HISTORY
 * VIEW_PAYMENT_TREND
 * VIEW_PERMISSION
 * VIEW_ROLE
 * VIEW_ROLES
 * VIEW_STUDYPACK
 * VIEW_SUBSCRIPTION
 * VIEW_TECHNICAL_SESSION
 * VIEW_TOTAL_OUTSTANDING
 * VIEW_USER
 * VIEW_USER_ACTIVITY
 * VIEW_USER_LOGIN_TREND
 * VIEW_USER_REGISTRATION_TREND
 * VIEW_WAITLIST
 */

// Permission matrix configuration
const PERMISSION_MATRIX = [
  {
    resource: "Event Management",
    actions: [
      { label: "Create", value: "CREATE_EVENT" },
      { label: "View", value: "VIEW_EVENT" },
      { label: "View All", value: "VIEW_ALL_EVENTS" },
      { label: "Manage", value: "EDIT_EVENT" },
      { label: "Delete", value: "DELETE_EVENT" },
      { label: "Register", value: "REGISTER_EVENT" },
      { label: "Update Status", value: "UPDATE_EVENT_STATUS" },
      { label: "View Registrations", value: "VIEW_EVENT_REGISTRATIONS" },
      {
        label: "View All Registrations",
        value: "VIEW_ALL_EVENT_REGISTRATIONS_BY_USER",
      },
      { label: "Update Registrations", value: "UPDATE_EVENT_REGISTRATIONS" },
      { label: "View Attendance", value: "VIEW_EVENT_ATTENDANCE" },
      {
        label: "View Registration Trend",
        value: "VIEW_EVENT_REGISTRATION_TREND",
      },
    ],
  },
  {
    resource: "User Management",
    actions: [
      { label: "Create", value: "CREATE_USER" },
      { label: "View", value: "VIEW_USER" },
      { label: "View All", value: "VIEW_ALL_USERS" },
      { label: "Manage", value: "UPDATE_USER" },
      { label: "Delete", value: "DELETE_USER" },
      { label: "Suspend", value: "SUSPEND_USER" },
      { label: "View Activity", value: "VIEW_USER_ACTIVITY" },
      { label: "View Login Trend", value: "VIEW_USER_LOGIN_TREND" },
      {
        label: "View Registration Trend",
        value: "VIEW_USER_REGISTRATION_TREND",
      },
      { label: "Change Password", value: "CHANGE_PASSWORD" },
    ],
  },
  {
    resource: "Content Management",
    actions: [
      { label: "Create", value: "CREATE_CONTENT" },
      { label: "View", value: "VIEW_CONTENT" },
      { label: "View All", value: "VIEW_ALL_CONTENT" },
      { label: "Manage", value: "EDIT_CONTENT" },
      { label: "Delete", value: "DELETE_CONTENT" },
      { label: "Update", value: "UPDATE_CONTENT" },
    ],
  },
  {
    resource: "Blog Management",
    actions: [
      { label: "Create", value: "CREATE_BLOG" },
      { label: "View", value: "VIEW_BLOG" },
      { label: "View All", value: "VIEW_ALL_BLOGS" },
      { label: "Update", value: "UPDATE_BLOG" },
      { label: "Delete", value: "DELETE_BLOG" },
    ],
  },
  {
    resource: "Payment & Billing",
    actions: [
      { label: "Create Payment", value: "CREATE_PAYMENT" },
      { label: "View Payment", value: "VIEW_PAYMENT" },
      { label: "View All Payments", value: "VIEW_ALL_PAYMENTS" },
      { label: "View Payment History", value: "VIEW_PAYMENT_HISTORY" },
      { label: "View Payment Trend", value: "VIEW_PAYMENT_TREND" },
      { label: "View Payment Data", value: "VIEW_PAYMENT_DATA" },
      { label: "View Payment by Billing", value: "VIEW_PAYMENT_BY_BILLING" },
      { label: "Create Billing", value: "CREATE_BILLING" },
      { label: "View Billing", value: "VIEW_BILLING" },
      { label: "View All Billings", value: "VIEW_ALL_BILLINGS" },
      { label: "Update Billing", value: "UPDATE_BILLING" },
      { label: "View Outstanding", value: "VIEW_TOTAL_OUTSTANDING" },
      { label: "View Overdue", value: "VIEW_OVERDUE_PAYMENTS" },
      {
        label: "View Outstanding Breakdown",
        value: "VIEW_OUTSTANDING_BREAKDOWN",
      },
    ],
  },
  {
    resource: "Role & Permission",
    actions: [
      { label: "Create Role", value: "CREATE_ROLE" },
      { label: "View Role", value: "VIEW_ROLE" },
      { label: "View All Roles", value: "VIEW_ROLES" },
      { label: "Update Role", value: "UPDATE_ROLE" },
      { label: "Delete Role", value: "DELETE_ROLE" },
      { label: "Assign Role", value: "ASSIGN_ROLE" },
      { label: "View Permission", value: "VIEW_PERMISSION" },
      { label: "Add Permission", value: "ADD_PERMISSION" },
      { label: "Delete Permission", value: "DELETE_PERMISSION" },
      { label: "Update Role Permissions", value: "UPDATE_ROLE_PERMISSIONS" },
    ],
  },
  {
    resource: "Gallery Management",
    actions: [
      { label: "Create", value: "CREATE_GALLERY" },
      { label: "View", value: "VIEW_GALLERY" },
      { label: "View All", value: "VIEW_ALL_GALLERY" },
      { label: "Manage", value: "EDIT_GALLERY" },
      { label: "Delete", value: "DELETE_GALLERY" },
    ],
  },
  {
    resource: "FAQ Management",
    actions: [
      { label: "Add", value: "ADD_FAQ" },
      { label: "View", value: "VIEW_FAQ" },
      { label: "View All", value: "VIEW_ALL_FAQ" },
      { label: "Manage", value: "EDIT_FAQ" },
      { label: "Delete", value: "DELETE_FAQ" },
    ],
  },
  {
    resource: "Technical Sessions",
    actions: [
      { label: "Create", value: "CREATE_TECHNICAL_SESSION" },
      { label: "View", value: "VIEW_TECHNICAL_SESSION" },
      { label: "View All", value: "VIEW_ALL_TECHNICAL_SESSION" },
      { label: "Manage", value: "EDIT_TECHNICAL_SESSION" },
      { label: "Delete", value: "DELETE_TECHNICAL_SESSION" },
    ],
  },
  {
    resource: "Study Packs",
    actions: [
      { label: "Create", value: "CREATE_STUDYPACK" },
      { label: "View", value: "VIEW_STUDYPACK" },
      { label: "View All", value: "VIEW_ALL_STUDYPACKS" },
      { label: "Manage", value: "EDIT_STUDYPACK" },
      { label: "Delete", value: "DELETE_STUDYPACK" },
    ],
  },
  {
    resource: "Advert Management",
    actions: [
      { label: "Create", value: "CREATE_ADVERT" },
      { label: "View", value: "VIEW_ADVERT" },
      { label: "View All", value: "VIEW_ALL_ADVERT" },
      { label: "Manage", value: "EDIT_ADVERT" },
      { label: "Delete", value: "DELETE_ADVERT" },
      { label: "Update Status", value: "UPDATE_ADVERT_STATUS" },
    ],
  },
  {
    resource: "Analytics & Reports",
    actions: [
      { label: "View Donut Summary", value: "VIEW_DONUT_SUMMARY" },
      { label: "View Graph Summary", value: "VIEW_GRAPH_SUMMARY" },
      { label: "View Monthly Chart", value: "VIEW_MONTHLY_CHART" },
      {
        label: "View ICAN Member Registrations",
        value: "VIEW_ICAN_MEMBER_REGISTRATIONS",
      },
    ],
  },
  {
    resource: "Profile Management",
    actions: [
      { label: "Edit Profile", value: "EDIT-PROFILE" },
      { label: "Update Profile", value: "UPDATE-PROFILE" },
      { label: "Update Biodata", value: "UPDATE-BIODATA" },
      { label: "Edit Contact Details", value: "EDIT-CONTACT-DETAILS" },
      { label: "Update Contact", value: "UPDATE_CONTACT" },
      { label: "Edit Qualification", value: "EDIT-QUALIFICATION" },
      { label: "Update Qualification", value: "UPDATE_QUALIFICATION" },
      { label: "Edit Work Experience", value: "EDIT-WORK-EXPERIENCE" },
      { label: "Update Work Experience", value: "UPDATE_WORK_EXPERIENCE" },
    ],
  },
  {
    resource: "Waitlist Management",
    actions: [
      { label: "Add to Waitlist", value: "ADD_TO_WAITLIST" },
      { label: "View Waitlist", value: "VIEW_WAITLIST" },
    ],
  },
  {
    resource: "Feedback Management",
    actions: [
      { label: "Submit", value: "SUBMIT_FEEDBACK" },
      { label: "View", value: "VIEW_FEEDBACK" },
      { label: "Manage", value: "EDIT_FEEDBACK" },
      { label: "Delete", value: "DELETE_FEEDBACK" },
    ],
  },
  {
    resource: "Message Management",
    actions: [
      { label: "View", value: "VIEW_MESSAGE" },
      { label: "View All", value: "VIEW_ALL_MESSAGES" },
      { label: "Respond", value: "RESPOND_TO_MESSAGE" },
    ],
  },
  {
    resource: "Meeting Management",
    actions: [{ label: "View All", value: "VIEW_ALL_MEETINGS" }],
  },
  {
    resource: "Attendance Management",
    actions: [
      { label: "View", value: "VIEW_ATTENDANCE" },
      { label: "View Metrics", value: "VIEW_ATTENDANCE_METRICS" },
    ],
  },
  {
    resource: "Subscription Management",
    actions: [{ label: "View", value: "VIEW_SUBSCRIPTION" }],
  },
  {
    resource: "Donation Management",
    actions: [{ label: "Make Donation", value: "MAKE_DONATION" }],
  },
];

function Rolemanager({ id }: RolemanagerProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [permissions, setPermissions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
    <div className="bg-white p-8 rounded-lg w-full">
      <div className="flex justify-start">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Roles
        </Button>
      </div>
      <h2 className="text-2xl font-semibold mb-6">Create New Role</h2>
      <p className="text-sm text-gray-500">
        Create a new role to manage the platform. This will grant them access to
        all features and settings.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-sm text-gray-500">
          Role name should be in alphabets only and should not contain any
          special characters.
        </p>
        <InputEle
          label="Role Name"
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        {/* Permission Table */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-left px-4 py-2">Action</th>
                {PERMISSION_MATRIX[0].actions.map((action) => (
                  <th
                    key={action.label}
                    className="px-4 py-2 font-medium text-gray-700"
                  >
                    {action.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_MATRIX.map((row) => (
                <tr key={row.resource} className="border-t">
                  <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                    {row.resource}
                  </td>
                  {row.actions.map((action) => (
                    <td key={action.label} className="px-4 py-2 text-center">
                      {action.value ? (
                        <input
                          type="checkbox"
                          checked={permissions.some(
                            (p) => p.value === action.value
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPermissions((prev) => [
                                ...prev,
                                { label: action.label, value: action.value },
                              ]);
                            } else {
                              setPermissions((prev) =>
                                prev.filter((p) => p.value !== action.value)
                              );
                            }
                          }}
                          className="accent-blue-700 w-4 h-4"
                        />
                      ) : (
                        <span className="inline-block w-4 h-4" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between gap-4 mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-2 bg-blue-700 text-white rounded-full hover:bg-blue-800"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Rolemanager;
