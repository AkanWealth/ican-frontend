"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/app/(dashboard)/LoginAuthentication/AuthContext";
import { AuthProvider } from "@/app/(dashboard)/LoginAuthentication/AuthContext"
import { PublicRoute } from "@/components/PublicRoute";
import { Eye, EyeOff } from "lucide-react"; // Import the eye icons

function Login() {
  const { toast } = useToast();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Add state for password visibility
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

  const handleSubmit = async (e: { preventDefault: () => void }) => {
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
    <div className="m-auto flex flex-col items-center justify-center">
      <div className="flex flex-col items-center rounded-2xl bg-white p-8 gap-6 w-full max-w-xl sm:max-w-lg md:max-w-xl">
        <Image src="/Logo_big.png" alt="Logo" width={100} height={50} />
        <div className="w-fit">
          <h4 className="text-primary text-center text-2xl lg:text-3xl font-bold font-mono">
            Member Login
          </h4>
          <p className="lg:text-base text-xs text-center font-normal font-sans">
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
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>
          <div className="w-full flex flex-col">
            <label
              className="text-base font-sans font-semibold"
              htmlFor="password"
            >
              Password <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                className={`p-3 rounded border w-full ${
                  passwordError ? "border-red-500" : "border-gray-400"
                }`}
                placeholder="Enter password"
                name="password"
                value={formData.password}
                required
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-2">
              <input type="checkbox" name="remember" id="remember" />
              <p className="text-xs lg:text-base font-medium">Remember me</p>
            </div>
            <Link
              className="text-primary text-xs lg:text-base font-medium"
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
        <p className="text-xs lg:text-base font-medium">
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
      <PublicRoute>
        <Login />
      </PublicRoute>
    </AuthProvider>
  );
}