"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";
import { PaymentTable } from "@/components/admincomps/payment/datatable/PaymentTable";
import {
  paymentdetailscoloumns,
  billingdetailscoloumns,
} from "@/components/admincomps/payment/datatable/columns";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import { BillingDetails, PaymentBasic } from "@/libs/types";

import { handleUnauthorizedRequest } from "@/utils/refresh_token";
import { useToast } from "@/hooks/use-toast";

function BillingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { toast } = useToast();

  const [data, setData] = useState<BillingDetails>();

  useEffect(() => {
    async function fetchData() {
      const billingId = (await params).id;
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/billing/${billingId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      };
      try {
        const result = await axios.request(config);

        setData(result.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            await handleUnauthorizedRequest(config, router, setData);
          } else {
            toast({
              title: "Error",
              description: "Failed to fetch billing data.",
              variant: "destructive",
            });
          }
        } else {
          // Handle unexpected errors
          toast({
            title: "Error",
            description: "An unexpected error occurred.",
            variant: "destructive",
          });
        }
      }
    }
    fetchData();
  }, [params, router, toast]);

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
            <span className="text-base text-black font-medium">
              {data?.name}
            </span>
          </p>
          <p className=" text-sm text-neutral-600 flex flex-col gap-1">
            Bill Type
            <span className="text-base text-black font-medium">
              {data?.type}
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
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">Payment Details</h2>
        <hr />
        <PaymentTable
          data={(data?.payments as PaymentBasic[]) || []}
          columns={billingdetailscoloumns}
        />
      </div>
    </div>
  );
}

export default BillingDetailsPage;
