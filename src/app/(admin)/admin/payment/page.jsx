"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";

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
import { format } from "date-fns";

function Payment() {
  const [data, setData] = useState([]);
  const { toast } = useToast();
  // Use ISO string for today's date to avoid dependency on 'format'
  const [startDate, setStartDate] = useState("2025-05-01");
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));

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
        <div className="flex flex-row items-center justify-between">
          <TabsList>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="waivers">Waivers</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
          </TabsList>
          {/* Date Range Filter with clearer grouping and quick reset */}
          <div className="w-fit flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
            <label className="text-sm text-gray-600 font-medium">From</label>
            <input
              type="date"
              min="2025-05-01"
              max={endDate}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-200"
              aria-label="Start date"
            />
            <label className="text-sm text-gray-600 font-medium">To</label>
            <input
              type="date"
              min="2025-05-01"
              max={format(new Date(), "yyyy-MM-dd")}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-200"
              aria-label="End date"
            />
            {(startDate !== "2025-05-01" ||
              endDate !== format(new Date(), "yyyy-MM-dd")) && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 text-xs"
                onClick={() => {
                  setStartDate("2025-05-01");
                  setEndDate(format(new Date(), "yyyy-MM-dd"));
                }}
                title="Reset date range"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="payments">
          <Paymentsubpage startDate={startDate} endDate={endDate} />
        </TabsContent>
        <TabsContent value="waivers">
          <Waiversubpage startDate={startDate} endDate={endDate} />
        </TabsContent>
        <TabsContent value="donations">
          <Donationsubpage startDate={startDate} endDate={endDate} />
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
