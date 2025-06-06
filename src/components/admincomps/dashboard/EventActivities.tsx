"use client";

import React, { useState, useEffect } from "react";

import { EventTable } from "@/components/admincomps/event/datatable/EventTable";
import { dashEventRegColumns } from "@/components/admincomps/event/datatable/columns";
import { Event } from "../event/datatable/colsdata";

import apiClient from "@/services-admin/apiClient";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

import { handleUnauthorizedRequest } from "@/utils/refresh_token";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

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
import { DashEventReg, DashEventAttendanceTrend } from "@/libs/types";


const chartConfig = {
  desktop: {
    label: "Users",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function EventActivities() {
  const { toast } = useToast();
  const router = useRouter();

  const [eventData, setEventData] = useState<DashEventReg[]>([]);
  const [eventRegistrationTrendData, setEventRegistrationTrendData] = useState<
    DashEventAttendanceTrend[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Retrieve token from local storage

        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${BASE_API_URL}/dashboard/event-registration-trend`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await apiClient.get(
          "/dashboard/event-registration-trend",
          config
        );
        const formattedData = response.map((item: any) => ({
          month: item.month || item.date || item.period,
          people: item.count || item.value || 0,
        }));
        setEventRegistrationTrendData(formattedData);

      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch event registration trend data.",
          variant: "destructive",
        });
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
          url: `${BASE_API_URL}/dashboard/event-attendance`,
          headers: {},
        };

        const response = await apiClient.get(
          "/dashboard/event-attendance",
          config
        );

        setEventData(response);


      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch events data.",
          variant: "destructive",
        });
      }
    }
    fetchEventData();
  }, [router, toast]);

  return (
    <div className=" flex flex-col gap-4 items-start ">
      <div className="flex w-full max-h-[700px] flex-col gap-10">
        <Card>
          <CardHeader>
            <CardTitle>Event Registration Trend for {new Date().getFullYear()}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="max-h-96 w-full" config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={eventRegistrationTrendData}
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
                  dataKey="people"
                  type="linear"
                  stroke="var(--color-desktop)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        {/* Tab sections */}
        <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
          <h2 className="text-xl font-semibold text-left">All Events</h2>
          <div>
            <EventTable columns={dashEventRegColumns} data={eventData} />
          </div>
        </div>{" "}
      </div>
    </div>
  );
}

export default EventActivities;
