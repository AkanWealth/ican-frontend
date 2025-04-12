import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import InputEle from "@/components/genui/InputEle";

interface Propsval {
  onNext: () => void;
}

function New({ onNext }: Propsval) {
  const [complete, setComplete] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    cpassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    password: "",
    cpassword: "",
  });

  const [pvalid, setPvalid] = useState(false);
  const [cvalid, setCvalid] = useState(false);
  const [evalid, setEvalid] = useState(false);
  const [plength, setPlength] = useState(false);
  const [pupper, setPupper] = useState(false);
  const [pnumber, setPnumber] = useState(false);
  const [plower, setPlower] = useState(false);

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
    let error = "";

    if (name === "password") {
      error = validatePassword(value);
    }
    if (name === "cpassword") {
      error = validateConfirmPassword(formData.password, value);
    }

    setFormErrors({
      ...formErrors,
      [name]: error,
    });

    if (pvalid && cvalid) {
      setComplete(true);
    } else {
      setComplete(false);
    }
  };

  return (
    <div className="flex flex-col w-full items-center  gap-6 ">
      <Image src="/Logo_big.png" alt="Logo" width={143} height={60} />
      <div className=" w-fit">
        <h4 className=" text-primary text-center text-3xl font-bold font-mono   ">
          Reset Your password{" "}
        </h4>
        <p className=" text-base text-center font-normal font-sans  ">
          Enter your new password to get back to your account{" "}
        </p>
      </div>
      <form className="w-full flex flex-col gap-4 " action="">
        <InputEle
          label="New Password"
          id="password"
          type="password"
          placeholder="Enter your new password"
          value={formData.password}
          required
          onChange={handleChange}
        />
        <InputEle
          label="Confirm Password"
          id="cpassword"
          value={formData.cpassword}
          type="password"
          placeholder="Confirm your new password"
          required
          onChange={handleChange}
        />

        <button
          onClick={() => {
            onNext();
          }}
          className=" px-8 py-4 bg-primary rounded-full text-white text-base font-semibold "
          type="submit"
          disabled={!complete}
        >
          Reset Password
        </button>
      </form>
      <p className=" text-base font-medium   ">
        Remember Password? {"       "}
        <Link className=" text-primary " href={"/admin-login"}>
          Login Here
        </Link>
      </p>
    </div>
  );
}

export default New;
