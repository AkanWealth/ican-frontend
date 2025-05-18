"use client";

import React, { useState } from "react";
import Image from "next/image";
import { RiErrorWarningLine } from "react-icons/ri";

function Dontoday() {
  const [isHovered, setIsHovered] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

  const validateForm = () => {
    let errors = {};

    if (!name) {
      errors.name = "Name is required.";
    }

    if (!email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid.";
    }

    if (!phone) {
      errors.phone = "Phone number is required.";
    } else if (phone.length < 10) {
      errors.phone = "Phone number must be at least 10 digits.";
    }

    if (!amount) {
      errors.amount = "Amount is required.";
    } else if (isNaN(amount) || Number(amount) <= 0) {
      errors.amount = "Amount must be a valid positive number.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form from reloading the page
    const isValid = validateForm();

    if (isValid) {
      setIsFormValid(true);
      console.log("Form submitted successfully!");

      // Show success message
      setSuccessMessage("Thank you for your donation!");

      // Clear form inputs
      setName("");
      setEmail("");
      setPhone("");
      setAmount("");
      setErrors({});

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    } else {
      setIsFormValid(false);
      console.log("Form has errors. Please correct them.");
    }
  };

  const handleAmountChange = (event) => {
    const value = event.target.value;
    // Allow only digits
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <div className="p-4 sm:p-20 lg:px-40 flex flex-col w-full gap-16">
      <div className="items-center text-center flex flex-col gap-4">
        <h2 className="w-fit max-w-[700px] font-bold text-3xl sm:text-4xl text-primary font-mono">
          Donate securely today and support our mission
        </h2>
        <p className="text-gray-800 text-base font-normal font-sans">
          Your donations support the growth and development of accounting
          professionals, as well as community outreach programs.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-20">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-xl flex-col gap-2 sm:gap-8 justify-start items-end"
        >
          <div className="flex flex-col w-full gap-3">
            <label className="text-base text-black" htmlFor="name">
              Name*
            </label>
            <input
              className="p-3 border rounded-xl border-gray-400"
              type="text"
              name="name"
              value={name}
              required
              placeholder="Enter your first and last name"
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="inline-flex gap-2 items-center text-red-600">
                <RiErrorWarningLine className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>
          <div className="flex flex-col w-full gap-3">
            <label className="text-base text-black" htmlFor="email">
              Email address*
            </label>
            <input
              className="p-3 border rounded-xl border-gray-400"
              type="email"
              value={email}
              name="email"
              required
              placeholder="Enter your email address"
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="inline-flex gap-2 items-center text-red-600">
                <RiErrorWarningLine className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>
          <div className="flex flex-col w-full gap-3">
            <label className="text-base text-black" htmlFor="phone">
              Phone number*
            </label>
            <input
              className="p-3 border rounded-xl border-gray-400"
              type="text"
              name="phone"
              required
              value={phone}
              placeholder="Enter your phone number"
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && (
              <p className="inline-flex gap-2 items-center text-red-600">
                <RiErrorWarningLine className="w-4 h-4" />
                {errors.phone}
              </p>
            )}
          </div>
          <div className="flex flex-col w-full gap-3">
            <label className="text-base text-black" htmlFor="donate">
              Amount to Donate*
            </label>
            <input
              className="p-3 border rounded-xl border-gray-400"
              type="text"
              name="amount"
              required
              value={amount}
              onChange={handleAmountChange}
              placeholder="How much would you like to donate?"
            />
            {errors.amount && (
              <p className="inline-flex gap-2 items-center text-red-600">
                <RiErrorWarningLine className="w-4 h-4" />
                {errors.amount}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`${
              isFormValid ? "opacity-100" : "opacity-50"
            } rounded-full text-white bg-primary py-4 px-8 transition-transform duration-300 transform ${
              isHovered ? "scale-105" : "scale-100"
            } sm:py-3 sm:px-6`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Donate
          </button>
        </form>
        <Image
          height={480}
          width={480}
          src="/donateheart.png"
          alt=""
          className="hidden sm:block sm:w-full sm:h-fit max-w-96"
        />
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="mt-4 hidden text-center text-green-600 font-bold">
          {successMessage}
        </div>
      )}
    </div>
  );
}

export default Dontoday;
