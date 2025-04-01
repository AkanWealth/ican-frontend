"use client";
import React from "react";
import { useState } from "react";
import { BiodataFormData } from "../homecomps/Biodata";
import InputEle from "../genui/InputEle";

interface ExperienceProps {
  isShown: boolean;

  formData: BiodataFormData;
  updateFormData: (data: Partial<BiodataFormData>) => void;
}

function Experience({ formData, updateFormData }: ExperienceProps) {
  const [isCurrentJob, setIsCurrentJob] = useState(false);

  const handleCheckboxChange = () => {
    setIsCurrentJob(!isCurrentJob);

    if (!isCurrentJob) {
      // Clear startDate and endDate when it's the current job
      updateFormData({
        experience: {
          ...formData.experience,
          startDate: "",
          endDate: "",
        },
      });
    }
  };

  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    // Convert the date to ISO format
    const formattedDate = value ? new Date(value).toISOString() : "";
    updateFormData({
      experience: {
        ...formData.experience,
        [field]: formattedDate,
      },
    });
  };

  return (
    <div className="pt-4 flex flex-col justify-between gap-4 mt-4">
      <h3 className="font-bold font-mono text-xl text-black ">
        WORK EXPERIENCE
        <hr />
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        <InputEle
          id="companyName"
          placeholder="Enter company name"
          type="text"
          label="Company Name"
          value={formData.experience?.companyName || ""}
          onChange={(e) =>
            updateFormData({
              experience: {
                ...formData.experience,
                companyName: e.target.value,
              },
            })
          }
        />
        <InputEle
          id="OfficeAddress"
          placeholder="Enter your Address"
          type="text"
          label="Office Address"
          value={formData.experience?.officeAddress || ""}
          onChange={(e) =>
            updateFormData({
              experience: {
                ...formData.experience,
                officeAddress: e.target.value,
              },
            })
          }
        />
      </div>

      <InputEle
        id="Position/Role"
        type="text"
        label="Position/Role "
        placeholder="Enter your Position/Role"
        value={formData.experience?.currentPosition || ""}
        onChange={(e) =>
          updateFormData({
            experience: {
              ...formData.experience,
              currentPosition: e.target.value,
            },
          })
        }
      />

      <label htmlFor="checkbox">
        <input
          id="checkbox"
          type="checkbox"
          checked={isCurrentJob}
          onChange={handleCheckboxChange}
        />
        This is my current position
      </label>

      {!isCurrentJob && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <InputEle
            id="startDate"
            type="date"
            label="Start Date"
            value={
              formData.experience?.startDate
                ? new Date(formData.experience.startDate).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => handleDateChange("startDate", e.target.value)}
          />
          <InputEle
            id="endDate"
            type="date"
            label="End Date"
            value={
              formData.experience?.endDate
                ? new Date(formData.experience.endDate).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => handleDateChange("endDate", e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

export default Experience;
