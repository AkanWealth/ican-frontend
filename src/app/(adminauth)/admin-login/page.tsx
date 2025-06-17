"use client";

import React, { useState } from "react";
import Link from "next/link";

import { useToast } from "@/hooks/use-toast";
import InputEle from "@/components/genui/InputEle";

import { useAuth } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";
import { AuthProvider } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";
import { AdminPublicRoute } from "@/components/authcomps/AdminPublicRoute";

function AdminLogin() {
  const { toast } = useToast();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
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

    try {
      // Use the login method from AuthContext
      await login(formData.email, formData.password);

      

      toast({
        title: "Login Successful",
        description: "Welcome back!",
        variant: "default",
        duration: 2000,
      });
    } catch (error: any) {
      console.error("Login error:", error);

      let errorMessage = "An error occurred during login.";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthProvider>
      <AdminPublicRoute>
        <div className=" m-auto ">
          <div className="flex flex-col w-96 sm:w-[550px] items-center rounded-2xl  bg-white p-8 gap-6 ">
            <h4 className=" text-black w-full text-left text-3xl font-semibold font-mono   ">
              Login to your account
            </h4>

            <form
              className="w-full flex flex-col gap-4 "
              onSubmit={handleSignin}
            >
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
          </div>
        </div>
      </AdminPublicRoute>
    </AuthProvider>
  );
}

export default function AdminLoginPage() {
  return (
    <AuthProvider>
      <AdminPublicRoute>
        <AdminLogin />
      </AdminPublicRoute>
    </AuthProvider>
  );
}
