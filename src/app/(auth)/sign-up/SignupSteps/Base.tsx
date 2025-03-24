"use client";

import React, { useState } from "react";
// import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import InputEle from "@/components/genui/InputEle";
import { useToast } from "@/hooks/use-toast";
import Toast from "@/components/genui/Toast";

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
    membershipId: "",
    consent: false,
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    membershipId: "",
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

    console.log("Validation States:", {
      fname,
      sname,
      evalid,
      plength,
      pupper,
      plower,
      pnumber,
      pspecial,
      cvalid,
      consent,
    });

    // Check if all validations are met
    const isComplete =
      fname &&
      sname &&
      evalid &&
      plength &&
      pupper &&
      plower &&
      pnumber &&
      pspecial &&
      cvalid &&
      consent;

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
      confirmPassword: validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      ),
      membershipId: formData.membershipId
        ? ""
        : "Membership ID is required.",
      consent: formData.consent
        ? ""
        : "You must agree to the terms and conditions.",
    };

    setFormErrors(errors);

    const hasErrors = Object.values(errors).some((error) => error !== "");

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
      //       return <Toast type="success" message={response.data.message} />;

      // Move to verification page
      onNext(formData.email);

      setLoading(false);
    }, 1500);
  };

  return (
    <>
      <Image
        src="/Logo_big.png"
        alt="Logo"
        width={143}
        height={60}
        className="mt-40"
      />
      <div className="w-fit">
        <h4 className="text-primary text-center text-3xl font-bold font-mono">
          Create Account
        </h4>
        <p className="text-base font-normal font-sans">
          Welcome, Let&apos;s get started
        </p>
      </div>
      <form className="w-full flex flex-col gap-4" onSubmit={handleSignup}>
        {/* First Name */}

        <InputEle
          label="First Name"
          id="firstName"
          type="text"
          required
          placeholder="Enter your first name"
          value={formData.firstName}
          onChange={handleChange}
          errorMsg={formErrors.firstName}
        />
        {/* Surname */}
        <InputEle
          label="Surname"
          id="surname"
          type="text"
          required
          placeholder="Enter your Surname"
          value={formData.surname}
          onChange={handleChange}
          errorMsg={formErrors.surname}
        />

        {/* Email */}
        <InputEle
          label="Email"
          id="email"
          type="email"
          required
          placeholder="Enter your Email"
          value={formData.email}
          onChange={handleChange}
          errorMsg={formErrors.email}
        />
        {/* Membership ID */}
        <InputEle
          label="Membership ID"
          id="membershipId"
          type="text"
          required
          placeholder="Enter your Membership ID"
          value={formData.membershipId}
          onChange={handleChange}
          errorMsg={formErrors.membershipId}
        />

        {/* Password */}
        <InputEle
          label="Password"
          id="password"
          type="password"
          required
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          errorMsg={formErrors.password}
        />

        {/* Confirm Password */}
        <InputEle
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          required
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          errorMsg={formErrors.confirmPassword}
        />

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
            By creating an account, I agree and consent to receive
            communications and updates about ICAN Institute products and
            services. I have reviewed and acknowledged the Privacy Policy along
            with the Terms and Conditions therein.
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
