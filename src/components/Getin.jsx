"use client"

import React, { useState } from "react";

// get in touch form used on the contact us page of the design
function Getin({ heading, phoneNumber = true, className }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const validateName = (name) => {
    if (name.length < 3) {
      return "Name must be at least 3 characters long.";
    }
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email address.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    let error = "";
    if (name === "name") {
      error = validateName(value);
    }
    if (name === "email") {
      error = validateEmail(value);
    }

    setFormErrors({
      ...formErrors,
      [name]: error,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);

    setFormErrors({
      name: nameError,
      email: emailError,
    });

    if (!nameError && !emailError) {
      // Submit form
      console.log("Form submitted", formData);
    }
  };

  return (
    <div
      className={` p-4 md:p-20 lg:px-40 flex flex-col w-full gap-16 ${className} `}
    >
      <div className="w-fit">
        <h2 className="w-fit font-bold text-4xl text-primary  font-mono ">
          {heading}
        </h2>
        <p className="  ">
          Feel free to reach out to us with any questions, feedback or
          inquiries. We are here to assist you every step of the way.
        </p>
      </div>
      <form className="flex flex-col gap-8 justify-start items-end" action="">
        <div className="flex flex-col w-full gap-3">
          <label className=" text-base text-black  " htmlFor="name">
            Name*
          </label>
          <input
            className=" p-3 border rounded-xl border-gray-400 "
            type="text"
            required
            name="name"
            placeholder="Enter your first and last name"
            value={formData.name}
            onChange={handleChange}
          />
          {formErrors.name && <p className="text-red-600">{formErrors.name}</p>}
        </div>
        <div className="flex flex-col w-full gap-3 ">
          <label className=" text-base text-black " htmlFor="email">
            Email address*
          </label>
          <input
            className=" p-3 border rounded-xl border-gray-400 "
            type="email"
            required
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
          />
          {formErrors.email && (
            <p className="text-red-600">{formErrors.email}</p>
          )}
        </div>

        {phoneNumber && (
          <div className="flex flex-col w-full gap-3 ">
            <label className=" text-base text-black  " htmlFor="phone">
              Phone number*
            </label>
            <input
              className=" p-3 border rounded-xl border-gray-400 "
              type="tel"
              required
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />
            {formErrors.phone && (
              <p className="text-red-600">{formErrors.phone}</p>
            )}
          </div>
        )}

        <div className="flex flex-col w-full gap-3 ">
          <label className=" text-base text-black  " htmlFor="message">
            Message*
          </label>
          <textarea
            className=" resize-none p-3 border rounded-xl border-gray-400 "
            name="message"
            id="message"
            required
            placeholder="Enter your message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          {formErrors.message && (
            <p className="text-red-600">{formErrors.message}</p>
          )}
        </div>
        <button
          type="submit"
          className=" rounded-full text-white bg-primary py-4 px-8 "
        >
          Send message
        </button>
      </form>
    </div>
  );
}

export default Getin;
