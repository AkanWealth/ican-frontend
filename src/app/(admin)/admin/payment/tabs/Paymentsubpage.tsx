"use client";

import React, { useState, useEffect } from "react";
import { PaymentTable } from "@/components/admincomps/payment/datatable/PaymentTable";
import { paymentcoloumns } from "@/components/admincomps/payment/datatable/columns";
import ExportPayments from "@/components/admincomps/payment/export/ExportPayments";

import { useToast } from "@/hooks/use-toast";

import { BASE_API_URL } from "@/utils/setter";

import apiClient from "@/services-admin/apiClient";
import { FiCreditCard, FiDownload, FiUsers } from "react-icons/fi";
import { FiBarChart2 } from "react-icons/fi";
import { FiCalendar } from "react-icons/fi";
import { PaymentDetailsTable } from "@/libs/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

// --- Improved summary card component ---
export function SummaryCard({
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

export default function Paymentsubpage() {
  const router = useRouter();
  const [data, setData] = useState<PaymentDetailsTable[]>([]);
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState<"ALL" | "PAID" | "NOT_PAID">(
    "ALL"
  );
  const [filteredData, setFilteredData] = useState<PaymentDetailsTable[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [startDate, setStartDate] = useState<string>("2025-05-01");
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );

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

  useEffect(() => {
    let filtered = data;
    if (selectedTab === "PAID") {
      filtered = data.filter(
        (d) =>
          d.status === "SUCCESS" ||
          d.status === "PARTIALLY_PAID" ||
          d.status === "FULLY_PAID"
      );
    } else if (selectedTab === "NOT_PAID") {
      filtered = data.filter(
        (d) =>
          d.status === "PENDING" ||
          d.status === "FAILED" ||
          d.status === "REFUNDED" ||
          d.status === "NOT_PAID" ||
          d.status === "PARTIALLY_PAID"
      );
    }
    // Sort payments by createdAt descending (most recent first)
    filtered = [...filtered].sort((a, b) => {
      // Parse createdAt as Date, fallback to 0 if invalid
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    setFilteredData(filtered);
  }, [data, selectedTab]);

  // Filtered data with date range
  const filteredByDate = filteredData.filter((d) => {
    if (!d.createdAt) return false;
    const created = new Date(d.createdAt);
    const start = new Date(startDate);
    const end = new Date(endDate);
    // Only include if createdAt is between startDate and endDate (inclusive)
    return created >= start && created <= end;
  });

  const handleSendNotification = async () => {
    if (selectedRows.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one Member",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BASE_API_URL}/billing/send-unpaid-bill-reminders`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      data: { userIds: selectedRows },
    };

    try {
      const result = await apiClient.request(config);

      router.refresh();
      toast({
        title: "Success",
        description: "Notification sent successfully",
        variant: "default",
      });
      setSelectedRows([]);
      setIsLoading(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send Notification",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Sum all amounts where paymentStatus is "PAID"
  const totalAmountPaid = data
    .filter((d) => d.status === "SUCCESS")
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  // Calculate the total amount for payments with paymentStatus "NOT_PAID"
  const totalUnpaid = data
    .filter((d) => d.status === "PENDING")
    .reduce((sum, d) => sum + (d.amount || 0), 0);
  // Calculate the total amount for payments with paymentStatus "WAIVED"
  const totalAmountWaived = data
    .filter((d) => d.status === "WAIVED")
    .reduce((sum, d) => sum + (d.amount || 0), 0);
  // Count the number of payments with paymentStatus "NOT_PAID"
  const totalOverduePayments = data.filter(
    (d) => d.status === "PENDING"
  ).length;

  return (
    <div className="rounded-3xl ">
      {/* Tab Switcher */}

      <div className="flex gap-4 mb-6">
        <SummaryCard
          label="Total Amount Paid"
          value={
            totalAmountPaid ? `₦${totalAmountPaid.toLocaleString()}` : "₦0"
          }
          icon={<FiCreditCard size={24} />}
          iconBg="bg-green-100"
        />
        <SummaryCard
          label="Total Unpaid"
          value={totalUnpaid ? `₦${totalUnpaid.toLocaleString()}` : "₦0"}
          icon={<FiUsers size={24} />}
          iconBg="bg-blue-100"
        />
        <SummaryCard
          label="Amount Waived"
          value={
            totalAmountWaived ? `₦${totalAmountWaived.toLocaleString()}` : "₦0"
          }
          icon={<FiCalendar size={24} />}
          iconBg="bg-purple-100"
        />
        <SummaryCard
          label="Overdue Payments"
          value={
            totalOverduePayments
              ? `₦${totalOverduePayments.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`
              : "₦0"
          }
          icon={<FiBarChart2 size={24} />}
          iconBg="bg-yellow-100"
        />
      </div>
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <div className="flex flex-row justify-between">
          <div className="flex w-fit space-x-4 border-b border-gray-200 mb-4">
            {["ALL", "PAID", "NOT_PAID"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium rounded-t-lg ${
                  selectedTab === tab
                    ? "text-blue-700 border-b-2 border-blue-700 bg-blue-50"
                    : "text-gray-500"
                }`}
                onClick={() =>
                  setSelectedTab(tab as "ALL" | "PAID" | "NOT_PAID")
                }
              >
                {tab === "ALL" ? "All" : tab === "PAID" ? "Paid" : "Unpaid"}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            {/* Date Range Filter with clearer grouping and quick reset */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
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
              {(startDate !== "2025-05-01" || endDate !== format(new Date(), "yyyy-MM-dd")) && (
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

            {/* Export Button with tooltip */}
            <div>
              <ExportPayments data={filteredByDate} />
            </div>

            {/* Send Notice Button with improved feedback and disabled state */}
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                className="gap-2"
                onClick={() => setShowSendDialog(true)}
                disabled={isLoading || selectedRows.length === 0}
                title={
                  selectedRows.length === 0
                    ? "Select at least one member to send notice"
                    : "Send notice to selected members"
                }
              >
                <span>Send Notice</span>
                {isLoading && <Loader2 className="animate-spin" />}
                {selectedRows.length > 0 && (
                  <Badge className="text-white" variant="outline">
                    {selectedRows.length} selected
                  </Badge>
                )}
              </Button>
              {/* Confirmation Dialog */}
              <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Notice</DialogTitle>
                    <DialogDescription>
                      {selectedRows.length === 0 ? (
                        <span className="text-red-500">
                          Please select at least one member to send a notice.
                        </span>
                      ) : (
                        <>
                          Are you sure you want to send notifications to{" "}
                          <span className="font-semibold">{selectedRows.length}</span> member
                          {selectedRows.length !== 1 ? "s" : ""}?
                        </>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowSendDialog(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      onClick={async () => {
                        setShowSendDialog(false);
                        await handleSendNotification();
                      }}
                      disabled={isLoading || selectedRows.length === 0}
                    >
                      {isLoading && <Loader2 className="animate-spin mr-2" />}
                      Confirm
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div>
          <PaymentTable
            columns={paymentcoloumns}
            data={filteredByDate}
            setter={setSelectedRows}
          />
        </div>
      </div>
    </div>
  );
}
