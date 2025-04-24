"use client";

import React, { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import InputEle from "../genui/InputEle";

import { BASE_API_URL } from "@/utils/setter";
import { title } from "process";

// get in touch form used on the contact us page of the design
function Getin({ heading, phoneNumber = true, className }) {
  const { toast } = useToast();

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

  const handleSubmit = async (e) => {
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

      const data = JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/contact-us`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: data,
      };
    }

    try {
      const response = await axios.request(config);
      console.log("Sending:", response);

      toast({
        title: "Message sent",
        description: "The message has been sent successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Sending:", error);
      toast({
        title: "Error",
        description: "An error occurred while sending the message.",
        variant: "destructive",
      });
    } finally {
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    }
  };

  return (
    <div
      className={` p-4 md:p-20 lg:px-40 flex flex-col w-full gap-16 ${className} `}
    >
      <div className="w-fit">
        <h2 className="w-fit font-bold text-3xl sm:text-4xl text-primary  font-mono ">
          {heading}
        </h2>
        <p className="  ">
          Feel free to reach out to us with any questions, feedback or
          inquiries. We are here to assist you every step of the way.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 justify-start items-end"
      >
        <InputEle
          id="name"
          type="text"
          placeholder="Enter your first and last name"
          label="Full Name"
          value={formData.name}
          onChange={handleChange}
          errorMsg={formErrors.name}
        />

        <InputEle
          id="email"
          type="text"
          placeholder="Enter email address"
          label="Email Address"
          required
          value={formData.email}
          onChange={handleChange}
          errorMsg={formErrors.email}
        />
        <InputEle
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          label="Phone Number"
          required
          value={formData.phone}
          onChange={handleChange}
          errorMsg={formErrors.phone}
        />

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
