"use client";

import React, { useState, useEffect } from "react";

import StatCard from "@/components/genui/StatCard";
import {
  LiaUserCheckSolid,
  LiaUserMinusSolid,
  LiaUserTimesSolid,
} from "react-icons/lia";
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

import { handleUnauthorizedRequest } from "@/utils/refresh_token";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { DashUserLogin } from "@/libs/types";

function UserActivities() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginChartData, setLoginChartData] = useState<DashUserLogin>({
    weeklyLogins: [],
    monthlyLogins: [],
    yearlyLogins: [],
  });
  const [weeklyChartData, setWeeklyChartData] = useState<any[]>([]);
  const [monthlyChartData, setMonthlyChartData] = useState<any[]>([]);
  const [yearlyChartData, setYearlyChartData] = useState<any[]>([]);
  const router = useRouter();
  const [data, setData] = useState({
    activeUsers: 0,
    suspendedUsers: 0,
    deactivatedUsers: 0,
  });
  const [loginStats, setLoginStats] = useState({
    totalWeeklyLogins: 0,
    totalMonthlyLogins: 0,
    totalYearlyLogins: 0,
  });

  const [activeChart, setActiveChart] = useState<
    "weekly" | "monthly" | "yearly"
  >("weekly");

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
        toast({
          title: "User Activities",
          description: "User activities data fetched successfully.",
          variant: "default",
        });
      } catch (error) {
        console.error(error);
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 401
        ) {
          const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${BASE_API_URL}/dashboard/user-activity`,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          };
          await handleUnauthorizedRequest(config, router, setData);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch user activities data.",
            variant: "destructive",
          });
        }
      }
    };

    fetchData();
  }, [router, toast]);

  useEffect(() => {
    const fetchLoginStats = async () => {
      try {
        const token = localStorage.getItem("access_token"); // Retrieve token from local storage

        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${BASE_API_URL}/dashboard/login-stats`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.request(config);
        setLoginStats(response.data.data);
        console.log(response.data.data);
        toast({
          title: "User Login Stats",
          description: "User login stats fetched successfully.",
          variant: "default",
        });
      } catch (error) {
        console.error(error);
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 401
        ) {
          const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${BASE_API_URL}/dashboard/login-stats`,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          };
          await handleUnauthorizedRequest(config, router, setLoginStats);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch user login stats.",
            variant: "destructive",
          });
        }
      }
    };

    fetchLoginStats();
  }, [router, toast]);

  const processLoginChartData = (loginData: DashUserLogin) => {
    const weeklyData = loginData.weeklyLogins.map((item) => ({
      label: new Date(item.day).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      desktop: item.count,
      tooltip: new Date(item.day).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));
    setWeeklyChartData(weeklyData);

    const monthlyData = loginData.monthlyLogins.map((item) => {
      const [year, week] = item.week.split("-");
      return {
        label: `Week ${week}`,
        desktop: item.count,
        tooltip: `Week ${week}, ${year}`,
      };
    });
    setMonthlyChartData(monthlyData);

    const yearlyData = loginData.yearlyLogins.map((item) => {
      const [year, month] = item.month.split("-");
      const monthName = new Date(
        parseInt(year),
        parseInt(month) - 1,
        1
      ).toLocaleDateString("en-US", { month: "long" });
      return {
        label: monthName,
        desktop: item.count,
        tooltip: `${monthName} ${year}`,
      };
    });
    setYearlyChartData(yearlyData);
  };

  useEffect(() => {
    const fetchLoginChartData = async () => {
      const token = localStorage.getItem("access_token");

      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/dashboard/chart-stats`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.request(config);
        setLoginChartData(response.data);
        processLoginChartData(response.data);
        toast({
          title: "Success",
          description: "Chart data fetched successfully",
          variant: "default",
        });
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          await handleUnauthorizedRequest(config, router, (data) => {
            setLoginChartData(data);
            processLoginChartData(data);
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch chart data",
            variant: "destructive",
          });
        }
      }
    };

    fetchLoginChartData();
  }, [router, toast]);

  const chartOptions = [
    {
      id: "weekly",
      label: "Weekly",
      data: weeklyChartData,
      title: "Weekly Login Activity",
      subtitle: "Last 7 days",
    },
    {
      id: "monthly",
      label: "Monthly",
      data: monthlyChartData,
      title: `${new Date().toLocaleString("default", {
        month: "long",
      })} Login Activity`,
      subtitle: "Last 4 weeks",
    },
    {
      id: "yearly",
      label: "Yearly",
      data: yearlyChartData,
      title: "Yearly Login Activity",
      subtitle: "Last 12 months",
    },
  ];

  const renderLoginChart = (
    data: any[],
    title: string,
    description: string
  ) => (
    <Card>
      <CardHeader className="hidden">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-96 w-full" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data.length > 0 ? data : chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel labelKey="tooltip" />}
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
  );

  return (

    <div className="flex flex-col gap-4 items-start">
      <div className="flex flex-row gap-2 items-center justify-start w-full">
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
      </div>{" "}
      <div className="flex flex-row gap-2 items-center justify-start w-full">
        <StatCard
          name="Total Weekly Logins"
          metric={loginStats?.totalWeeklyLogins}
          Icon={LiaUserCheckSolid}
        />
        <StatCard
          name={`Total ${new Date().toLocaleString('default', { month: 'long' })} Logins`}
          metric={loginStats?.totalMonthlyLogins}
          Icon={LiaUserMinusSolid}
        />
        <StatCard
          name="Total Yearly Logins"
          metric={loginStats?.totalYearlyLogins}
          Icon={LiaUserTimesSolid}
        />
      </div>{" "}
      <div className="flex w-full max-h-[700px] flex-col gap-10">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  {chartOptions.find((opt) => opt.id === activeChart)?.title}
                </CardTitle>
                <CardDescription>
                  {chartOptions.find((opt) => opt.id === activeChart)?.subtitle}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {chartOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() =>
                      setActiveChart(
                        option.id as "weekly" | "monthly" | "yearly"
                      )
                    }
                    className={`px-3 py-1 rounded-md text-sm ${
                      activeChart === option.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderLoginChart(
              chartOptions.find((opt) => opt.id === activeChart)?.data || [],
              chartOptions.find((opt) => opt.id === activeChart)?.title || "",
              chartOptions.find((opt) => opt.id === activeChart)?.subtitle || ""
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserActivities;
