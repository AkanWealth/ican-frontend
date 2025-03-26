"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

import InputEle from "@/components/genui/InputEle";
import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
interface Propsval {
  onNext: () => void;
}

function Base({ onNext }: Propsval) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        "https://ican-api-6000e8d06d3a.herokuapp.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      console.log(data);

      toast({
        title: "Reset link sent",
        description: data.message,
        variant: "default",
        duration: 2000,
      });

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // If successful, call onNext
      onNext();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full sm:w-[440px] items-center gap-6 p-4">
      <Image src="/Logo_big.png" alt="Logo" width={143} height={60} />
      <div className="w-fit">
        <h4 className="text-primary text-center text-3xl font-bold font-mono">
          Forgot Password
        </h4>
        <p className="text-base font-normal font-sans">
          Enter your email address to reset your password.{" "}
        </p>
      </div>
      <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="w-full flex flex-col">
          <label className="text-base font-sans font-semibold" htmlFor="email">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            className={`p-3 rounded border ${
              error ? "border-red-500" : "border-gray-400"
            }`}
            placeholder="Enter your email address"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <button
          className="px-8 py-4 bg-primary rounded-full text-white text-base font-semibold disabled:bg-gray-400"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send reset link"}
        </button>
      </form>
      <p className="text-base font-medium">
        Remember Password? {""}
        <Link className="text-primary" href={"/login"}>
          Login Here
        </Link>
      </p>
    </div>
  );
}

export default Base;
