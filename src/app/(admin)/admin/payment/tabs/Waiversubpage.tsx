"use client";

import React, { useState, useEffect } from "react";
import { PaymentTable } from "@/components/admincomps/payment/datatable/PaymentTable";
import { waivercoloumns } from "@/components/admincomps/payment/datatable/columns";

import { useToast } from "@/hooks/use-toast";

import { BASE_API_URL } from "@/utils/setter";

import apiClient from "@/services-admin/apiClient";

export default function Waiversubpage() {
  const [data, setData] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/payments/waivers`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };

      try {
        const response = await apiClient.request(config);
        setData(response);
      } catch (error) {
        console.error("Error fetching payments:", error);
        toast({
          title: "Error fetching payments",
          description: "Error fetching payments",
          variant: "destructive",
        });
      }
    }
    fetchData();
  }, [toast]);

  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="font-semibol text-2xl text-black">
            Waiver Code Management
          </h2>
          <p>View all waiver codes and their status here</p>
        </div>
      </div>

      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">All Waiver Codes</h2>
        <div>
          <PaymentTable columns={waivercoloumns} data={data} />
        </div>
      </div>
    </div>
  );
}
