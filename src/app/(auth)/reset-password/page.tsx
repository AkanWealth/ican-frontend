"use client";

import React, { useState } from "react";
import Success from "./steps/Success";
import New from "./steps/New";

function ResetPassword() {
  const [step, setStep] = useState(1);

  const steps = [
    { number: 1, title: "Reset Password" },
    { number: 2, title: "Successful" },
  ];

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return true;

      default:
        return true;
    }
  };
  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 2));
    }
  };

  return (
    <div className=" m-auto ">
      <div className="flex flex-col w-96 sm:w-[440px] items-center rounded-2xl  bg-white p-8 gap-6 ">
        {step === 1 && <New onNext={handleNext} />}
        {step === 2 && <Success onNext={handleNext} />}
      </div>
    </div>
  );
}

export default ResetPassword;
