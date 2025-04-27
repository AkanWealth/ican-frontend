"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  ListFilter,
  ChevronDown,
  XCircle,
  TriangleAlert,
  CheckCircle,
} from "lucide-react";
import CalendarFilter from "@/components/homecomps/CalendarFilter";
import TablePagination from "@/components/Pagenation";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/services/apiClient";
import { parseCookies } from "nookies";

const Subscription = () => {
  interface SubscriptionData {
    name: string;
    amount: number;
    totalPaid: number;
    balance: number;
    paymentStatus: string;
  }
  
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  interface UserData {
    id: string;
    email?: string;
    phoneNumber?: string;
    fullName?: string;
  }

  // useEffect(() => {
  //   // Get user data from cookies
  //   const cookies = parseCookies();
  //   const userDataCookie = cookies["user_data"];
  //   const parsedUserData = userDataCookie ? JSON.parse(userDataCookie) : null;
  //   setUserData(parsedUserData);
  // }, []);

  // const userId = userData?.id;
  // console.log("User ID:", userId);
  // console.log("User Data:", userData);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (typeof window === "undefined") return; // Ensure code runs only on the client side
      setLoading(true); // Set loading to true before fetching data
      try {
       
  const cookies = parseCookies();
        const userDataCookie = cookies['user_data'];
        const userData = userDataCookie ? JSON.parse(userDataCookie) : null;
        const userId = userData?.id;
        console.log("userId", userId);
        const response = await apiClient.get(`/billing/user/${userId}/billings`);
        console.log("API Response:", response);

        // Ensure the response is an array
        const data = Array.isArray(response) ? response : [];
        console.log("Filtered Data:", data);

        // Filter only subscriptions with FULLY_PAID status
        const filteredSubscriptions = data.filter(
          (item: any) =>
            item.type === "Subscription" && item.paymentStatus === "FULLY_PAID"
        );

        console.log("Filtered Subscriptions:", filteredSubscriptions);

        setSubscriptions(filteredSubscriptions);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch subscription data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch subscription data.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [toast, userData]);

  const renderStatusBadge = (status: string) => {
    if (status === "NOT_PAID") {
      return (
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
            <XCircle className="mr-1 h-3 w-3 rounded-full " />
            Unpaid
          </span>
        </div>
      );
    } else if (status === "PARTIALLY_PAID") {
      return (
        <div className="flex flex-col">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
            <TriangleAlert className="mr-1 h-3 w-3 rounded-full " />
            Partially Paid
          </span>
        </div>
      );
    } else if (status === "FULLY_PAID") {
      return (
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
            <CheckCircle className="mr-1 h-3 w-3 rounded-full" />
            Paid
          </span>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto">
        <div className="bg-white w-full flex flex-col item-center rounded-xl border border-gray-300 p-6 mb-10">
          <h1 className="font-medium text-lg mb-6">Subscription Payment</h1>
          {subscriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-center text-gray-500 py-4">
                No subscription payments found.
              </p>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full justify-center item-center border-b border-gray-200 px-10 mt-6">
                <thead className="border-b border-t-none border-gray-300">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                      Name
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                      Amount(₦)
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                      Total Paid(₦)
                    </th>
                    {/* <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                      Balance(₦)
                    </th> */}
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {subscriptions.map((sub: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {sub.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {sub.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {sub.totalPaid.toLocaleString()}
                      </td>
                      {/* <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {sub.balance.toLocaleString()}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(sub.paymentStatus)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscription;