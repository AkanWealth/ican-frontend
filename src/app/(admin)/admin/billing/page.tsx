"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BillingTable } from "@/components/admincomps/billing/datatable/BillingTable";
import { billingcolumns } from "@/components/admincomps/billing/datatable/columns";
import { Billing } from "@/components/admincomps/billing/datatable/colsdata";

import { AuthProvider } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";
import { AdminProtectedRoute } from "@/app/(admin)/admin/LoginAuthentication/AdminProtectedRoute";

import apiClient from "@/services-admin/apiClient";

import { BASE_API_URL } from "@/utils/setter";
import { useToast } from "@/hooks/use-toast";

function BillingPage() {
  const { toast } = useToast();
  const [data, setData] = useState<Billing[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/billing`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      };
      try {
        const result = await apiClient.get("/billing", config);

        setData(result.data);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
    fetchData();
  }, [toast]);

  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <h2 className="flex flex-col gap-2 text-left items-start font-semibol text-2xl text-black">
          Billing Management
          <span className="text-base text-gray-600">
            Create member bills and track their invoices here
          </span>
        </h2>
        <button
          className="bg-primary text-white text-base font-semibold rounded-full w-fit px-3 py-2 whitespace-nowrap h-fit"
          onClick={() => router.push("/admin/billing/create")}
        >
          Create New Bill
        </button>
      </div>
      {/* Tab sections */}
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl w-full font-semibold text-left border-b border-gray-500 ">
          Invoices & Billings
        </h2>
        <div>
          <BillingTable columns={billingcolumns} data={data} />
        </div>
      </div>
    </div>
  );
}

export default function PackedBillingPage() {
  return (
    <AuthProvider>
      <AdminProtectedRoute>
        <BillingPage />
      </AdminProtectedRoute>
    </AuthProvider>
  );
}
