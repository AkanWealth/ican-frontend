"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Toast from "@/components/genui/Toast";
import InputEle from "@/components/genui/InputEle";
import { useRouter } from "next/navigation";

function Signup() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    consent: false,
    membershipId: "",
  });
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    cpassword: "",
    consent: "",
    membershipId: "",
  });

  const [fname, setFname] = useState(false);
  const [sname, setSname] = useState(false);
  const [pvalid, setPvalid] = useState(false);
  const [cvalid, setCvalid] = useState(false);
  const [evalid, setEvalid] = useState(false);
  const [plength, setPlength] = useState(false);
  const [pupper, setPupper] = useState(false);
  const [pnumber, setPnumber] = useState(false);
  const [plower, setPlower] = useState(false);
  const [consent, setConsent] = useState(false);

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
    if (!/[a-z]/.test(password)) {
      setPlower(false);
    } else {
      setPlower(true);
    }
    if (!/\d/.test(password)) {
      setPnumber(false);
    } else {
      setPnumber(true);
    }
    if (!/[@$!%*?&]/.test(password)) {
      setPnumber(false);
    } else {
      setPvalid(true);
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
    if (name === "firstName") {
      error = validateFirstName(value);
      setFname(!error);
    }
    if (name === "lastName") {
      error = validateSurname(value);
      setSname(!error);
    }
    if (name === "email") {
      error = validateEmail(value);
      setEvalid(!error);
    }
    if (name === "password") {
      error = validatePassword(value);
    }
    if (name === "cpassword") {
      error = validateConfirmPassword(formData.password, value);
    }
    if (name === "consent") {
      setConsent(checked);
    }

    setFormErrors({
      ...formErrors,
      [name]: error,
    });

    if (consent && pvalid && cvalid && evalid && fname && sname) {
      setComplete(true);
    } else {
      setComplete(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const firstName = (
      document.getElementById("firstName") as HTMLInputElement
    ).value.trim();
    const lastName = (
      document.getElementById("lastName") as HTMLInputElement
    ).value.trim();
    const email = (
      document.getElementById("email") as HTMLInputElement
    ).value.trim();
    const password = (
      document.getElementById("password") as HTMLInputElement
    ).value.trim();
    const cpassword = (
      document.getElementById("cpassword") as HTMLInputElement
    ).value.trim();
    const membershipId = (
      document.getElementById("membershipId") as HTMLInputElement
    ).value.trim();

    const errors = {
      firstName: validateFirstName(firstName),
      lastName: validateSurname(lastName),
      email: validateEmail(email),
      password: validatePassword(password),
      cpassword: validateConfirmPassword(password, cpassword),
      consent: formData.consent
        ? ""
        : "You must agree to the terms and conditions.",
      membershipId: formData.membershipId ? "" : "Membership ID is required.",
    };

    setFormErrors(errors);
    const data = JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      membershipId: membershipId,
    });
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://ican-api-6000e8d06d3a.herokuapp.com/api/auth/register?", // Change to admin login
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: data,
    };

    if (Object.values(errors).every((error) => error === "")) {
      // Submit form
      try {
        const response = await axios.request(config);
        const { message, user, access_token } = response.data;

        // Store the response data as needed
        console.log("User registered successfully:", user);
        console.log("Access token:", access_token);

        if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
          router.push("/admin-login/");
        } else {
          router.push("/login/");
        }
        return <Toast type="success" message={message} />;
      } catch (error) {
        return <Toast type="error" message="An error occurred during login." />;
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto">
      <div className="flex flex-col lg:w-96 md:w-60  items-center rounded-2xl bg-white p-8  sshadow-lg">
        {step === 1 && <Base onNext={handleNext} />}
        {step === 2 && <VerifyEmail onNext={handleResend} email={email} />}
      </div>
    </div>
  );
}

export default Signup;
