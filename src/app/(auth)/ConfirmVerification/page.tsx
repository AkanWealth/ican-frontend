"use client";

import React, { Suspense } from "react";
import Verification from "@/app/(dashboard)/ui/Verification";

const ConfirmEmailPage = () => {
  return (
    <Suspense>
      <Verification />
    </Suspense>
  );
};

export default ConfirmEmailPage;


