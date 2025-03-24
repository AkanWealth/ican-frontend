"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Toast from "@/components/genui/Toast";
import InputEle from "@/components/genui/InputEle";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/utils/setter";

function AdminSignup() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    cpassword: "",
    membershipId: "",
  });
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    cpassword: "",
    membershipId: "",
  });

  const [fname, setFname] = useState(false);
  const [sname, setSname] = useState(false);
  const [evalid, setEvalid] = useState(false);

  const [pvalid, setPvalid] = useState(false);
  const [cvalid, setCvalid] = useState(false);

  const [plength, setPlength] = useState(false);
  const [pupper, setPupper] = useState(false);
  const [pnumber, setPnumber] = useState(false);
  const [plower, setPlower] = useState(false);

  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email address.";
    }
    return "";
  };
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

  const validateSurname = (surname: string): string => {
    const nameRegex = /^[a-zA-Z0-9]+$/;
    if (surname.length < 3) {
      return "Surname must be at least 3 characters long.";
    }
    if (!nameRegex.test(surname)) {
      return "Surname must contain only alphanumeric characters.";
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
    console.log(formData);
    let error = "";
    if (name === "firstName") {
      error = validateFirstName(value);
      setFname(!error);
    }
    if (name === "surname") {
      error = validateSurname(value);
      setSname(!error);
    }
    if (name === "password") {
      error = validatePassword(value);
    }
    if (name === "cpassword") {
      error = validateConfirmPassword(formData.password, value);
    }
    if (name === "email") {
      error = validateEmail(value);
      setEvalid(!error);
    }

    setFormErrors({
      ...formErrors,
      [name]: error,
    });

    if (pvalid && evalid && fname && sname) {
      setComplete(true);
    } else {
      setComplete(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const email = (
      document.getElementById("email") as HTMLInputElement
    ).value.trim();
    const membershipId = (
      document.getElementById("membershipId") as HTMLInputElement
    ).value.trim();
    const firstName = (
      document.getElementById("firstName") as HTMLInputElement
    ).value.trim();
    const lastName = (
      document.getElementById("lastName") as HTMLInputElement
    ).value.trim();
    const password = (
      document.getElementById("password") as HTMLInputElement
    ).value.trim();
    const cpassword = (
      document.getElementById("cpassword") as HTMLInputElement
    ).value.trim();

    const errors = {
      firstName: firstName,
      lastName: lastName,
      email: validateEmail(email),
      password: validatePassword(password),
      cpassword: validateConfirmPassword(password, cpassword),
      membershipId: "",
    };

    setFormErrors(errors);

    const data = JSON.stringify({
      membershipId: membershipId,
      firstname: firstName,
      surname: lastName,
      email: email,
      password: password,
      confirmPassword: password,
    });
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BASE_API_URL}/auth/register`, // Change to admin login
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
    <div className=" m-auto ">
      <div className="flex flex-col w-96 sm:w-[550px] items-center rounded-2xl  bg-white p-8 gap-6 ">
        <div className=" w-fit">
          <h4 className=" text-primary text-center text-3xl font-bold font-mono   ">
            Create an Account{" "}
          </h4>
        </div>
        <form className="w-full flex flex-col gap-4 " onSubmit={handleSignup}>
          {/* <InputEle /> */}
          <div className="flex flex-row gap-2">
            <InputEle
              id="firstName"
              type="text"
              placeholder="Enter your First Name"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
              errorMsg={formErrors.firstName}
            />
            <InputEle
              id="lastName"
              type="text"
              placeholder="Enter your Last Name"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              errorMsg={formErrors.lastName}
            />
          </div>

          <InputEle
            id="email"
            type="email"
            placeholder="Enter your email"
            label="Email address"
            value={formData.email}
            onChange={handleChange}
            errorMsg={formErrors.email}
          />
          <InputEle
            label="Password"
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            required
            onChange={handleChange}
          />
          <div className="pt-4  ">
            <p className="text-xs  text-gray-500">
              Must be at least{" "}
              <span
                className={`${plength ? " text-green-500 " : "text-gray-500"}`}
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
                className={`${pnumber ? " text-green-500 " : "text-gray-500"}`}
              >
                one number & one symbol.
              </span>
            </p>
          </div>
          <InputEle
            label="Confirm Password"
            id="cpassword"
            type="password"
            placeholder="Confirm your new password"
            value={formData.cpassword}
            required
            onChange={handleChange}
          />
          <InputEle
            label="Membership ID"
            id="membershipId"
            type="text"
            placeholder="Enter your membership ID"
            value={formData.membershipId}
            required
            onChange={handleChange}
          />

          <div className=" flex flex-row justify-between  ">
            <div className=" flex flex-row gap-2 ">
              <input type="checkbox" name="remember" id="remember" />
              <p className=" text-base font-medium   ">Remember me</p>
            </div>
            <Link
              className=" text-primary text-base font-medium  "
              href={"/admin-pass-reset"}
            >
              Forgot Password
            </Link>
          </div>
          <button
            className=" px-8 py-4 bg-primary rounded-full text-white text-base font-semibold "
            type="submit"
            disabled={!complete}
          >
            Log In
          </button>
        </form>
        <p className=" text-base font-medium   ">
          Don&apos;t have an account? {"       "}
          <Link className=" text-primary " href={"/admin-signup"}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AdminSignup;
