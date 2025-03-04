"use client";
import React, { useState } from "react";

// import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import { BiodataFormData } from "../Biodata";
import InputEle from "../genui/InputEle";

interface ContactProps {
  formData: BiodataFormData;
  updateFormData: (data: Partial<BiodataFormData>) => void;
}

function Contact({ formData, updateFormData }: ContactProps) {
  return (
    <div className="pt-4 flex flex-col justify-between gap-4 ">
      <h3 className="font-bold font-mono text-2xl text-black ">
        CONTACT DETAILS
        <hr />
      </h3>

      <div className="flex flex-col w-full gap-10 ">
        <InputEle
          id="contactAddress"
          placeholder="Enter your contact address"
          type="text"
          label="Contact Address"
          addStyle="col-span-2"
        />

        <div className="grid grid-cols-2 gap-4 ">
          <InputEle
            id="contactCountry"
            type="country"
            label=" Contact Country"
          />
          <InputEle
            id="contactState"
            placeholder="Enter your Contact state"
            type="text"
            label="Contact state"
          />
          <InputEle
            id="contactCity"
            placeholder="Enter your Contact city"
            type="text"
            label="Contact City"
          />
          <InputEle
            id="email"
            placeholder="Enter your email address"
            type="email"
            label="Email Address"
          />
          <InputEle id="mobileNumber" type="phone" label="Mobile Number" />
          <InputEle
            id="residentialAddress"
            placeholder="Enter your residential address"
            type="text"
            label="Residential Address"
          />
          <InputEle
            id="residentialCountry"
            type="country"
            label=" Residential Country"
          />
          <InputEle
            id="residentialState"
            placeholder="Enter your residential state"
            type="text"
            label="Residential State"
          />
          <InputEle
            id="residentialLga"
            placeholder="Enter your residential LGA"
            type="text"
            label="Residential LGA"
          />
          <InputEle
            id="residentialTelephone"
            type="phone"
            label="Residential Telephone"
          />
          <InputEle
            id="officeAddress"
            placeholder="Enter your office address"
            type="text"
            label="Office Address"
          />
          <InputEle id="officeCountry" type="country" label="Office Country" />
          <InputEle
            id="officeState"
            placeholder="Enter your office state"
            type="text"
            label="Office State"
          />
          <InputEle
            id="officeCity"
            placeholder="Enter your office city"
            type="text"
            label="Office City"
          />
          <InputEle
            id="officeLga"
            placeholder="Enter your office LGA"
            type="text"
            label="Office Lga"
          />
          <InputEle
            id="officeTelephone"
            type="phone"
            label="Office Telephone"
          />
        </div>
      </div>
    </div>
  );
}

export default Contact;
