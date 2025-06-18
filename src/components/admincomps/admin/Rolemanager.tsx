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
// Permission matrix configuration
const PERMISSION_MATRIX = [
  {
    resource: "Dashboard",
    actions: [
      { label: "Create", value: `` },
      {
        label: "View",
        value: `"VIEW_ATTENDANCE_METRICS" , "VIEW_DONUT_SUMMARY", "VIEW_EVENT_REGISTRATION_TREND", "VIEW_GRAPH_SUMMARY", "VIEW_ICAN_MEMBER_REGISTRATIONS", "VIEW_MONTHLY_CHART", "VIEW_OUTSTANDING_BREAKDOWN", "VIEW_OVERDUE_PAYMENTS", "VIEW_PAYMENT_DATA", "VIEW_PAYMENT_HISTORY", "VIEW_PAYMENT_TREND", "VIEW_TOTAL_OUTSTANDING", "VIEW_USER_ACTIVITY", "VIEW_USER_LOGIN_TREND", "VIEW_USER_REGISTRATION_TREND"`,
      },
      {
        label: "Manage",
        value: ``,
      },
      { label: "Delete", value: `` },
    ],
  },
  {
    resource: "Admin Management",
    actions: [
      { label: "Create", value: `"ADD_PERMISSION", "CREATE_ROLE" ` },
      {
        label: "View",
        value: `"VIEW_ALL_USERS" , "VIEW_ADMIN", "VIEW_ICAN_MEMBER_REGISTRATIONS", "VIEW_PERMISSION", "VIEW_ROLE", "VIEW_ROLES", "VIEW_USER", "VIEW_USER_ACTIVITY", "VIEW_USER_LOGIN_TREND", "VIEW_USER_REGISTRATION_TREND"`,
      },
      {
        label: "Manage",
        value: `"RESPOND_TO_MESSAGE" , "SUSPEND_USER" , "UPDATE_CONTACT", "UPDATE_ROLE", "UPDATE_ROLE_PERMISSIONS", "UPDATE_USER" `,
      },
      {
        label: "Delete",
        value: `"DELETE_PERMISSION", "DELETE_ROLE"`,
      },
    ],
  },
  {
    resource: "Members Management",
    actions: [
      { label: "Create", value: `"CREATE_USER"` },
      {
        label: "View",
        value: `"VIEW_ALL_USERS" ,  "VIEW_ICAN_MEMBER_REGISTRATIONS", "VIEW_USER", "VIEW_USER_ACTIVITY", "VIEW_USER_LOGIN_TREND", "VIEW_USER_REGISTRATION_TREND" , "VIEW_ALL_MESSAGES" , "VIEW_MESSAGE"`,
      },
      {
        label: "Manage",
        value: `"CHANGE_PASSWORD" , "EDIT-PROFILE", "EDIT-QUALIFICATION", "EDIT-WORK-EXPERIENCE", "SUSPEND_USER", "UPDATE_PROFILE", "UPDATE_QUALIFICATION", "UPDATE_USER", "UPDATE_WORK_EXPERIENCE", "UPDATE-BIODATA", "UPDATE-PROFILE"`,
      },
      { label: "Delete", value: `"DELETE_USER"` },
    ],
  },
  {
    resource: "Content Management",
    actions: [
      {
        label: "Create",
        value: `"ADD_CONTENT", "ADD_CONTEN", "ADD_FAQ", "CREATE_ADVERT", "CREATE_BLOG", "CREATE_CONTENT", "CREATE_GALLERY", "CREATE_STUDYPACK", "CREATE_TECHNICAL_SESSION",   `,
      },
      {
        label: "View",
        value: `"VIEW_ALL_BLOGS" , "VIEW_ALL_CONTENT", "VIEW_ALL_FAQ", "VIEW_ALL_GALLERY" , "VIEW_ALL_STUDYPACKS" , "VIEW_ALL_TECHNICAL_SESSION", "VIEW_BLOG" , "VIEW_CONTENT", "VIEW_FAQ", "VIEW_GALLERY", "VIEW_STUDYPACK", "VIEW_TECHNICAL_SESSION" , "VIEW_TECHNICAL_SESSION_ATTENDANCE"`,
      },
      {
        label: "Manage",
        value: `"EDIT_ADVERT", "EDIT_CONTENT", "EDIT_EVENT", "EDIT_FAQ" , "EDIT_GALLERY", "EDIT_STUDYPACK", "EDIT_TECHNICAL_SESSION", "UPDATE_ADVERT_STATUS", "UPDATE_BLOG", "UPDATE_CONTENT"`,
      },
      {
        label: "Delete",
        value: `"DELETE_ADVERT", "DELETE_BLOG", "DELETE_CONTENT",  "DELETE_FAQ", "DELETE_GALLERY", "DELETE_STUDYPACK", "DELETE_TECHNICAL_SESSION"`,
      },
    ],
  },
  {
    resource: "Event Management",
    actions: [
      { label: "Create", value: `"CREATE_EVENT"` },
      {
        label: "View",
        value: `"VIEW_EVENT" , "VIEW_ALL_EVENTS", "VIEW_ALL_EVENT_REGISTRATIONS_BY_USER" , "VIEW_ALL_MEETINGS", "VIEW_ATTENDANCE", "VIEW_EVENT", "VIEW_EVENT_ATTENDANCE", "VIEW_EVENT_REGISTRATION_TREND", "VIEW_EVENT_REGISTRATIONS", "VIEW_EVENT_REGISTRATIONS_BY_USER" , "VIEW_TECHNICAL_SESSION" , "VIEW_WAITLIST"`,
      },
      {
        label: "Manage",
        value: `"ADD_TO_WAITLIST" , "UPDATE_EVENT_STATUS", "REGISTER_EVENT" , "UPDATE_EVENT_REGISTRATION" , "UPDATE_EVENT_REGISTRATIONS", "VIEW_FEEDBACK"`,
      },
      { label: "Delete", value: `"DELETE_EVENT", "DELETE_FEEDBACK" ` },
    ],
  },
  {
    resource: "Billing & Payments",
    actions: [
      {
        label: "Create",
        value: `"ADD_PAYMENT", "Add_PAYMENT", "CREATE_BILLING", "CREATE_PAYMENT", "CREATE_PAYMET" `,
      },
      {
        label: "View",
        value: `"VIEW_ALL_BILLINGS" , "VIEW_ALL_PAYMENTS", "VIEW_BILLING", "VIEW_PAYMENT", "VIEW_PAYMENT_BY_BILLING", "VIEW_PAYMENT_DATA", "VIEW_PAYMENT_DATA", "VIEW_PAYMENT_HISTORY", "VIEW_PAYMENT_TREND", "VIEW_SUBSCRIPTION" , "VIEW_TOTAL_OUTSTANDING"`,
      },
      { label: "Manage", value: `"MAKE_DONATION" , "UPDATE_BILLING"` },
      { label: "Delete", value: `"DELETE_EVENT"` },
    ],
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

    // Extract and clean up permission values
    const selectedPermissionValues = permissions
      .map((permission) => permission.value)
      .join(",") // Join all values into a single string
      .split(",") // Split into array
      .map((p) => p.trim().replace(/"/g, "")) // Remove quotes and trim
      .filter((p) => p !== "") // Remove empty strings
      .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

    // Update formData with selected permissions
    const submitData = {
      name: formData.name.replace(/[^a-zA-Z]/g, "_").toUpperCase(),
      permissions: selectedPermissionValues,
    };

    try {
      const response = await apiClient.post("/roles/create", submitData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

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

  // Helper: Get all unique permission options from the matrix
  const getAllPermissionOptions = (): Option[] => {
    const options: Option[] = [];
    PERMISSION_MATRIX.forEach((row) => {
      row.actions.forEach((action) => {
        if (action.value) {
          // Avoid duplicates by value
          if (!options.some((opt) => opt.value === action.value)) {
            options.push({ label: action.label, value: action.value });
          }
        }
      });
    });
    return options;
  };

  // Handler: Select all permissions
  const handleSelectAll = () => {
    setPermissions(getAllPermissionOptions());
  };

  // Handler: Deselect all permissions
  const handleDeselectAll = () => {
    setPermissions([]);
  };

  return (
    <div className="bg-white p-8 rounded-lg flex flex-col gap-4 w-full">
      <div className="flex justify-start">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Roles
        </Button>
      </div>
      <h2 className="text-2xl font-semibold ">Create New Role</h2>
      <p className="text-sm text-gray-500">
        Create a new role to manage the platform. This will grant them access to
        all features and settings.
      </p>

      {/* Select All / Deselect All Buttons */}
      <div className="flex gap-2 mt-2 mb-2">
        <Button type="button" variant="default" onClick={handleSelectAll}>
          Select All
        </Button>
        <Button type="button" variant="default" onClick={handleDeselectAll}>
          Deselect All
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      
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
