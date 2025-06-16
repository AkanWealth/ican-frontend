"use client";

import React, { useState, useEffect } from "react";
import { PaymentTable } from "@/components/admincomps/payment/datatable/PaymentTable";
import { paymentcoloumns } from "@/components/admincomps/payment/datatable/columns";

import { useToast } from "@/hooks/use-toast";

import { BASE_API_URL } from "@/utils/setter";

import apiClient from "@/services-admin/apiClient";
import { PaymentDetailsTable } from "@/libs/types";
import { FiCreditCard, FiUsers, FiBarChart2, FiCalendar } from "react-icons/fi";

export default function Donationsubpage() {
  const [data, setData] = useState<PaymentDetailsTable[]>([]);
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
        setData(
          response.filter(
            (payment: { paymentCategory: string }) =>
              payment.paymentCategory === "Donation"
          )
        );
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

  // --- Calculate summary statistics ---
  const totalDonations = data.reduce((sum, d) => sum + (d.amount || 0), 0);
  const donors = new Set(data.map((d) => d.userId)).size;
  const averageDonation = data.length ? totalDonations / data.length : 0;
  const thisMonthDonations = data
    .filter((d) => {
      const date = new Date(d.createdAt);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="rounded-3xl p-6">
      {/* --- Donation Summary Cards --- */}
      <div className="flex gap-4 mb-6">
        <SummaryCard
          label="Total Donations"
          value={totalDonations ? `₦${totalDonations.toLocaleString()}` : "₦0"}
          icon={<FiCreditCard size={24} />}
          iconBg="bg-green-100"
        />
        <SummaryCard
          label="Total Donors"
          value={donors}
          icon={<FiUsers size={24} />}
          iconBg="bg-blue-100"
        />
        <SummaryCard
          label="Average Donation"
          value={
            averageDonation
              ? `₦${averageDonation.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`
              : "₦0"
          }
          icon={<FiBarChart2 size={24} />}
          iconBg="bg-yellow-100"
        />
        <SummaryCard
          label="This Month"
          value={
            thisMonthDonations
              ? `₦${thisMonthDonations.toLocaleString()}`
              : "₦0"
          }
          icon={<FiCalendar size={24} />}
          iconBg="bg-purple-100"
        />
      </div>
      {/* --- End Summary Cards --- */}

      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">
          All Successful Donations
        </h2>
        <div>
          <PaymentTable columns={paymentcoloumns} data={data} />
        </div>
      </div>
    </div>
  );
}

// --- Improved summary card component ---
function SummaryCard({
  label,
  value,
  icon,
  iconBg,
}: {
  label: string;
  value: any;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <div className="flex-1 rounded-xl border border-neutral-200 bg-white p-4 flex flex-col items-start shadow-sm min-w-[180px]">
      <div className="flex items-center gap-2">
        {" "}
        <span
          className={`p-2 rounded-lg ${iconBg} mb-2 flex items-center justify-center`}
        >
          {icon}
        </span>
        <span className="text-xs text-black mb-1">{label}</span>
      </div>
      <span className="text-3xl font-bold text-black">{value}</span>
    </div>
  );
}
