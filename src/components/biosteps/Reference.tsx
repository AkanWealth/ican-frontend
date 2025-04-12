"use client";
import React from "react";
import { BiodataFormData } from "../Biodata";

import InputEle from "../genui/InputEle";

interface ReferenceProps {
  formData: BiodataFormData;
  updateFormData: (data: Partial<BiodataFormData>) => void;
}

function Reference({ formData, updateFormData }: ReferenceProps) {
  return (
    <div className="pt-4 flex flex-col justify-between gap-4 ">
      <h3 className="font-bold font-mono text-2xl text-black ">
        REFERENCE <hr />
      </h3>
      <InputEle
        id="refereeName"
        placeholder="Enter your Referee Name"
        type="text"
        label="Referee Name"
      />

      <div className="grid grid-cols-2  gap-10 ">
        <InputEle
          id="refereeIcanNo"
          placeholder="Enter your Referee's ICAN Membership Number"
          type="text"
          label="Referee's ICAN Membership Number"
        />
        <InputEle
          id="refereePhone"
          type="phone"
          label="Referee's Phone Number"
        />
        <InputEle
          id="refereeEmail"
          type="email"
          label="Referee's Email Address"
          placeholder="example@gmail.com"
        />

      
      </div>
    </div>
  );
}

export default Reference;
