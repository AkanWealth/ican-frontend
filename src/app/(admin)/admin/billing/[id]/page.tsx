"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";
import {
  payments,
  PaymentDets,
} from "@/components/admincomps/payment/datatable/colsdata";
import { PaymentTable } from "@/components/admincomps/payment/datatable/PaymentTable";
import { paymentdetailscoloumns } from "@/components/admincomps/payment/datatable/columns";

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
          <p>View billings and payments here</p>
        </div>
      </div>
      {/* Tab sections */}
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">Billing Details</h2>
        <hr />
        <div className="grid grid-cols-2 gap-6">
          <p className=" text-sm text-neutral-600 flex flex-col gap-1">
            Bill Name
            <span className="text-base text-black font-medium">Bill Name</span>
          </p>
          <p className=" text-sm text-neutral-600 flex flex-col gap-1">
            Bill Type
            <span className="text-base text-black font-medium">Dues</span>
          </p>
          <p className=" text-sm text-neutral-600 flex flex-col gap-1">
            Bill Description
            <span className="text-base text-black font-medium">
              Bill description
            </span>
          </p>
          <p className=" text-sm text-neutral-600 flex flex-col gap-1">
            Bill Amount{" "}
            <span className="text-base text-black font-medium">5,000</span>
          </p>{" "}
          <p className=" text-sm text-neutral-600 flex flex-col gap-1">
            Due Date{" "}
            <span className="text-base text-black font-medium">12/5/2005</span>
          </p>{" "}
          <p className=" text-sm text-neutral-600 flex flex-col gap-1">
            Reciepients{" "}
            <span className="text-base text-black font-medium">all</span>
          </p>{" "}
        </div>
      </div>
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">Payment Details</h2>
        <hr />
        <PaymentTable data={payments} columns={paymentdetailscoloumns} />
      </div>
    </div>
  );
}

export default BillingDetailsPage;
