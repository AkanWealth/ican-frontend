"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useRouter } from "next/navigation";
import { PaymentTable } from "@/components/admincomps/payment/datatable/PaymentTable";
import { paymentcoloumns } from "@/components/admincomps/payment/datatable/columns";
import Paymentsubpage from "@/app/(admin)/admin/payment/tabs/Paymentsubpage";
import Waiversubpage from "@/app/(admin)/admin/payment/tabs/Waiversubpage";
import Donationsubpage from "@/app/(admin)/admin/payment/tabs/Donationsubpage";

import { AuthProvider } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";
import { AdminProtectedRoute } from "@/app/(admin)/admin/LoginAuthentication/AdminProtectedRoute";

import { useToast } from "@/hooks/use-toast";

import { BASE_API_URL } from "@/utils/setter";

import apiClient from "@/services-admin/apiClient";

function Payment() {
  const [data, setData] = useState([]);
  const { toast } = useToast();

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
            Payment Management
          </h2>
          <p>Manage all member payments here</p>
        </div>
      </div>

      <Tabs defaultValue="payments">
        <TabsList>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="waivers">Waivers</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
        </TabsList>
        <TabsContent value="payments">
          <Paymentsubpage />
        </TabsContent>
        <TabsContent value="waivers">
          <Waiversubpage />
        </TabsContent>
        <TabsContent value="donations">
          <Donationsubpage />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function PackedPayment() {
  return (
    <AuthProvider>
      <AdminProtectedRoute>
        <Payment />
      </AdminProtectedRoute>
    </AuthProvider>
  );
}
