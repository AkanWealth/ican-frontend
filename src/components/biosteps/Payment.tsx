"use client";
import React from "react";
import { BiodataFormData } from "../Biodata";
import InputEle from "../genui/InputEle";

interface PaymentProps {
  formData: BiodataFormData;
  updateFormData: (data: Partial<BiodataFormData>) => void;
}

function Payment({ formData, updateFormData }: PaymentProps) {
  return (
    <div className="pt-4 flex flex-col justify-between gap-4 mt-4">
      <h3 className="font-bold font-mono text-xl text-black ">
        PAYMENT <hr />
      </h3>

      <p>To complete your registration, you need to make payments</p>

      <div className="w-full h-fit flex flex-col gap-3">
       <label className="font-semibold text-sm">Select Payment Option<span className="text-red-500">*</span></label>
       <div className="grid lg:grid-cols-3 md:grid-row gap-4">
        <InputEle
         id="PaymentOption"
         type="radio"
         label="Card"
        />
        <InputEle
         id="PaymentOption"
         type="radio"
         label="BankDeposit/Transfer"
        />
        <InputEle
         id="PaymentOption"
         type="radio"
         label="Waiver"
        />
       </div>
        <InputEle
         id="Amount"
         placeholder="#25000"
         type="amount"
         label="Total amount due"
         />
      </div>
    </div>
  );
}

export default Payment;
