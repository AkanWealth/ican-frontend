"use client";
import { BiodataFormData } from "../homecomps/Biodata";
import InputEle from "../genui/InputEle";
import React from "react";

interface QualificationsProps {
  isShown: boolean;

  formData: BiodataFormData;
  updateFormData: (data: Partial<BiodataFormData>) => void;
}

function Qualifications({
  isShown,
  formData,
  updateFormData,
}: QualificationsProps) {
  var bucket = "";
  if (isShown) {
    bucket = "flex";
  } else {
    bucket = "hidden";
  }
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    updateFormData({
      education: {
        ...formData.education,
        [id]: value,
      },
    });
    console.log(e);
    console.log(formData);
  };
  return (
    <div className="w-full pt-4 flex flex-col justify-between gap-4 mt-4">
      <h3 className="w-full font-bold font-mono text-xl text-black ">
        EDUCATION AND PROFESSIONAL QUALIFICATION
        <hr />
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputEle
          id="insitution"
          placeholder="Enter your Insitution"
          type="text"
          label="Insitution"
          onChange={handleChange}
          required={false}
          value={formData?.education?.insitution}
        />
        <InputEle
          id="discipline"
          placeholder="Enter your Discipline"
          type="text"
          label="Discipline"
          onChange={handleChange}
          required={false}
          value={formData?.education?.discipline}
        />
        <InputEle
          id="qualification"
          type="qualification"
          label="Qualification"
          onChange={handleChange}
          required={false}
          value={formData?.education?.qualification}
        />
        <InputEle
          id="graduation"
          type="number"
          label="Year of Graduation"
          onChange={handleChange}
          required={false}
          value={formData?.education?.graduation}
        />
        <InputEle
          id="status"
          type="status"
          label="Status"
          onChange={handleChange}
          required={false}
          value={formData?.education?.status}
        />
        {/* <InputEle
          id="firstQualDate"
          type="number"
          label="Year of First Qualification"
          value={
            formData?.education?.professionalQualification?.[0]?.firstQualDate
          }
        />
        <InputEle
          onChange={handleChange}
          required={false}
          id="secQualName"
          type="text"
          label="Second professional Qualification"
          value={
            formData?.education?.professionalQualification?.[1]?.secQualName
          }
        />
        <InputEle
          onChange={handleChange}
          required={false}
          id="secQualDate"
          type="number"
          label="Year of Second Qualification"
        /> */}
      </div>
    </div>
  );
}

export default Qualifications;
