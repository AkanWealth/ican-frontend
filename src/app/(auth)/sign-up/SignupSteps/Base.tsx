"use client";

import React, { useState } from "react";
// import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

interface PropsVal {
  onNext: (email: string) => void;
}

function Base({ onNext }: PropsVal) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [fname, setFname] = useState(false);
  const [sname, setSname] = useState(false);
  const [evalid, setEvalid] = useState(false);
  const [plength, setPlength] = useState(false);
  const [pupper, setPupper] = useState(false);
  const [plower, setPlower] = useState(false);
  const [pnumber, setPnumber] = useState(false);
  const [pspecial, setPspecial] = useState(false);
  const [cvalid, setCvalid] = useState(false);
  const [consent, setConsent] = useState(false);
  const [complete, setComplete] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    consent: false,
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    surname: "",
    email: "",
    password: "",
    cpassword: "",
    consent: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateFirstName = (firstName: string): string => {
    const nameRegex = /^[a-zA-Z0-9]+$/;
    if (firstName.length < 3) {
      setFname(false);
      return "First name must be at least 3 characters long.";
    }
    if (!nameRegex.test(firstName)) {
      setFname(false);
      return "First name must contain only alphanumeric characters.";
    }
    setFname(true);
    return "";
  };

  const validateSurname = (surname: string): string => {
    const nameRegex = /^[a-zA-Z0-9]+$/;
    if (surname.length < 3) {
      setSname(false);
      return "Surname must be at least 3 characters long.";
    }
    if (!nameRegex.test(surname)) {
      setSname(false);
      return "Surname must contain only alphanumeric characters.";
    }
    setSname(true);
    return "";
  };

  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEvalid(false);
      return "Invalid email address.";
    }
    setEvalid(true);
    return "";
  };

  const validatePassword = (password: string): string => {
    // Reset all password validation states
    setPlength(false);
    setPupper(false);
    setPlower(false);
    setPnumber(false);
    setPspecial(false);

    // Check length
    if (password.length < 8) {
      setPlength(false);
    } else {
      setPlength(true);
    }

    if (!/[A-Z]/.test(password)) {
      setPupper(false);
    } else {
      setPupper(true);
    }

    // Check lowercase
    if (!/[a-z]/.test(password)) {
      setPlower(false);
    } else {
      setPlower(true);
    }

    // Check number
    if (!/\d/.test(password)) {
      setPnumber(false);
    } else {
      setPnumber(true);
    }

    // Check special character
    if (!/[@$!%*?&]/.test(password)) {
      setPspecial(false);
    } else {
      setPspecial(true);
    }

    return "";
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ): string => {
    if (confirmPassword !== password) {
      setCvalid(false);
      return "Passwords do not match.";
    }
    setCvalid(true);
    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    let error = "";
    switch (name) {
      case "firstName":
        error = validateFirstName(value);
        break;
      case "surname":
        error = validateSurname(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        validatePassword(value);
        break;
      case "confirmPassword":
        error = validateConfirmPassword(formData.password, value);
        break;
      case "consent":
        setConsent(checked);
        break;
    }

    // Update form errors
    setFormErrors({
      ...formErrors,
      [name]: error,
    });
    
    console.log('Validation States:', {
      fname, 
      sname, 
      evalid, 
      plength, 
      pupper, 
      plower, 
      pnumber, 
      pspecial, 
      cvalid, 
      consent
    });
  

    // Check if all validations are met
    const isComplete = 
      fname && sname && evalid && 
      plength && pupper && plower && 
      pnumber && pspecial && 
      cvalid && consent;
    
    setComplete(isComplete);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Perform validation on all fields
    const errors = {
      firstName: validateFirstName(formData.firstName),
      surname: validateSurname(formData.surname),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      cpassword: validateConfirmPassword(formData.password, formData.confirmPassword),
      consent: formData.consent ? "" : "You must agree to the terms and conditions.",
    };

    setFormErrors(errors);

    const hasErrors = Object.values(errors).some(error => error !== "");

    if (hasErrors) {
      setLoading(false);
      return;
    }

    // const data = JSON.stringify({
    //   firstName: formData.firstName,
    //   lastName: formData.surname,
    //   email: formData.email,
    //   password: formData.password,
    // });

    // const config = {
    //   method: "post",
    //   maxBodyLength: Infinity,
    //   url: "https://ican-sds-api.onrender.com/api/v1/auth/register",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   data: data,
    // };

    // try {
    //   const response = await axios.request(config);
    //   onNext(formData.email);
    //   toast({
    //     title: "Registration Successful",
    //     description: "Please verify your email",
    //     variant: "default"
    //   });
    // } catch (error) {
    //   toast({
    //     title: "Registration Failed",
    //     description: "An error occurred during registration.",
    //     variant: "destructive"
    //   });
    // } finally {
    //   setLoading(false);
    // }
    setTimeout(() => {
      // Simulate successful registration
      toast({
        title: "Registration Successful",
        description: "Please verify your email",
        variant: "default"
      });
  
      // Move to verification page
      onNext(formData.email);
  
      setLoading(false);
    }, 1500);
  };

  return (
    <>
    
      <Image src="/Logo_big.png" alt="Logo" width={140} height={40} className=""/>
      <div className="w-fit">
        <h4 className="text-primary text-center text-xl font-bold font-mono">
          Create Account
        </h4>
        <p className="text-base font-normal font-sans">
          Welcome, Let&apos;s get started
        </p>
      </div>
      <form className="w-full flex flex-col gap-4" onSubmit={handleSignup}>
        {/* First Name */}
        <div className="w-full flex flex-col">
          <label
            className="text-base font-sans font-semibold"
            htmlFor="firstName"
          >
            First Name <span className="text-red-600">*</span>
          </label>
          <input
            className={`p-3 rounded border ${
              formErrors.firstName ? 'border-red-500' : 'border-gray-400'
            }`}
            placeholder="Enter your first name"
            name="firstName"
            id="firstName"
            required
            type="text"
            value={formData.firstName}
            onChange={handleChange}
          />
          {formErrors.firstName && (
            <p className="text-red-600 text-sm">{formErrors.firstName}</p>
          )}
        </div>

        {/* Surname */}
        <div className="w-full flex flex-col">
          <label
            className="text-base font-sans font-semibold"
            htmlFor="surname"
          >
            Surname <span className="text-red-600">*</span>
          </label>
          <input
            className={`p-3 rounded border ${
              formErrors.surname ? 'border-red-500' : 'border-gray-400'
            }`}
            placeholder="Enter your surname"
            name="surname"
            id="surname"
            required
            type="text"
            value={formData.surname}
            onChange={handleChange}
          />
          {formErrors.surname && (
            <p className="text-red-600 text-sm">{formErrors.surname}</p>
          )}
        </div>

        {/* Email */}
        <div className="w-full flex flex-col">
          <label
            className="text-base font-sans font-semibold"
            htmlFor="email"
          >
            Email <span className="text-red-600">*</span>
          </label>
          <input
            className={`p-3 rounded border ${
              formErrors.email ? 'border-red-500' : 'border-gray-400'
            }`}
            placeholder="Enter your email address"
            name="email"
            id="email"
            required
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          {formErrors.email && (
            <p className="text-red-600 text-sm">{formErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="w-full flex flex-col">
          <label
            className="text-base font-sans font-semibold"
            htmlFor="password"
          >
            Password <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-[.8rem] text-gray-400 text-md" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Create a password"
              className={`w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 ${
                formErrors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-400 focus:ring-blue-400'
              }`}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-gray-400 text-md focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="pt-4">
            <p className="text-xs text-gray-500">
              Must be at least{" "}
              <span
                className={plength ? "text-green-500" : "text-gray-500"}
              >
                8 characters long,{" "}
              </span>
              including{" "}
              <span
                className={pupper ? "text-green-500" : "text-gray-500"}
              >
                upper case,{" "}
              </span>
              <span
                className={plower ? "text-green-500" : "text-gray-500"}
              >
                lower case,{" "}
              </span>
              <span
                className={pnumber ? "text-green-500" : "text-gray-500"}
              >
                one number,{" "}
              </span>
              <span
                className={pspecial ? "text-green-500" : "text-gray-500"}
              >
                one symbol.
              </span>
            </p>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="w-full flex flex-col">
        <label
          className="text-base font-sans font-semibold"
          htmlFor="cpassword"
        >
          Confirm Password <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <FaLock className="absolute left-3 top-[.8rem] text-gray-400 text-md" />
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm password"
            className={`w-full pl-10 pr-10 py-3 border rounded focus:outline-none focus:ring-2 ${
              formErrors.cpassword ? 'border-red-500 focus:ring-red-400' : 'border-gray-400 focus:ring-blue-400'
            }`}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-3 text-gray-400 text-md focus:outline-none"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {formErrors.cpassword && (
          <p className="text-red-600 text-sm">{formErrors.cpassword}</p>
        )}
      </div>

        {/* Consent Checkbox */}
        <div className="flex flex-row justify-between gap-2 items-center">
          <input
            type="checkbox"
            name="consent"
            id="consent"
            checked={formData.consent}
            onChange={handleChange}
          />
          <p className="text-xs">
            By creating an account, I agree and consent to receive communications 
            and updates about ICAN Institute products and services. I have reviewed 
            and acknowledged the Privacy Policy along with the Terms and Conditions therein.
          </p>
        </div>
        {formErrors.consent && (
          <p className="text-red-600 text-sm">{formErrors.consent}</p>
        )}

        <button
          disabled={complete || loading}
          className="px-8 py-4 bg-primary disabled:bg-slate-500 rounded-full text-white text-base font-semibold"
          type="submit"
        >
          {loading ? "Submitting..." : "Create Account"}
        </button>
      </form>
      <p className="text-base font-medium">
        Already have an account?{" "}
        <Link className="text-primary" href="/login">
          Login Here
        </Link>
      </p>
    </>
  );
}

export default Base;