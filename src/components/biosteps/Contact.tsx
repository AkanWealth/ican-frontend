"use client";
import React, { useState } from "react";
import { BiodataFormData } from "../homecomps/Biodata";
import InputEle from "../genui/InputEle";

interface ContactProps {
  isShown: boolean;
  formData: BiodataFormData;
  updateFormData: (data: Partial<BiodataFormData>) => void;
}

function Contact({ isShown, formData, updateFormData }: ContactProps) {
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
      contactDetails: {
        ...formData.contactDetails,
        [id]: value,
      },
    });
    console.log(e);
    console.log(formData);
  };
  return (
    <div className="pt-4 flex flex-col justify-between gap-4 mt-4">
      <h3 className="font-bold font-mono text-xl text-black ">
        CONTACT DETAILS
        <hr />
      </h3>

      <div className="flex flex-col w-full gap-10 ">
        {/* <InputEle
          id="contactAddress"
          placeholder="Enter your contact address"
          type="text"
          label="Contact Address"
          addStyle="col-span-2"
        /> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
          {/* <InputEle
            id="contactCountry"
            type="country"
            label=" Contact Country"
            onChange={handleChange}
            value={formData.contactDetails.contactCountry}
          />
          <InputEle
            id="contactState"
            placeholder="Enter your Contact state"
            type="text"
            label="Contact state"
            onChange={handleChange}
            value={formData.contactDetails.contactState}
          />
          <InputEle
            id="contactCity"
            placeholder="Enter your Contact city"
            type="text"
            label="Contact City"
            onChange={handleChange}
            value={formData.contactDetails.contactCity}
          />
          <InputEle
            id="email"
            placeholder="Enter your email address"
            type="email"
            label="Email Address"
          /> */}
          <InputEle
            id="residentialAddress"
            placeholder="Enter your residential address"
            type="text"
            label="Residential Address"
            required={true}
            onChange={handleChange}
            value={formData.contactDetails?.residentialAddress}
          />
          <InputEle
            id="mobileNumber"
            type="phone"
            label="Contact Phone Number"
            onChange={handleChange}
            value={formData.contactDetails?.mobileNumber}
          />

          <InputEle
            id="residentialCountry"
            type="country"
            label=" Residential Country"
            onChange={handleChange}
            value={formData.contactDetails?.residentialCountry}
          />
          <InputEle
            id="residentialCity"
            placeholder="Enter your residential city"
            type="text"
            label=" Residential City"
            onChange={handleChange}
            value={formData.contactDetails?.residentialCity}
          />
          <InputEle
            id="residentialState"
            placeholder="Enter your residential state"
            type="text"
            label="Residential State"
            onChange={handleChange}
            required={true}
            value={formData.contactDetails?.residentialState}
          />
          <InputEle
            id="residentialLga"
            placeholder="Enter your residential LGA"
            type="text"
            label="Residential LGA"
            onChange={handleChange}
            required={true}
            value={formData.contactDetails?.residentialLga}
          />
          {/* <InputEle
            id="residentialTelephone"
            type="phone"
            label="Residential Telephone"
            onChange={handleChange}
            required={false}
            value={formData.contactDetails?.residentialTelephone}
          />
          <InputEle
            id="officeAddress"
            placeholder="Enter your office address"
            type="text"
            label="Office Address"
            onChange={handleChange}
            required={false}
            value={formData.contactDetails?.officeAddress}
          />
          <InputEle
            id="officeCountry"
            type="country"
            label="Office Country"
            onChange={handleChange}
            required={false}
            value={formData.contactDetails?.officeCountry}
          />
          <InputEle
            id="officeState"
            placeholder="Enter your office state"
            type="text"
            label="Office State"
            onChange={handleChange}
            required={false}
            value={formData.contactDetails?.officeState}
          />
          <InputEle
            id="officeCity"
            placeholder="Enter your office city"
            type="text"
            label="Office City"
            onChange={handleChange}
            required={false}
            value={formData.contactDetails?.officeCity}
          />
          <InputEle
            id="officeLga"
            placeholder="Enter your office LGA"
            type="text"
            label="Office Lga"
            onChange={handleChange}
            required={false}
            value={formData.contactDetails?.officeLga}
          />
          <InputEle
            id="officeTelephone"
            type="phone"
            label="Office Telephone"
          /> */}
        </div>
      </div>
    </div>
  );
}

export default Contact;
