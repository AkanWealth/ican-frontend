"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

interface Propsval {
  onNext: () => void;
}

function Base({ onNext }: Propsval) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = JSON.stringify({
      email: email,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://ican-sds-api.onrender.com/api/v1/auth/password/reset",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      setMessage(response.data.message);
      setError("");
      onNext(); // Call onNext if the request is successful
    } catch (error) {
      setMessage("");
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col w-full  items-center  gap-6 ">
      <Image src="/Logo_big.png" alt="Logo" width={143} height={60} />
      <div className=" w-fit">
        <h4 className=" text-primary text-center text-3xl font-bold font-mono   ">
          Forgot Password
        </h4>
        <p className=" text-base font-normal font-sans  ">
          Enter your email address to reset your password.{" "}
        </p>
      </div>
      <form className="w-full flex flex-col gap-4 " onSubmit={handleSubmit}>
        <div className="  w-full flex flex-col">
          <label
            className=" text-base font-sans font-semibold  "
            htmlFor="email"
          >
            Email <span className="text-red-600">*</span>
          </label>
          <input
            className=" p-3 rounded border border-gray-400  "
            placeholder="Enter your username"
            name="email"
            required
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <p></p>
        </div>

        <button
          onClick={() => {
            onNext();
          }}
          className=" px-8 py-4 bg-primary rounded-full text-white text-base font-semibold "
          type="submit"
        >
          Reset Password
        </button>
      </form>
      <p className=" text-base font-medium   ">
        Remember Password? {"       "}
        <Link className=" text-primary " href={"/login"}>
          Login Here
        </Link>
      </p>
    </div>
  );
}

export default Base;
