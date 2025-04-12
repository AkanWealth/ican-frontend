"use client";

import React from "react";
import { BiodataFormData } from "../Biodata";
import InputEle from "@/components/genui/InputEle";

interface PersonalProps {
  formData: BiodataFormData;
  updateFormData: (data: Partial<BiodataFormData>) => void;
}

function Personal({ formData, updateFormData }: PersonalProps) {
  return (
    <div className="pt-4 flex flex-col justify-between gap-4 ">
      <h3 className="font-bold font-mono text-2xl text-black ">
        BIODATA
        <hr />
      </h3>

      <div className="grid grid-cols-2  gap-10 ">
        <InputEle
          id="surname"
          placeholder="Enter your surname"
          type="text"
          label="Surname"
        />
        <InputEle
          id="firstName"
          placeholder="Enter your first name"
          type="text"
          label="First Name"
        />
        <InputEle
          id="middleName"
          placeholder="Enter your middle name"
          type="text"
          label="Middle Name"
        />
        <InputEle id="gender" type="gender" label="Gender" />
        <InputEle id="dob" type="date" label="Date of birth" />
        <InputEle id="maritalStatus" type="marriage" label="Marital Status" />
        <InputEle id="nationality" type="country" label="Nationality" />
        <InputEle
          id="state"
          type="text"
          label="State of origin"
          placeholder="Enter your state of origin"
        />
        <InputEle
          id="lga"
          type="text"
          label="LGA of origin"
          placeholder="Enter your LGA of origin"
        />
      </div>
    </div>
  );
}

export default Personal;
