"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";
import { PaymentTable } from "@/components/admincomps/payment/datatable/PaymentTable";

import { AuthProvider } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";
import { AdminProtectedRoute } from "@/app/(admin)/admin/LoginAuthentication/AdminProtectedRoute";

import apiClient from "@/services-admin/apiClient";

import { billingdetailscoloumns } from "@/components/admincomps/payment/datatable/columns";

import { BASE_API_URL } from "@/utils/setter";
import {
  BillingDetails,
  BillingPaymentTable,
  UpdatedBillingStats,
} from "@/libs/types";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  paid: {
    label: "Paid",
    color: "#22c55e", // green
  },
  unpaid: {
    label: "Unpaid",
    color: "#eab308", // yellow
  },
} satisfies ChartConfig;

import { useToast } from "@/hooks/use-toast";

function BillingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { toast } = useToast();

  const [data, setData] = useState<BillingDetails>();
  const [billingStats, setBillingStats] = useState<UpdatedBillingStats>();

  const chartData = [
    {
      status: "paid",
      trans_no: billingStats?.totalUsersPaid,
      fill: "var(--color-paid)",
    },
    {
      status: "unpaid",
      trans_no: billingStats?.totalUsersNotPaid,
      fill: "var(--color-unpaid)",
    },
  ];

  useEffect(() => {
    async function fetchData() {
      const billingId = (await params).id;
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/billing/${billingId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };
      try {
        const result = await apiClient.get(`/billing/${billingId}`, config);

        setData(result);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch billing data.",
          variant: "destructive",
        });
      }
    }
    async function fetchStats() {
      const billingId = (await params).id;
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/dashboard/billing-stats/${billingId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };
      try {
        const result = await apiClient.get(
          `/dashboard/billing-stats/${billingId}`,
          config
        );

        setBillingStats(result.data);
        console.log(result.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch billing stats.",
          variant: "destructive",
        });
      }
    }

    fetchData();
    fetchStats();
  }, [params, router, toast]);

  return (
    <div className="rounded-3xl flex flex-col gap-6 p-6">
      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.back()}
            className="flex flex-row items-center gap-2 text-primary"
          >
            <MdArrowBack className="w-6 h-6" /> Back
          </button>
          <h2 className="font-semibold text-2xl text-black">Billing Details</h2>
          <p>View billings and payments here</p>
        </div>
      </div>
      {/* Tab sections */}
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">Billing Details</h2>
        <hr />
        <div className="w-full flex flex-row justify-between gap-10">
          <div className="grid grid-cols-2 gap-6">
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Bill Name
              <span className="text-base text-black font-medium">
                {data?.name}
              </span>
            </p>
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Bill Frequency
              <span className="text-base text-black font-medium">
                {data?.frequency
                  ? data.frequency.charAt(0).toUpperCase() +
                    data.frequency.slice(1).toLowerCase().replace(/_/g, " ")
                  : "-"}
              </span>
            </p>
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Bill Amount{" "}
              <span className="text-base text-black font-medium">
                {data?.amount}
              </span>
            </p>{" "}
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Reciepients{" "}
              <span className="text-base text-black font-medium">all</span>
            </p>{" "}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Total Members Affected
              <span className="text-base text-black font-medium">
                {billingStats?.totalUsersAffected}
              </span>
            </p>
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Total Amount Paid
              <span className="text-base text-black font-medium">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(billingStats?.totalAmountPaid || 0)}
              </span>
            </p>
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Total Amount Due
              <span className="text-base text-black font-medium">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(
                  (billingStats?.totalBillingAmount || 0) *
                    (billingStats?.totalUsersNotPaid || 0)
                )}
              </span>
            </p>{" "}
            <p className=" text-sm text-neutral-600 flex flex-col gap-1">
              Reciepients{" "}
              <span className="text-base text-black font-medium">all</span>
            </p>{" "}
          </div>

          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square   min-h-[250px] px-0"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="trans_no"
                labelLine={false}
                label={({ payload, ...props }) => {
                  return (
                    <text
                      cx={props.cx}
                      cy={props.cy}
                      x={props.x}
                      y={props.y}
                      textAnchor={props.textAnchor}
                      dominantBaseline={props.dominantBaseline}
                      fill="hsla(var(--foreground))"
                      className="font-medium"
                    >
                      {payload.trans_no}
                    </text>
                  );
                }}
                nameKey="status"
              />
            </PieChart>
          </ChartContainer>
        </div>
      </div>
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">
          Successful Payment Details
        </h2>
        <hr />
        <PaymentTable
          data={(data?.Payment || []) as BillingPaymentTable[]}
          columns={billingdetailscoloumns}
        />
      </div>
    </div>
  );
}

export default function PackedBillingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AuthProvider>
      <AdminProtectedRoute>
        <BillingDetailsPage params={params} />
      </AdminProtectedRoute>
    </AuthProvider>
  );
}
