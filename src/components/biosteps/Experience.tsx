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
  };

  return (
    <div className="pt-4 flex flex-col justify-between gap-4 mt-4">
      <h3 className="font-bold font-mono text-xl text-black ">
        WORK EXPERIENCE
        <hr />
      </h3>
      {/* <InputEle id="currentJob" type="text" label="Current Job " />
      <InputEle id="companyName" type="text" label="Company Name" /> */}

      <div className="grid grid-cols-1 sm:grid-cols-2  gap-10 ">
        <InputEle
          id="companyName"
          placeholder=""
          type="text"
          label="Company Name"
          onChange={() => {}}
        />
        <InputEle
          id="OfficeAddress"
          placeholder="Enter your Address"
          type="text"
          label="Office Address"
          onChange={() => {}}
        />
        <InputEle
          id="Position/Role"
          type="text"
          label="Position/Role "
          onChange={() => {}}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="checkbox"
          type="checkbox"
          checked={isCurrentJob}
          onChange={handleCheckboxChange}
        />
        <InputEle
          id="startDate"
          type="date"
          label="Start Date"
          onChange={() => {}}
        />
        <InputEle
          id="endDate"
          type="date"
          label="End Date"
          onChange={() => {}}
        />
        <label htmlFor="checkbox">This is my current position</label>
      </div>

      {!isCurrentJob && (
        <div className="grid grid-cols-2 gap-10">
          {/* <InputEle id="startDate" type="date" label="Start Date" />
          <InputEle id="endDate" type="date" label="End Date" /> */}
        </div>
      )}
    </div>
  );
}

export default Experience;
