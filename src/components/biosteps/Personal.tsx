"use client";

import React, { useRef, useState } from "react";
import { BiodataFormData } from "../homecomps/Biodata";
import InputEle from "@/components/genui/InputEle";
import Image from "next/image";
import { UserPenIcon } from "lucide-react";
import { uploadImageToCloud } from "@/lib/uploadImage";

interface PersonalProps {
  isShown: boolean;
  formData: BiodataFormData;
  updateFormData: (data: Partial<BiodataFormData>) => void;
}

function Personal({ formData, updateFormData }: PersonalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    console.log("Selected file:", file); // Debugging log

    if (file) {
      try {
        setIsUploading(true); // Show loading state
        const uploadedUrl = await uploadImageToCloud(file); // Upload image to S3
        console.log("Uploaded image URL:", uploadedUrl);

        // Update formData with the uploaded image URL
        updateFormData({ profilePicture: uploadedUrl });
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false); // Hide loading state
      }
    } else {
      console.warn("No file selected or file input is empty."); // Debugging log
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="pt-4 flex flex-col justify-between gap-4 mt-4">
      <h3 className="font-bold font-mono text-xl text-black ">
        BIODATA
        <hr />
      </h3>
      <div className="flex flex-col items-center justify-center mb-6">
        <div
          className="w-32 h-32 rounded-full bg-[#F7F7F7] flex items-center justify-center mb-4 cursor-pointer"
          onClick={handleUploadClick}
        >
          {formData.profilePicture ? (
            <Image
              src={formData.profilePicture}
              alt="Profile"
              width={128}
              height={128}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <UserPenIcon className="w-6 h-6 text-gray-700" />
          )}
        </div>
        <button
          type="button"
          onClick={handleUploadClick}
          className="py-2 px-4 bg-primary text-white rounded-full text-sm font-medium"
        >
          {isUploading ? "Uploading..." : "Upload your photo"}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
        <InputEle
          value={formData.personalData.surname}
          onChange={(e) =>
            updateFormData({
              personalData: {
                ...formData.personalData,
                surname: e.target.value,
              },
            })
          }
          id="surname"
          placeholder="Enter your surname"
          type="text"
          label="Surname"
          required={true}
        />
        <InputEle
          value={formData.personalData.firstName}
          onChange={(e) =>
            updateFormData({
              personalData: {
                ...formData.personalData,
                firstName: e.target.value,
              },
            })
          }
          id="firstName"
          placeholder="Enter your first name"
          type="text"
          label="First Name"
          required={true}
        />
        <InputEle
          value={formData.personalData?.middleName}
          onChange={(e) =>
            updateFormData({
              personalData: {
                ...formData.personalData,
                middleName: e.target.value,
              },
            })
          }
          id="middleName"
          placeholder="Enter your middle name"
          type="text"
          label="Middle Name"
          required={false}
        />
        <InputEle
          id="gender"
          type="gender"
          label="Gender"
          value={formData.personalData.gender}
          onChange={(e) =>
            updateFormData({
              personalData: {
                ...formData.personalData,
                gender: e.target.value,
              },
            })
          }
          addStyle2="h-[50px]"
          required={true}
        />
        <InputEle
          id="dob"
          type="date"
          label="Date of Birth"
          value={
            formData.personalData.dob
              ? new Date(formData.personalData.dob).toISOString().split("T")[0]
              : ""
          }
          onChange={(e) =>
            updateFormData({
              personalData: {
                ...formData.personalData,
                dob: new Date(e.target.value).toISOString(), // Convert to ISO format
              },
            })
          }
          required={true}
        />
        <InputEle
          id="maritalStatus"
          type="marriage"
          label="Marital Status"
          value={formData.personalData.maritalStatus}
          onChange={(e) =>
            updateFormData({
              personalData: {
                ...formData.personalData,
                maritalStatus: e.target.value,
              },
            })
          }
          addStyle2="h-[50px]"
          required={true}
        />
        <InputEle
          value={formData.personalData?.state}
          onChange={(e) =>
            updateFormData({
              personalData: {
                ...formData.personalData,
                state: e.target.value,
              },
            })
          }
          id="state"
          type="text"
          label="State of origin"
          placeholder="Enter your state of origin"
          required={true}
        />
        <InputEle
          id="nationality"
          type="country"
          label="Nationality"
          value={formData.personalData.nationality}
          onChange={(e) =>
            updateFormData({
              personalData: {
                ...formData.personalData,
                nationality: e.target.value,
              },
            })
          }
          addStyle2="h-[50px]"
          required={true}
        />
      </div>
    </div>
  );
}

export default Personal;