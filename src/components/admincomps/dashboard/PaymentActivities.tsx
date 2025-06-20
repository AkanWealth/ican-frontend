"use client";

import React, { useEffect, useState } from "react";
import StatCard from "@/components/genui/StatCard";
import { MdVerifiedUser } from "react-icons/md";
import { LiaDownloadSolid } from "react-icons/lia";

import apiClient from "@/services-admin/apiClient";

import { BASE_API_URL } from "@/utils/setter";

import { PaymentTable } from "@/components/admincomps/payment/datatable/PaymentTable";
import { dashPaymentcoloumns } from "@/components/admincomps/payment/datatable/columns";
import {
  OverdueBills,
  DashEventPaymentTrend,
  UpdatedBillingStats,
} from "@/libs/types";
import { Line, LineChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const chartConfig = {
  desktop: {
    label: "Amount",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;
function PaymentActivities() {
  const [data, setData] = useState({
    totalPayments: 0,
    pendingPayments: 0,
    completedPayments: 0,
    failedPayments: 0,
  });
  const router = useRouter();
  const { toast } = useToast();
  const [paymentTrendData, setPaymentTrendData] = useState<
    DashEventPaymentTrend[]
  >([]);

  const [paymentData, setPaymentData] = useState<OverdueBills[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Retrieve token from local storage

        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${BASE_API_URL}/dashboard/payment-data`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await apiClient.get("/dashboard/payment-data", config);
        setData(response);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch payment data.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [router, toast]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Retrieve token from local storage

        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${BASE_API_URL}/dashboard/paymenttrend`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await apiClient.get("/dashboard/paymenttrend", config);
        const formattedData = response.map((item: any) => ({
          month: item.month || item.date || item.period,
          total: item.totalPaid || 0,
        }));
        setPaymentTrendData(formattedData);
      } catch (error) {
        console.error(error);

        toast({
          title: "Error",
          description: "Failed to fetch payment activities data.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [router, toast]);

  useEffect(() => {
    async function fetchPaymentData() {
      try {
        const token = localStorage.getItem("accessToken");
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${BASE_API_URL}/dashboard/overdue-payments`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await apiClient.get(
          "/dashboard/overdue-payments",
          config
        );

        setPaymentData(response);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch overdue payments.",
          variant: "destructive",
        });
      }
    }
    fetchPaymentData();
  }, [toast]);

  // Function to export data as PDF
  const exportAsPDF = () => {
    try {
      // For simplicity, we'll redirect to print view which can be saved as PDF
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Failed to open print window");
      }

      // Create a simple HTML representation of the data
      printWindow.document.write(`
        <html>
          <head>
            <title>Payment Activities Report - ${new Date().toLocaleDateString()}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1, h2 { color: #333; }
              table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Payment Activities Report</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            
            <h2>Payment Statistics</h2>
            <table>
              <tr>
                <th>Total Payments</th>
                <th>Pending Payments</th>
                <th>Completed Payments</th>
                <th>Failed Payments</th>
              </tr>
              <tr>
                <td>${data.totalPayments}</td>
                <td>${data.pendingPayments}</td>
                <td>${data.completedPayments}</td>
                <td>${data.failedPayments}</td>
              </tr>
            </table>
            
            <h2>Payment Trend</h2>
            <table>
              <tr>
                <th>Month</th>
                <th>Total Amount</th>
              </tr>
              ${paymentTrendData
                .map(
                  (item) => `   
                <tr>
                  <td>${item.month}</td>
                  <td>${item.total}</td>
                </tr>
              `
                )
                .join("")}
            </table>
            
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export payment data as PDF",
        variant: "destructive",
      });
    }
  };

  // Handle export based on selected format
  const handleExport = (format: "pdf") => {
    exportAsPDF();
  };

  return (
    <div className=" flex flex-col gap-4 items-start ">
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row gap-6 items-center">
          <StatCard
            name="Total Payments"
            metric={data?.totalPayments}
            Icon={MdVerifiedUser}
          />
          <StatCard
            name="Pending Payments"
            metric={data?.pendingPayments}
            Icon={MdVerifiedUser}
          />
          <StatCard
            name="Completed Payment"
            metric={data?.completedPayments}
            Icon={MdVerifiedUser}
          />
          <StatCard
            name="Failed Payment"
            metric={data?.failedPayments}
            Icon={MdVerifiedUser}
          />
        </div>

        {/* Export Data Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 ml-4">
              <LiaDownloadSolid className="h-4 w-4" />
              Export Data
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleExport("pdf")}>
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex w-full max-h-[700px] flex-col gap-10">
        <Card>
          <CardHeader>
            <CardTitle>Annual Payment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="max-h-96 w-full p-4"
              config={chartConfig}
            >
              <LineChart
                accessibilityLayer
                data={paymentTrendData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="total"
                  type="linear"
                  stroke="var(--color-desktop)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
          <h2 className="text-xl font-semibold text-left">Overdue Payments</h2>
          <div>
            <PaymentTable columns={dashPaymentcoloumns} data={paymentData} />
          </div>
        </div>{" "}
      </div>
    </div>
  );
}

export default PaymentActivities;
