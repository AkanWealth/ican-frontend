"use client";

import React, { useState, useEffect } from "react";
import StatCard from "@/components/genui/StatCard";
import { MdVerifiedUser } from "react-icons/md";

import { EventTable } from "@/components/admincomps/event/datatable/EventTable";
import { allcolumns } from "@/components/admincomps/event/datatable/columns";
import { Event } from "../event/datatable/colsdata";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

import { handleUnauthorizedRequest } from "@/utils/refresh_token";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

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
  { month: "January", people: 186 },
  { month: "February", people: 305 },
  { month: "March", people: 237 },
  { month: "April", people: 73 },
  { month: "May", people: 209 },
  { month: "June", people: 214 },
];
const chartConfig = {
  people: {
    label: "People",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function EventActivities() {
  const { toast } = useToast();
  const router = useRouter();

  const [eventData, setEventData] = useState<Event[]>([]);
  const [data, setData] = useState({
    totalPayments: 0,
    pendingPayments: 0,
    completedPayments: 0,
    failedPayments: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("access_token="))
          ?.split("=")[1]; // Retrieve token from cookies

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
          const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("access_token="))
            ?.split("=")[1]; // Retrieve token from cookies
          const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${BASE_API_URL}/dashboard/payment-data`,
            headers: {
              Authorization: `Bearer ${token}`,
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
    async function fetchEventData() {
      try {
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${BASE_API_URL}/events`,
          headers: {},
        };

        const response = await axios.request(config);
        const upcomingEvents = response.data.data.filter(
          (event: Event) => event.status === "upcoming"
        );
        setEventData(upcomingEvents);
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 401
        ) {
          const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("access_token="))
            ?.split("=")[1]; // Retrieve token from cookies
          const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${BASE_API_URL}/events`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          await handleUnauthorizedRequest(config, router, setEventData);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch events data.",
            variant: "destructive",
          });
        }
      }
    }
    fetchEventData();
  }, [router, toast]);

  return (
    <div className=" flex flex-col gap-4 items-start ">
      <div className="flex w-full max-h-[700px] flex-col gap-10">
        <Card>
          <CardHeader>
            <CardTitle>Event Registration Trend</CardTitle>
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
                  dataKey="people"
                  type="natural"
                  stroke="var(--color-desktop)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        {/* Tab sections */}
        <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
          <h2 className="text-xl font-semibold text-left">All Events</h2>
          <div>
            <EventTable columns={allcolumns} data={eventData} />
          </div>
        </div>{" "}
      </div>
    </div>
  );
}

export default EventActivities;
