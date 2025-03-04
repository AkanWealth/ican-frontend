"use client";
import React from "react";
import { BiodataFormData } from "../Biodata";

interface PaymentProps {
  formData: BiodataFormData;
  updateFormData: (data: Partial<BiodataFormData>) => void;
}

function Payment({ formData, updateFormData }: PaymentProps) {
  return (
    <div className="pt-4 flex flex-col justify-between gap-4 ">
      <h3 className="font-bold font-mono text-2xl text-black ">
        PAYMENT <hr />
      </h3>

      <p>To complete your registration, you need to make payments</p>

      <div className=" w-full h-fit flex flex-col gap-3">
        <label
          className=" text-base font-sans font-semibold  "
          htmlFor="currentJob"
        >
          Select Payment Option  <span className="text-red-600">*</span>
        </label>
        <input
          className=" p-3 rounded border border-gray-400  "
          placeholder="Enter your current job"
          name="currentJob"
          id="currentJob"
          required
          type="text"
        />
        <p></p>
      </div>
      <div className=" w-full h-fit flex flex-col gap-3">
        <label
          className=" text-base font-sans font-semibold  "
          htmlFor="companyName"
        >
          Company Name <span className="text-red-600">*</span>
        </label>
        <input
          className=" p-3 rounded border border-gray-400  "
          placeholder="Enter your company name"
          name="companyName"
          id="companyName"
          required
          type="text"
        />
        <p></p>
      </div>
      <div className="grid grid-cols-2  gap-10 ">
        <div className=" w-full h-fit flex flex-col gap-3">
          <label
            className=" text-base font-sans font-semibold  "
            htmlFor="department"
          >
            Department <span className="text-red-600">*</span>
          </label>
          <input
            className=" p-3 rounded border border-gray-400  "
            placeholder="Enter your middle name"
            name="department"
            id="department"
            required
            type="text"
          />
          <p></p>
        </div>
        <div className=" w-full h-fit flex flex-col gap-3">
          <label
            className=" text-base font-sans font-semibold  "
            htmlFor="currentPosition"
          >
            Current Position <span className="text-red-600">*</span>
          </label>
          <input
            className=" p-3 rounded border bg-white border-gray-400  "
            name="currentPosition"
            id="currentPosition"
            required
            type="text"
          />

          <p></p>
        </div>
        <div className=" w-full h-fit flex flex-col gap-3">
          <label
            className=" text-base font-sans font-semibold  "
            htmlFor="startDate"
          >
            Start Date <span className="text-red-600">*</span>
          </label>
          <input
            className=" p-3 rounded border border-gray-400  "
            name="startDate"
            id="startDate"
            required
            type="date"
          />
          <p></p>
        </div>
      </div>
    </div>
  );
}

export default Payment;
