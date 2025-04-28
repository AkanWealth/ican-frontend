"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PaymentTable } from "@/components/admincomps/payment/datatable/PaymentTable";
import { paymentcoloumns } from "@/components/admincomps/payment/datatable/columns";



import { BASE_API_URL } from "@/utils/setter";

import apiClient from "@/services-admin/apiClient";

function Payment() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/payments`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };

      try {
        const response = await apiClient.request(config);
        setData(response);
        console.log(response);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="font-semibol text-2xl text-black">
            Payment Management
          </h2>
          <p>Manage all member payments details here</p>
        </div>
      </div>

      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">All Payments</h2>
        <div>
          <PaymentTable columns={paymentcoloumns} data={data} />
        </div>
      </div>
    </div>
  );
}

export default Payment;
