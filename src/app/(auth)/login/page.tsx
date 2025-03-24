"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import InputEle from "@/components/genui/InputEle";
import { useRouter } from "next/navigation";
import Toast from "@/components/genui/Toast";
import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

function Login() {
  const router = useRouter();
  const [validreq, setValidreq] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const [complete, setComplete] = useState(false);
  const [evalid, setEvalid] = useState(false);

  const [pvalid, setPvalid] = useState(false);
  const [plength, setPlength] = useState(false);
  const [pupper, setPupper] = useState(false);
  const [pnumber, setPnumber] = useState(false);
  const [plower, setPlower] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      setPlength(false);
      return "No Password too short ";
    } else {
      setPlength(true);
    }
    if (!/[A-Z]/.test(password)) {
      setPupper(false);
      return "No Uppercase letters";
    } else {
      setPupper(true);
    }
    if (!/[a-z]/.test(password)) {
      setPlower(false);
      return "No Lowercase letters";
    } else {
      setPlower(true);
    }
    if (!/\d/.test(password)) {
      setPnumber(false);
      return "No Number Charcter";
    } else {
      setPnumber(true);
    }
    if (!/[@$!%*?&]/.test(password)) {
      setPnumber(false);
      return "No Special Charcter";
    } else {
      setPvalid(true);
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

    if (name === "email") {
      error = validateEmail(value);
      setEvalid(!error);
    }
    if (name === "password") {
      error = validatePassword(value);
    }

    setFormErrors({
      ...formErrors,
      [name]: error,
    });

    if (pvalid && evalid) {
      setComplete(true);
    } else {
      setComplete(false);
    }
  };
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = (
      document.getElementById("email") as HTMLInputElement
    ).value.trim();
    const password = (
      document.getElementById("password") as HTMLInputElement
    ).value.trim();
    console.log(email, password);

    const errors = {
      password: validatePassword(password),
      email: validateEmail(email),
    };

    setFormErrors(errors);

    const data = JSON.stringify({
      email: email,
      password: password,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BASE_API_URL}/auth/login`,
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
        const { user, access_token } = response.data;

        // Set secure cookies instead of localStorage
        document.cookie = `user=${JSON.stringify(
          user
        )}; path=/; secure; samesite=strict`;
        document.cookie = `access_token=${access_token}; path=/; secure; samesite=strict`;

        if (user.role === "USER") {
          router.push("/dashboard");
        } else if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
          router.push("/admin");
        }
        return <Toast type="success" message="Login successful" />;
      } catch (error) {
        return <Toast type="error" message="An error occurred during login." />;
      } finally {
        setValidreq(false);
      }
    } else {
      setValidreq(false);
    }
  };

  return (
    <div className=" m-auto ">
      <div className="flex flex-col w-96 sm:w-[440px] items-center rounded-2xl  bg-white p-8 gap-6 ">
        <Image src="/Logo_big.png" alt="Logo" width={143} height={60} />
        <div className=" w-fit">
          <h4 className=" text-primary text-center text-3xl font-bold font-mono   ">
            Member Login
          </h4>
          <p className=" text-base font-normal font-sans  ">
            Please, enter your details below
          </p>
        </div>

        <form className="w-full flex flex-col gap-4 " onSubmit={handleLogin}>
          <InputEle
            id="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            onChange={handleChange}
            value={formData.email}
            errorMsg={formErrors.email}
          />
          <InputEle
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            onChange={handleChange}
            value={formData.password}
            errorMsg={formErrors.password}
          />

          <div className=" flex flex-row justify-between  ">
            <div className=" flex flex-row gap-2 ">
              <input type="checkbox" name="remember" id="remember" />
              <p className=" text-base font-medium   ">Remember me</p>
            </div>
            <Link
              className=" text-primary text-base font-medium  "
              href={"/forgot-password"}
            >
              Forgot Password
            </Link>
          </div>
          <button
            disabled={!validreq}
            className=" px-8 py-4 bg-primary rounded-full text-white text-base disabled:bg-gray-600 font-semibold "
            type="submit"
          >
            Log In
          </button>
        </form>
        <p className=" text-base font-medium   ">
          Don&apos;t have an account? {"       "}
          <Link className=" text-primary " href={"/sign-up"}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
