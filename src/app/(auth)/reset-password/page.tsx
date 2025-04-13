"use client";

import React, { useState } from "react";
import Success from "./steps/Success";
import New from "./steps/New";
import { Suspense } from "react";

function ResetPasswordContent() {
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
    <div className=" m-auto flex flex-col items-center justify-center">
      <div className="flex flex-col items-center rounded-2xl bg-white p-2 gap-6 w-full max-w-md sm:max-w-lg md:max-w-xl">
        {step === 1 && <New onNext={handleNext} />}
        {step === 2 && <Success onNext={handleNext} />}
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
