"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";
import { PaymentTable } from "@/components/admincomps/payment/datatable/PaymentTable";

import ExportBilling from "@/components/admincomps/billing/export/ExportBilling";

import { AuthProvider } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";
import { AdminProtectedRoute } from "@/app/(admin)/admin/LoginAuthentication/AdminProtectedRoute";

import apiClient from "@/services-admin/apiClient";

import { billingdetailscoloumns } from "@/components/admincomps/payment/datatable/columns";

import { BASE_API_URL } from "@/utils/setter";
import {
  BillingDetails,
  BillingPaymentTable,
  UpdatedBillingStats,
  WaiverCode,
} from "@/libs/types";

import CreateWaiver from "@/components/admincomps/billing/actions/CreateWaiver";

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
  const [paymentData, setPaymentData] = useState<BillingPaymentTable[]>([]);
  const [billingStats, setBillingStats] = useState<UpdatedBillingStats>();
  const [waivers, setWaivers] = useState<WaiverCode[]>([]);

  const [isWaiver, setisWaiver] = useState(false);

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
        setPaymentData(result.Payment);
        console.log(result);
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

    async function fetchWaivers() {
      const billingId = (await params).id;
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/payments/waivers`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };

      try {
        const result = await apiClient.get("/payments/waivers", config);
        const filteredWaivers = result.filter(
          (waiver: WaiverCode) => waiver.billingId === billingId
        );
        setWaivers(filteredWaivers);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch waivers data.",
          variant: "destructive",
        });
      }
    }

    fetchData();
    fetchStats();
    fetchWaivers();
  }, [params, router, toast]);

  // Add this helper function to format the date
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Sort waivers by expiration date
  const sortedWaivers = [...waivers].sort(
    (a, b) => new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime()
  );

  const deleteWaiver = async (waiverId: string) => {
    const config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${BASE_API_URL}/payments/waivers/${waiverId}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    try {
      const result = await apiClient.delete(
        `/payments/waivers/${waiverId}`,
        config
      );
      toast({
        title: "Success",
        description: "Waiver deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete waiver.",
        variant: "destructive",
      });
    } finally {
      window.location.reload();
    }
  };

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
        <div className="flex flex-row gap-2">
          <button
            onClick={() => setisWaiver(!isWaiver)}
            className="flex flex-row items-center gap-2 text-white bg-primary px-4 py-2 rounded-md"
          >
            {" "}
            Create Waiver Code
          </button>
          <ExportBilling data={data ? [data] : []} />
        </div>
      </div>
      {/* Tab sections */}
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">Billing Details</h2>
        <hr />
        <div className="w-full flex flex-row justify-between gap-10">
          <div className="grid grid-cols-2 gap-8 w-full">
            <div className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-all">
              <h3 className="text-lg font-semibold mb-4">Bill Information</h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-600">Bill Name</span>
                  <span className="text-base font-medium text-black">
                    {data?.name || "-"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-600">Bill Frequency</span>
                  <span className="text-base font-medium text-black">
                    {data?.frequency
                      ? data.frequency.charAt(0).toUpperCase() +
                        data.frequency.slice(1).toLowerCase().replace(/_/g, " ")
                      : "-"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-600">Bill Amount</span>
                  <span className="text-base font-medium text-black">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(data?.amount || 0)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-600">Recipients</span>
                  <span className="text-base font-medium text-black capitalize">
                    All Members
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-all">
              <h3 className="text-lg font-semibold mb-4">Payment Statistics</h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-600">
                    Total Members Affected
                  </span>
                  <span className="text-base font-medium text-black">
                    {billingStats?.totalUsersAffected || 0}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-600">Unpaid Members</span>
                  <span className="text-base font-medium text-red-600">
                    {billingStats?.totalUsersNotPaid || 0}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-600">
                    Total Amount Paid
                  </span>
                  <span className="text-base font-medium text-green-600">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(billingStats?.totalAmountPaid || 0)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-600">
                    Total Amount Due
                  </span>
                  <span className="text-base font-medium text-red-600">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(
                      (billingStats?.totalBillingAmount || 0) *
                        (billingStats?.totalUsersNotPaid || 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-lg  mx-auto  text-neutral-600">
              Bill payment statistics
            </p>

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
      </div>
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">Waiver Codes</h2>
        <hr />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {waivers.length === 0 ? (
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg text-gray-500 text-center">
                  No waiver codes created yet
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-400">
                  Click the "Create Waiver Code" button above to add your first
                  waiver
                </p>
              </CardContent>
            </Card>
          ) : (
            waivers.map((waiver) => (
              <Card
                key={waiver.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-mono">
                    {waiver.code}
                  </CardTitle>
                  <CardDescription>
                    Expires: {formatDateTime(waiver.expiresAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span
                        className={`text-sm font-medium ${
                          new Date(waiver.expiresAt) > new Date()
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {new Date(waiver.expiresAt) > new Date()
                          ? "Active"
                          : "Expired"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Created by:</span>
                      <span className="text-sm font-medium">
                        {waiver?.createdBy?.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Used by:</span>
                      <span className="text-sm font-medium">
                        {waiver?.usedBy?.length || 0} users
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <button
                    onClick={() => deleteWaiver(waiver.id)}
                    className="w-full text-sm text-red-600 hover:text-red-700 hover:bg-red-50 py-2 px-4 rounded-md transition-colors"
                  >
                    Delete Waiver
                  </button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">
          Successful Payment Details
        </h2>
        <hr />
        <PaymentTable data={paymentData} columns={billingdetailscoloumns} />
      </div>
      {isWaiver && (
        <CreateWaiver
          isOpen={isWaiver}
          onClose={() => setisWaiver(false)}
          billingId={data?.id || ""}
          createdById={data?.createdById || ""}
          mode="billing"
        />
      )}
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
