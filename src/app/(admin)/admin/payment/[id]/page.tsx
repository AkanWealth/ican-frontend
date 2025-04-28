"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";

import apiClient from "@/services-admin/apiClient";

import { BASE_API_URL } from "@/utils/setter";
import { PaymentDetails } from "@/libs/types";

import { AuthProvider } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";
import { AdminProtectedRoute } from "@/app/(admin)/admin/LoginAuthentication/AdminProtectedRoute";

function PaymentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [data, setData] = useState<PaymentDetails>();

  useEffect(() => {
    async function fetchData() {
      const paymentId = (await params).id;

      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/payments/${paymentId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };
      const result = await apiClient.request(config);

      setData(result.data);
      console.log(result.data);
    }
    fetchData();
  }, [params]);

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
        <h2 className="text-xl font-semibold text-left">Payment Details</h2>
        <hr />
        <div className="grid grid-cols-2 gap-6">
          <p className=" text-sm text-neutral-600 flex flex-col gap-1">
            Payment type
            <span className="text-base text-black font-medium">
              {data?.paymentType}
            </span>
          </p>
          {/* <p className=" text-sm text-neutral-600 flex flex-col gap-1">
            Bill Description
            <span className="text-base text-black font-medium">
              Bill description
            </span>
          </p> */}
          <p className=" text-sm text-neutral-600 flex flex-col gap-1">
            Bill Amount{" "}
            <span className="text-base text-black font-medium">
              {data?.amount}
            </span>
          </p>{" "}
          <p className=" text-sm text-neutral-600 flex flex-col gap-1">
            Status{" "}
            <span className="text-base text-black font-medium">
              {data?.status}
            </span>
          </p>{" "}
          <p className=" text-sm text-neutral-600 flex flex-col gap-1">
            Reciepients{" "}
            <span className="text-base text-black font-medium">all</span>
          </p>{" "}
        </div>
      </div>
    </div>
  );
}

export default function PackedPaymentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AuthProvider>
      <AdminProtectedRoute>
        <PaymentDetailsPage params={params} />
      </AdminProtectedRoute>
    </AuthProvider>
  );
}
