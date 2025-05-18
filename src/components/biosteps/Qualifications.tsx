"use client";
import React, { useState, useEffect } from "react";
import { BiodataFormData } from "../homecomps/Biodata";
import InputEle from "../genui/InputEle";

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
  // Create local state to track validation status
  const [isValid, setIsValid] = useState(false);

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
  };

  // Validate component whenever form data changes
  useEffect(() => {
    // Check if required fields are filled
    const isEducationValid = 
      !!formData.education?.insitution?.trim() &&
      !!formData.education?.discipline?.trim() &&
      !!formData.education?.qualification?.trim() &&
      !!formData.education?.graduation?.trim() &&
      !!formData.education?.status?.trim();
    
    setIsValid(isEducationValid);
    
    // You could also use a callback passed from parent to communicate validation status
  }, [formData]);

  return (
    <div className={`w-full pt-4 flex flex-col justify-between gap-4 mt-4 ${isShown ? 'block' : 'hidden'}`}>
      <h3 className="w-full font-bold font-mono text-xl text-black">
        EDUCATION AND PROFESSIONAL QUALIFICATION
        <hr />
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputEle
          id="insitution"
          placeholder="Enter your Institution"
          type="text"
          label="Institution"
          onChange={handleChange}
          required={true}
          value={formData?.education?.insitution || ""}
        />
        <InputEle
          id="discipline"
          placeholder="Enter your Discipline"
          type="text"
          label="Discipline"
          onChange={handleChange}
          required={true}
          value={formData?.education?.discipline || ""}
        />
        <InputEle
          id="qualification"
          type="qualification"
          label="Qualification"
          onChange={handleChange}
          required={true}
          value={formData?.education?.qualification || ""}
        />
        <InputEle
          id="graduation"
          type="number"
          label="Year of Graduation"
          onChange={handleChange}
          required={true}
          value={formData?.education?.graduation || ""}
          
        />
        <InputEle
          id="status"
          type="status"
          label="Status"
          onChange={handleChange}
          required={true}
          value={formData?.education?.status || ""}
        />
      </div>
    </div>
  );
}

export default Qualifications;