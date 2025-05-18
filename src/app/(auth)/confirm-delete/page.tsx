"use client";

import React, { Suspense } from "react";
import DeletePage from "@/app/(dashboard)/ui/DeleteUser";

const DeleteAccountPage = () => {
  return (
    <Suspense>
      <DeletePage />;
    </Suspense>
  );
};

export default DeleteAccountPage;
