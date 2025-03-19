"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";

function BillingDetailsPage() {
  const router = useRouter();

  return (
    <div className="rounded-3xl flex flex-col gap-6 p-6">
      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.back()}
            className="flex flex-row items-center gap-2 text-primary"
          >
            <MdArrowBack className="w-6 h-6" /> Back
          </button>
          <h2 className="font-semibold text-2xl text-black">Billing Details</h2>
          <p>View and Manage all user billings here</p>
        </div>
       
      </div>
      {/* Tab sections */}
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">Billing Details</h2>
        <hr />
        <div>ppp</div>
      </div>
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">Payment Details</h2>
        <hr />
        <div>ppp</div>
      </div>
    </div>
  );
}

export default BillingDetailsPage;
