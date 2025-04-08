"use client";

import React, { useState, useEffect } from "react";
import StatCard from "@/components/genui/StatCard";
import {
  LiaUserCheckSolid,
  LiaUserMinusSolid,
  LiaUserTimesSolid,
} from "react-icons/lia";
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
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];
const chartConfig = {
  desktop: {
    label: "Users",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

function UserActivities() {
  const [data, setData] = useState({
    activeUsers: 0,
    suspendedUsers: 0,
    deactivatedUsers: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token"); // Retrieve token from local storage

        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${BASE_API_URL}/dashboard/user-activity`,
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
      <div className="flex flex-row gap-2 items-center justify-between w-full">
        <StatCard
          name="No of Active Users"
          metric={data?.activeUsers}
          Icon={LiaUserCheckSolid}
        />
        <StatCard
          name="No of Suspened Users"
          metric={data?.suspendedUsers}
          Icon={LiaUserMinusSolid}
        />
        <StatCard
          name="No of Deactivated Users"
          metric={data?.deactivatedUsers}
          Icon={LiaUserTimesSolid}
        />
      </div>
      <div className="flex w-full max-h-[700px] flex-col gap-10">
        <Card>
          <CardHeader>
            <CardTitle>User Registration Trend</CardTitle>
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
                  dataKey="desktop"
                  type="natural"
                  stroke="var(--color-desktop)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User Login Activity</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="max-h-96 w-full" config={chartConfig}>
              <LineChart
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
                <Line
                  dataKey="desktop"
                  type="natural"
                  stroke="var(--color-desktop)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserActivities;
