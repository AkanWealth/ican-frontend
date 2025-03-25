"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/app/(dashboard)/LoginAuthentication/AuthContext";
import { AuthProvider } from "@/app/(dashboard)/LoginAuthentication/AuthContext";

function Login() {
  const { toast } = useToast();
  const { login } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError("");
    setPasswordError("");
    
    // Validate email
    if (!formData.email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }
    
    // Validate password
    if (!formData.password) {
      setPasswordError("Password is required");
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
   
    if (!validateForm()) {
      toast({
        title: "Login Failed",
        description: "Please correct the errors in the form",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    setLoading(true);

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
    <div className="m-auto">
      <div className="flex flex-col lg:w-96 md:w-80 items-center rounded-2xl bg-white p-8 gap-6">
        <Image src="/Logo_big.png" alt="Logo" width={100} height={50} />
        <div className="w-fit">
          <h4 className="text-primary text-center text-2xl font-bold font-mono">
            Member Login
          </h4>
          <p className="text-base font-normal font-sans">
            Please, enter your details below
          </p>
        </div>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="w-full flex flex-col">
            <label
              className="text-base font-sans font-semibold"
              htmlFor="email"
            >
              Email Address <span className="text-red-600">*</span>
            </label>
            <input
              className={`p-3 rounded border ${
                emailError ? "border-red-500" : "border-gray-400"
              }`}
              placeholder="Enter your email address"
              name="email"
              value={formData.email}
              required
              type="email"
              onChange={handleChange}
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>
          <div className="w-full flex flex-col">
            <label
              className="text-base font-sans font-semibold"
              htmlFor="password"
            >
              Password <span className="text-red-600">*</span>
            </label>
            <input
              className={`p-3 rounded border ${
                passwordError ? "border-red-500" : "border-gray-400"
              }`}
              placeholder="Enter password"
              name="password"
              value={formData.password}
              required
              type="password"
              onChange={handleChange}
            />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-2">
              <input type="checkbox" name="remember" id="remember" />
              <p className="text-base font-medium">Remember me</p>
            </div>
            <Link
              className="text-primary text-base font-medium"
              href={"/forgot-password"}
            >
              Forgot Password
            </Link>
          </div>
          <button
            className="px-8 py-4 bg-primary rounded-full text-white text-base font-semibold"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <p className="text-base font-medium">
          Don&apos;t have an account? {"       "}
          <Link className="text-primary" href={"/sign-up"}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
}