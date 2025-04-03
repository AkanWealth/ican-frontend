"use client";
import React, { Suspense } from "react";
import VerifyEmailPage from "@/components/homecomps/EmailVerify";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPage />
    </Suspense>
  );
}