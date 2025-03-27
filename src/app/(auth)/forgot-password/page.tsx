"use client";

import React, { useState } from "react";
// import Biodata from "@/components/Biodata";
import Base from "./steps/Base";
import Sent from "./steps/Sent";

function ForgotPassword() {
  const [step, setStep] = useState(1);



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
    <div className="m-auto flex flex-col items-center justify-center h-screen">

      <div className="flex flex-col items-center rounded-2xl bg-white p-8 gap-6 w-full max-w-md sm:max-w-lg md:max-w-xl">
        {step === 1 && <Base onNext={handleNext} />}
        {step === 2 && <Sent onNext={handleNext} />}
      </div>
    </div>
  );
}

export default ForgotPassword;
