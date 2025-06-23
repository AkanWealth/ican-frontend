"use client";

import React, { useState, useEffect } from "react";
import { PaymentTable } from "@/components/admincomps/payment/datatable/PaymentTable";
import { waivercoloumns } from "@/components/admincomps/payment/datatable/columns";
import { WaiverCode } from "@/libs/types";
import CreateWaiver from "@/components/admincomps/billing/actions/CreateWaiver";

import { SummaryCard } from "./Donationsubpage";
import { FiCreditCard, FiUsers, FiBarChart2, FiCalendar } from "react-icons/fi";

import { useToast } from "@/hooks/use-toast";

import { BASE_API_URL } from "@/utils/setter";

import apiClient from "@/services-admin/apiClient";

interface WaiversubpageProps {
  startDate: string;
  endDate: string;
}

export default function Waiversubpage({
  startDate,
  endDate,
}: WaiversubpageProps) {
  const [data, setData] = useState<WaiverCode>();
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

  // Defensive: Ensure data is an array before filtering
  const filteredByDate = Array.isArray(data)
    ? data.filter((d: WaiverCode) => {
        if (!d || !d.createdAt) return false;
        const created = new Date(d.createdAt);
        const start = new Date(startDate);
        // Add one day to endDate to make the filter inclusive of the entire end date
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        // Only include if createdAt is between startDate and endDate (inclusive)
        return created >= start && created <= end;
      })
    : [];

  const totalWaivers = filteredByDate.length;
   const uses = filteredByDate.reduce(
    (sum: number, waiver: { usedBy?: string[] | null }) => {
      // If usedBy is null, undefined, or not an array, treat as 0
      return sum + (Array.isArray(waiver.usedBy) ? waiver.usedBy.length : 0);
    },
    0
  );

  
  /**
   * Count the number of waiver codes where the expiresAt date has not passed.
   * This checks if expiresAt is a valid date string and is in the future (or now).
   */
  const totalActive = filteredByDate.filter((waiver: WaiverCode) => {
    if (!waiver.expiresAt) return false;
    const expires = new Date(waiver.expiresAt);
    // Defensive: Only count if expires is a valid date and in the future
    return !isNaN(expires.getTime()) && expires >= new Date();
  }).length;
  /**
   * Count the number of waiver codes whose expiration date has passed.
   * This checks if expiresAt is a valid date string and is in the past (strictly before now).
   */
  const totalInactive = filteredByDate.filter((waiver: WaiverCode) => {
    if (!waiver.expiresAt) return false;
    const expires = new Date(waiver.expiresAt);
    // Defensive: Only count if expires is a valid date and in the past
    return !isNaN(expires.getTime()) && expires < new Date();
  }).length;

  return (
    <div className="rounded-3xl ">
      {/* --- Donation Summary Cards --- */}
      <div className="flex gap-4 mb-6">
        <SummaryCard
          label="Total Waiver Codes"
          value={totalWaivers ? `${totalWaivers}` : "0"}
          icon={<FiCreditCard size={24} />}
          iconBg="bg-green-100"
        />
        <SummaryCard
          label="Total Uses"
          value={uses}
          icon={<FiUsers size={24} />}
          iconBg="bg-blue-100"
        />
        <SummaryCard
          label="Total Active"
          value={totalActive ? `${totalActive}` : "0"}
          icon={<FiBarChart2 size={24} />}
          iconBg="bg-yellow-100"
        />
        <SummaryCard
          label="Total Inactive"
          value={totalInactive ? `${totalInactive}` : "0"}
          icon={<FiCalendar size={24} />}
          iconBg="bg-purple-100"
        />
      </div>
      {/* --- End Summary Cards --- */}

      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <div className="flex flex-col gap-3"></div>
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
          <PaymentTable columns={waivercoloumns} data={filteredByDate} />
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
