"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import InputEle from "@/components/genui/InputEle";
import Toast from "@/components/genui/Toast";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

function Signup() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [fname, setFname] = useState(false);
  const [sname, setSname] = useState(false);
  const [evalid, setEvalid] = useState(false);
  const [midValid, setMidValid] = useState(true); // Set this to true by default since no validation is needed
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
    membershipId: "",
    password: "",
    cpassword: "",
    consent: false,
  });
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    surname: "",
    email: "",
    membershipId: "",
    password: "",
    confirmPassword: "",
    consent: "",
  });
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const validateMembershipId = (id: string): string => {
    return "";
  };
  const checkFormCompleteness = useCallback(() => {
    const isComplete =
      fname &&
      sname &&
      evalid &&
      midValid &&
      plength &&
      pupper &&
      plower &&
      pnumber &&
      pspecial &&
      cvalid &&
      formData.consent;

    setComplete(isComplete);
  }, [
    fname,
    sname,
    evalid,
    midValid,
    plength,
    pupper,
    plower,
    pnumber,
    pspecial,
    cvalid,
    formData.consent,
  ]);
  // Use useEffect to ensure state updates are complete before checking form completeness
  useEffect(() => {
    checkFormCompleteness();
  }, [checkFormCompleteness]);
  const validateFirstName = (firstName: string): string => {
    const nameRegex = /^[a-zA-Z0-9]+$/;
    if (firstName.length < 3) {
      return "First name must be at least 3 characters long.";
    }
    if (!nameRegex.test(firstName)) {
      return "First name must contain only alphanumeric characters.";
    }
    return "";
  };

  const validateSurname = (lastName: string): string => {
    const nameRegex = /^[a-zA-Z0-9]+$/;
    if (lastName.length < 3) {
      return "Surname must be at least 3 characters long.";
    }
    if (!nameRegex.test(lastName)) {
      return "Surname must contain only alphanumeric characters.";
    }
    return "";
  };

  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email address.";
    }
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

    // Return error message only if all criteria are not met
    if (!(plength && pupper && plower && pnumber && pspecial)) {
      return "Password does not meet all requirements.";
    }

    return "";
  };

  const validateConfirmPassword = (
    password: string,
    cpassword: string
  ): string => {
    if (cpassword !== password) {
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
      case "membershipId":
        // No validation needed, just clear any previous errors
        error = "";
        break;
      case "password":
        error = validatePassword(value);
        // Also update confirm password validation when password changes
        if (formData.confirmPassword) {
          const confirmError = validateConfirmPassword(
            value,
            formData.confirmPassword
          );
          setFormErrors({
            ...formErrors,
            confirmPassword: confirmError,
          });
        }
        break;
      case "confirmPassword":
        error = validateConfirmPassword(formData.password, value);
        break;
      case "consent":
        setConsent(checked);
        if (!checked) {
          error = "You must agree to the terms and conditions.";
        }
        break;
    }

    // Update form errors but don't show them until form is submitted
    setFormErrors({
      ...formErrors,
      [name]: error,
    });

    // Check form completeness after state update
    checkFormCompleteness();
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Run all validations to ensure we have current errors
    const errors = {
      firstName: validateFirstName(formData.firstName),
      surname: validateSurname(formData.surname),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      ),
      membershipId: formData.membershipId ? "" : "Membership ID is required.",
      consent: formData.consent
        ? ""
        : "You must agree to the terms and conditions.",
    };

    setFormErrors(errors);

    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (hasErrors) {
      return; // Don't proceed with submission
    }

    setLoading(true);

    const data = JSON.stringify({
      firstname: formData.firstName,
      surname: formData.surname,
      email: formData.email,
      membershipId: formData.membershipId,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://ican-api-6000e8d06d3a.herokuapp.com/api/auth/register",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      const { message, user, access_token } = response.data;
      console.log("User registered successfully:", user);
      console.log("Access token:", access_token);

      toast({
        title: "Registration Successful",
        description: message,
        variant: "default",
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto">
      <div className="flex flex-col lg:w-96 md:w-60  items-center rounded-2xl bg-white p-8  sshadow-lg">
        <>
          <Image
            src="/Logo_big.png"
            alt="Logo"
            width={140}
            height={40}
            className=""
          />
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
                  formSubmitted && formErrors.firstName
                    ? "border-red-500"
                    : "border-gray-400"
                }`}
                placeholder="Enter your first name"
                name="firstName"
                id="firstName"
                required
                type="text"
                value={formData.firstName}
                onChange={handleChange}
              />
              {formSubmitted && formErrors.firstName && (
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
                  formSubmitted && formErrors.surname
                    ? "border-red-500"
                    : "border-gray-400"
                }`}
                placeholder="Enter your surname"
                name="surname"
                id="surname"
                required
                type="text"
                value={formData.surname}
                onChange={handleChange}
              />
              {formSubmitted && formErrors.surname && (
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
                  formSubmitted && formErrors.email
                    ? "border-red-500"
                    : "border-gray-400"
                }`}
                placeholder="Enter your email address"
                name="email"
                id="email"
                required
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              {formSubmitted && formErrors.email && (
                <p className="text-red-600 text-sm">{formErrors.email}</p>
              )}
            </div>

            {/* Membership ID - No validation */}
            <div className="w-full flex flex-col">
              <label
                className="text-base font-sans font-semibold"
                htmlFor="membershipId"
              >
                Membership ID <span className="text-red-600">*</span>
              </label>
              <input
                className="p-3 rounded border border-gray-400"
                placeholder="Enter your membership ID"
                name="membershipId"
                id="membershipId"
                required
                type="text"
                value={formData.membershipId}
                onChange={handleChange}
              />
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
                    formSubmitted && formErrors.password
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-400 focus:ring-blue-400"
                  }`}
                  value={formData.password}
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
                  <span className={pupper ? "text-green-500" : "text-gray-500"}>
                    upper case,{" "}
                  </span>
                  <span className={plower ? "text-green-500" : "text-gray-500"}>
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
              {formSubmitted && formErrors.password && (
                <p className="text-red-600 text-sm">{formErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="w-full flex flex-col">
              <label
                className="text-base font-sans font-semibold"
                htmlFor="confirmPassword"
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
                    formSubmitted && formErrors.confirmPassword
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-400 focus:ring-blue-400"
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
              {formSubmitted && formErrors.confirmPassword && (
                <p className="text-red-600 text-sm">
                  {formErrors.confirmPassword}
                </p>
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
                By creating an account, I agree and consent to receive
                communications and updates about ICAN Institute products and
                services. I have reviewed and acknowledged the Privacy Policy
                along with the Terms and Conditions therein.
              </p>
            </div>

            {formSubmitted && formErrors.consent && (
              <p className="text-red-600 text-sm">{formErrors.consent}</p>
            )}


            <button
              disabled={!complete || loading}
              className={`px-8 py-4 rounded-full text-white text-base font-semibold ${
                !complete || loading ? "bg-slate-500" : "bg-primary"
              }`}
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
      </div>
    </div>
  );
}

export default Signup;
