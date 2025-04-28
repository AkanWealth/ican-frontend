"use client";

import React, { useEffect, useState } from "react";
import StatCard from "@/components/genui/StatCard";
import { MdVerifiedUser } from "react-icons/md";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

import { PaymentTable } from "@/components/admincomps/payment/datatable/PaymentTable";
import { dashPaymentcoloumns } from "@/components/admincomps/payment/datatable/columns";
import { OverdueBills } from "@/libs/types";
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
} from "recharts";
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

import { handleUnauthorizedRequest } from "@/utils/refresh_token";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const chartData = [
  { month: "January", amount: 186 },
  { month: "February", amount: 305 },
  { month: "March", amount: 237 },
  { month: "April", amount: 73 },
  { month: "May", amount: 209 },
  { month: "June", amount: 214 },
];
const chartConfig = {
  amount: {
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

  const [paymentData, setPaymentData] = useState<OverdueBills[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token"); // Retrieve token from local storage

        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${BASE_API_URL}/dashboard/payment-data`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.request(config);
        setData(response.data);
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 401
        ) {
          const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${BASE_API_URL}/dashboard/payment-data`,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          };
          await handleUnauthorizedRequest(config, router, setData);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch payment data.",
            variant: "destructive",
          });
        }
      }
    };

    fetchData();
  }, [router, toast]);

  useEffect(() => {
    async function fetchPaymentData() {
      try {
        const token = localStorage.getItem("access_token");
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${BASE_API_URL}/dashboard/overdue-payments`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.request(config);
        const result = response.data;
        setPaymentData(result);
        toast({
          title: "Overdue Payments",
          description: "Overdue payments fetched successfully",
          variant: "default",
        });
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
  return (
    <div className=" flex flex-col gap-4 items-start ">
      <div className="flex flex-row gap-6 items-center justify-start w-full">
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
      </div>{" "}
      <div className="flex w-full max-h-[700px] flex-col gap-10">
        <Card>
          <CardHeader>
            <CardTitle>Payment Trend</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="max-h-96 w-full" config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={chartData}
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
                <Area
                  dataKey="amount"
                  type="natural"
                  stroke="var(--color-desktop)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
          <h2 className="text-xl font-semibold text-left">All Payments</h2>
          <div>
            <PaymentTable columns={dashPaymentcoloumns} data={paymentData} />
          </div>
        </div>{" "}
      </div>
    </div>
  );
}

export default PaymentActivities;
