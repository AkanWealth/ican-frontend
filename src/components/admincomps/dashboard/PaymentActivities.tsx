"use client";

import React, { useEffect, useState } from "react";
import StatCard from "@/components/genui/StatCard";
import { MdVerifiedUser } from "react-icons/md";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

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
import { request } from "http";
import { url } from "inspector";
import { headers } from "next/headers";
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
         console.error(error);
       }
     };

     fetchData();
   }, []);
  return (
    <div className=" flex flex-col gap-4 items-start ">
      <div className="flex flex-row gap-2 items-center justify-start w-full">
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
        <h1>User payment data table</h1>
      </div>
    </div>
  );
}

export default PaymentActivities;
