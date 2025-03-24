"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Toast from "@/components/genui/Toast";

import InputEle from "@/components/genui/InputEle";
import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
interface Propsval {
  onNext: () => void;
}

function Base({ onNext }: Propsval) {
  const [email, setEmail] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setEmail((e.target as HTMLInputElement).value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = JSON.stringify({
      email: email,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BASE_API_URL}/auth/forgot-password"`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      onNext(); // Call onNext if the request is successful
      return <Toast type="success" message={response.data.message} />;
    } catch (error) {
      return <Toast type="error" message="An error occurred during login." />;
    }
  };

  return (
    <div className="flex flex-col w-full  items-center  gap-6 ">
      <Image src="/Logo_big.png" alt="Logo" width={143} height={60} />
      <div className=" w-fit">
        <h4 className=" text-primary text-center  text-3xl font-bold font-mono   ">
          Forgot Password
        </h4>
        <p className=" text-base font-normal font-sans  ">
          Enter your email address to reset your password.{" "}
        </p>
      </div>
      <form className="w-full flex flex-col gap-4 " onSubmit={handleSubmit}>
        <InputEle
          label="Email Address"
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={handleChange}
          required
        />

        <button
          className=" px-8 py-4 bg-primary rounded-full text-white text-base font-semibold "
          type="submit"
        >
          Send reset link
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
