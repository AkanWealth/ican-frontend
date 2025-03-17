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
    cpassword: "",
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
    <div className=" mx-auto  ">
      <div className="flex flex-col w-fit sm:w-fit max-w-[700px] items-center rounded-2xl  bg-white p-8 gap-1 ">
        <Image src="/Logo_big.png" alt="Logo" width={143} height={60} />
        <div className=" w-fit">
          <h4 className=" text-primary text-center text-3xl font-bold font-mono   ">
            Create Account
          </h4>
          <p className=" text-base text-center font-normal font-sans  ">
            Welcome, Let&apos;s get started
          </p>
        </div>
        <form className="w-full flex flex-col gap-1 " onSubmit={handleSignup}>
          <div className="flex flex-row gap-2">
            <InputEle
              label="First Name"
              id="firstName"
              type="text"
              onChange={handleChange}
              value={formData.firstName}
              required
              errorMsg={formErrors.firstName}
            />
            <InputEle
              label="Last Name"
              id="lastName"
              type="text"
              onChange={handleChange}
              value={formData.lastName}
              required
              errorMsg={formErrors.lastName}
            />
          </div>
          <InputEle
            label="Email Address"
            id="email"
            type="email"
            onChange={handleChange}
            value={formData.email}
            required
            errorMsg={formErrors.email}
          />
          <InputEle
            label="Membership ID"
            id="membershipId"
            type="text"
            onChange={handleChange}
            value={formData.membershipId}
            required
            errorMsg={formErrors.membershipId}
          />

          <div className="  w-full flex flex-col ">
            <InputEle
              label="Password"
              id="password"
              type="password"
              value={formData.password}
              placeholder="Enter your new password"
              required
              onChange={handleChange}
            />

            <div className="py-1 m-0  ">
              <p className="text-xs  text-gray-500">
                Must be at least{" "}
                <span
                  className={`${
                    plength ? " text-green-500 " : "text-gray-500"
                  }`}
                >
                  8 characters long,{" "}
                </span>
                including{" "}
                <span
                  className={`${pupper ? " text-green-500 " : "text-gray-500"}`}
                >
                  upper case,{" "}
                </span>
                <span
                  className={`${plower ? " text-green-500 " : "text-gray-500"}`}
                >
                  lower case,{" "}
                </span>
                <span
                  className={`${
                    pnumber ? " text-green-500 " : "text-gray-500"
                  }`}
                >
                  one number & one symbol.
                </span>
              </p>
            </div>
          </div>
          <InputEle
            label="Confirm Password"
            id="cpassword"
            type="password"
            placeholder="Confirm your password"
            required
            onChange={handleChange}
            value={formData.cpassword}
            errorMsg={formErrors.cpassword}
          />

          <div className=" flex flex-row justify-between gap-2 items-center ">
            <input
              type="checkbox"
              name="consent"
              id="consent"
              checked={formData.consent}
              onChange={handleChange}
            />
            <p className=" text-xs">
              By creating an account, I agree and consent to receive
              communications and updates about ICAN Institute products and
              services. I have reviewed and acknowledged the Privacy Policy
              along with the Terms and Conditions therein.{" "}
            </p>
          </div>
          {formErrors.consent && (
            <p className="text-red-600">{formErrors.consent}</p>
          )}

          <button
            disabled={!complete && loading}
            className=" px-8 py-4 disabled:bg-slate-500 bg-primary rounded-full text-white text-base font-semibold "
            type="submit"
          >
            Verify
          </button>
        </form>
        <p className=" text-base font-medium pt-1 w-full text-center  gap-3 flex flex-row justify-center  ">
          Already a member?
          <Link className=" text-primary " href={"/login"}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
