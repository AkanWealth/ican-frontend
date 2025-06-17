"use client";

import React, { useState, useEffect } from "react";

import apiClient from "@/services-admin/apiClient";
import { useToast } from "@/hooks/use-toast";

import { AuthProvider } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";
import { AdminProtectedRoute } from "@/app/(admin)/admin/LoginAuthentication/AdminProtectedRoute";

import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";
import { BASE_API_URL } from "@/utils/setter";
import { User } from "@/libs/types";
import ExportMemberPDF from "@/components/admincomps/user/export/ExportMemberPDF";

// Format date to dd-mm-yyyy
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  } catch (error) {
    return "N/A";
  }
};

function MemberDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [data, setData] = useState<User>();
  const { toast } = useToast();
  // Add edit mode state
  const [editMode, setEditMode] = useState(false);
  // Add state for form data
  const [formData, setFormData] = useState<User | undefined>(undefined);
  // Track if a save is in progress
  const [isSaving, setIsSaving] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : undefined));
  };

  // Reset form data to original data
  const cancelEdit = () => {
    setFormData(data);
    setEditMode(false);
  };

  // Save changes to API
  const saveChanges = async () => {
    if (!formData) return;

    const userId = (await params).id;
    setIsSaving(true);

    try {
      // Filter out properties that should not be sent
      const filteredData = {
        email: formData.email,
        membershipId: formData.membershipId,

        surname: formData.surname,
        firstname: formData.firstname,
        middlename: formData.middlename,
        profilePicture: formData.profilePicture,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        maritalStatus: formData.maritalStatus,
        stateOfOrigin: formData.stateOfOrigin,
        nationality: formData.nationality,

        residentialAddress: formData.residentialAddress,
        residentialCountry: formData.residentialCountry,
        residentialCity: formData.residentialCity,
        residentialState: formData.residentialState,
        residentialLGA: formData.residentialLGA,

        contactPhoneNumber: formData.contactPhoneNumber,

        institution: formData.institution,
        discipline: formData.discipline,
        qualifications: formData.qualifications,
        yearOfGraduation: formData.yearOfGraduation,
        status: formData.status,

        companyName: formData.companyName,
        officeAddress: formData.officeAddress,
        position: formData.position,
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

      const config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/users/${userId}`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        data: filteredData,
      };

      const result = await apiClient.request(config);
      setData(result);
      setEditMode(false);

      toast({
        title: "Success!",
        description: "Member details updated successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating member details:", error);
      toast({
        title: "Error updating member details!",
        description: "An error occurred while updating the member details.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const userId = (await params).id;
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/users/${userId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };
      try {
        const result = await apiClient.request(config);
        setData(result);
        // Initialize form data with fetched data
        setFormData(result);
      } catch (error) {
        console.error("Error fetching member details:", error);
        toast({
          title: "Error fetching member details!",
          description: "Error fetching member details!",
          variant: "destructive",
        });
      }
    }
    fetchData();
  }, [params, toast]);

  // Render field based on edit mode
  const renderField = (
    label: string,
    fieldName: keyof User,
    type: string = "text"
  ) => {
    return (
      <p className="text-sm text-neutral-600 flex flex-col gap-1">
        {label}
        {editMode ? (
          <input
            type={type}
            name={fieldName}
            value={
              typeof formData?.[fieldName] === "object" &&
              !Array.isArray(formData?.[fieldName])
                ? formData?.[fieldName]?.name || ""
                : formData?.[fieldName]?.toString() || ""
            }
            onChange={handleChange}
            className="text-base text-black font-medium border border-gray-300 rounded-md p-1"
          />
        ) : (
          <span className="text-base text-black font-medium">
            {fieldName === "dateOfBirth" ||
            fieldName === "startDate" ||
            fieldName === "endDate"
              ? formatDate(data?.[fieldName] as string)
              : typeof data?.[fieldName] === "object"
              ? Array.isArray(data?.[fieldName])
                ? "N/A"
                : data?.[fieldName]?.name || "N/A"
              : data?.[fieldName] || "N/A"}
          </span>
        )}
      </p>
    );
  };

  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.back()}
            className="flex flex-row items-center gap-2 text-primary"
          >
            <MdArrowBack className="w-6 h-6" /> Back
          </button>
          <h2 className="font-semibold text-2xl text-black">Member Details</h2>
        </div>
        {/* Add edit/save/cancel buttons */}
        <div className="flex gap-3">
          {editMode ? (
            <>
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <div className="flex flex-row gap-2">
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
              >
                Edit Details
              </button>
              {data && <ExportMemberPDF user={data} />}
            </div>
          )}
        </div>
      </div>
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-10 border border-neutral-200 bg-white">
        <div>
          <h2 className="text-xl font-semibold text-left">Bio data</h2>
          <hr />
          <div className="grid grid-cols-3 w-full gap-2 gap-y-4 mt-4">
            {renderField("Surname", "surname")}
            {renderField("First Name", "firstname")}
            {renderField("Middle Name", "middlename")}
            {renderField("Date of Birth", "dateOfBirth", "date")}
            {renderField("Marital Status", "maritalStatus")}
            {renderField("State of Origin", "stateOfOrigin")}
            {renderField("Nationality", "nationality")}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-left">
            Residential Address
          </h2>
          <hr />
          <div className="grid grid-cols-3 w-full gap-2 gap-y-4 mt-4">
            {renderField("Residential Address", "residentialAddress")}
            {renderField("Contact Phone Number", "contactPhoneNumber")}
            {renderField("Residential Country", "residentialCountry")}
            {renderField("Residential State", "residentialState")}
            {renderField("Residential City", "residentialCity")}
            {renderField("Residential LGA", "residentialLGA")}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-left">
            Educational and Professional Qualifications
          </h2>
          <hr />
          <div className="grid grid-cols-3 w-full gap-2 gap-y-4 mt-4">
            {renderField("Institution", "institution")}
            {renderField("Discipline", "discipline")}
            {renderField("Qualification", "qualifications")}
            {renderField("Year of Graduation", "yearOfGraduation")}
            {renderField("Status", "status")}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-left">Work Experience</h2>
          <hr />
          <div className="grid grid-cols-3 w-full gap-2 gap-y-4 mt-4">
            {renderField("Company", "companyName")}
            {renderField("Office Address", "officeAddress")}
            {renderField("Position/Role", "position")}
            {renderField("Start Date", "startDate", "date")}
            {renderField("End Date", "endDate", "date")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PackedMemberDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AuthProvider>
      <AdminProtectedRoute>
        <MemberDetails params={params} />
      </AdminProtectedRoute>
    </AuthProvider>
  );
}
