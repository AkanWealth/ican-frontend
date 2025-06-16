"use client";

import React, { useState, useEffect } from "react";
import { PaymentTable } from "@/components/admincomps/payment/datatable/PaymentTable";
import { waivercoloumns } from "@/components/admincomps/payment/datatable/columns";
import CreateWaiver from "@/components/admincomps/billing/actions/CreateWaiver";

import { useToast } from "@/hooks/use-toast";

import { BASE_API_URL } from "@/utils/setter";

import apiClient from "@/services-admin/apiClient";

export default function Waiversubpage() {
  const [data, setData] = useState([]);
  const { toast } = useToast();
  const [isWaiver, setisWaiver] = useState(false);

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
          
        </div>
        <button
          onClick={() => setisWaiver(!isWaiver)}
          className="flex flex-row items-center gap-2 text-white bg-primary px-4 py-2 rounded-md"
        >
          {" "}
          Create Waiver Code
        </button>{" "}
      </div>

      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">All Waiver Codes</h2>
        <div>
          <PaymentTable columns={waivercoloumns} data={data} />
        </div>
      </div>
      {isWaiver && (
        <CreateWaiver
          isOpen={isWaiver}
          onClose={() => setisWaiver(false)}
          billingId={""}
          createdById={""}
          mode="table"
        />
      )}
    </div>
  );
}
