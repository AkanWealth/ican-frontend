"use client";
import React from "react";
import { BiodataFormData } from "../Biodata";
import InputEle from "../genui/InputEle";

interface QualificationsProps {
  formData: BiodataFormData;
  updateFormData: (data: Partial<BiodataFormData>) => void;
}

function Qualifications({ formData, updateFormData }: QualificationsProps) {
  return (
    <div className="w-full pt-4 flex flex-col justify-between gap-4 mt-4">
      <h3 className="w-full font-bold font-mono text-xl text-black ">
        EDUCATION AND PROFESSIONAL QUALIFICATION
        <hr />
      </h3>

      <div className="w-full grid lg:grid-cols-2 md:grid-col-1  lg:gap-10 md:gap-5">
        <InputEle
          id="insitution"
          placeholder="Enter your Insitution"
          type="text"
          label="Insitution"
        />
        <InputEle
          id="discipline"
          placeholder="Enter your Discipline"
          type="text"
          label="Discipline"
        />
        <InputEle
          id="qualification"
          placeholder="Enter your qualification"
          type="status"
          label="Qualification"
        />
        <InputEle id="graduation" type="number" label="Year of Graduation" />
        <InputEle
          id="Status"
          type="status"
          label="Status"
        />
        {/* <InputEle
          id="firstQualDate"
          type="number"
          label="Year of First Qualification"
        />
        <InputEle
          id="secQualName"
          type="text"
          label="Second professional Qualification"
        />
        <InputEle
          id="secQualDate"
          type="number"
          label="Year of Second Qualification"
        /> */}
      </div>
    </div>
  );
}

export default Qualifications;
