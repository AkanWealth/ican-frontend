"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Toast from "@/components/genui/Toast";

import InputEle from "@/components/genui/InputEle";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/utils/setter";

function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const [pvalid, setPvalid] = useState(false);
  const [evalid, setEvalid] = useState(false);

  const [remember, setRemember] = useState(false);

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
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
    let error = "";

    if (name === "email") {
      error = validateEmail(value);
      setEvalid(!error);
    }

    if (name === "password") {
      setPvalid(value.length > 0);
    }

    if (name === "remember") {
      setRemember(checked);
    }

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: error,
    }));

    if (pvalid && evalid) {
      setComplete(true);
    } else {
      setComplete(false);
    }
  };

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const email = (
      document.getElementById("email") as HTMLInputElement
    ).value.trim();
    const password = (
      document.getElementById("password") as HTMLInputElement
    ).value.trim();

    const errors = {
      email: validateEmail(email),
      password: password ? "" : "Password is required.",
    };

    setFormErrors(errors);

    const data = JSON.stringify({
      email: email,
      password: password,
    });
    console.log(data);
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
      try {
        const response = await axios.request(config);
        const { user, access_token } = response.data;

        // Set secure cookies with expiration time of 1 hour
        const expiryTime = new Date(Date.now() + 60 * 60 * 1000).toUTCString(); // 1 hour from now

        document.cookie = `user=${encodeURIComponent(
          JSON.stringify(user)
        )}; path=/; secure; samesite=strict; expires=${expiryTime}`;
        document.cookie = `access_token=${access_token}; path=/; secure; samesite=strict; expires=${expiryTime}`;
        document.cookie = `${response.data.refresh_token}`;

        // Set secure cookies instead of localStorage
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("access_token", access_token);

        setTimeout(() => {
          router.push("/admin");
        }, 1000);

        return <Toast type="success" message="Login successful" />;
      } catch (error) {
        // Display a popup for the error
        alert("An error occurred during login. Please try again.");

        // Reset the form
        setFormData({
          email: "",
          password: "",
        });
        setFormErrors({
          email: "",
          password: "",
        });
        setComplete(false);
        setOtp("");
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
        <h4 className=" text-black w-full text-left text-3xl font-semibold font-mono   ">
          Login to your account
        </h4>

        {isSwitchOn ? (
          <div className="space-y-2 flex items-center flex-col">
            <p className="text-base text-black font-sans">
              Enter the 6-digit verification code sent to your email address
            </p>
            <InputOTP
              className="flex gap-3"
              maxLength={6}
              value={otp}
              onChange={(otp) => setOtp(otp)}
            >
              <InputOTPGroup>
                <InputOTPSlot className=" outline-blue-600 " index={0} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot
                  className=" focus-visible:outline-primary "
                  index={1}
                />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot
                  className=" focus-visible:outline-primary "
                  index={2}
                />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot
                  className=" focus-visible:outline-primary "
                  index={3}
                />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot
                  className=" focus-visible:outline-primary "
                  index={4}
                />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot
                  className=" focus-visible:outline-primary "
                  index={5}
                />
              </InputOTPGroup>
            </InputOTP>
            <button
              className=" w-full px-8 py-4 bg-primary  rounded-full text-white text-base font-semibold "
              type="submit"
            >
              Log In
            </button>
            <p className="text-left w-full text-sm">
              {otp === "" ? (
                <>Enter your one-time password.</>
              ) : (
                <>You entered: {otp}</>
              )}
            </p>
          </div>
        ) : (
          <form className="w-full flex flex-col gap-4 " onSubmit={handleSignin}>
            {/* <InputEle /> */}
            <InputEle
              id="email"
              type="text"
              placeholder="Enter email address"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              errorMsg={formErrors.email}
            />
            <InputEle
              id="password"
              type="password"
              placeholder="Enter your password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              errorMsg={formErrors.password}
            />

            <button
              className="px-8 py-4 bg-primary rounded-full text-white text-base font-semibold flex items-center justify-center"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="loader border-white border-2 rounded-full w-5 h-5 animate-spin"></span>
              ) : (
                "Log In"
              )}
            </button>
            <div className=" flex flex-row justify-between  ">
              <p className=" text-base font-medium   ">
                Don&apos;t have an account? {"       "}
                <Link className=" text-primary " href={"/admin-signup"}>
                  Sign Up
                </Link>
              </p>
              <Link
                className=" text-gray-500 text-base font-medium  "
                href={"/admin-pass-reset"}
              >
                Forgot Password
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AdminLogin;
