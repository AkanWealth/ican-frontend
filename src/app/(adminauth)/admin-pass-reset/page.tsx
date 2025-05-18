"use client";

import React, { useState } from "react";
import InputEle from "@/components/genui/InputEle";
import Link from "next/link";
import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

import { useToast } from "@/hooks/use-toast";

function AdminPasswordRequest() {
  const [evalid, setEvalid] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email address.";
    }
    setEvalid(true);
    return "";
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "email") {
      validateEmail(value);
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    let data = JSON.stringify({
      email: formData.email,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BASE_API_URL}/auth/forgot-password`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));

      toast({
        title: "Success",
        description: "Password reset link sent to your email.",
        variant: "default",
      });
      setLoading(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        toast({
          title: "Error",
          description: error.response.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send password reset link.",
          variant: "destructive",
        });
      }
      setLoading(false);
    }
  };

  return (
    <div className=" m-auto ">
      <div className="flex flex-col w-96 sm:w-[550px] items-center rounded-2xl  bg-white p-8 gap-6 ">
        <h4 className=" text-black w-full text-left text-3xl font-semibold font-mono   ">
          Request password reset
        </h4>

        <form onSubmit={handleReset} className="w-full flex flex-col gap-4 ">
          <InputEle
            id="email"
            type="text"
            placeholder="Enter email address"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required={true}
          />{" "}
          <button
            className=" w-full px-8 py-4 bg-primary  rounded-full text-white text-base font-semibold "
            type="submit"
            disabled={!evalid || loading}
          >
            {loading ? "Requesting..." : "Request reset"}
          </button>
        </form>

        <br />
        <p className=" text-base font-medium   ">
          Remember your password? {"       "}
          <Link className=" text-primary " href={"/admin-login"}>
            Log in{" "}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AdminPasswordRequest;
