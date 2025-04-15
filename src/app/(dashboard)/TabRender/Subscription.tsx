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

const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch subscription data from the API
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("User is not authenticated. Please log in again.");
          return;
        }

        const response = await axios.get(
          "https://ican-api-6000e8d06d3a.herokuapp.com/api/payments/outstanding-breakdown",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSubscriptions(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch subscription data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch subscription data.",
          variant: "destructive",
        });
      }
    };

    fetchSubscriptionData();
  }, [toast]); // Add 'toast' to the dependency array

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDateSelect = (date: string) => {
    const selectedDate = new Date(date);

    const filteredSubscriptions = subscriptions.filter((subscription: any) => {
      const subscriptionDate = new Date(subscription.date);
      return (
        subscriptionDate.getDate() === selectedDate.getDate() &&
        subscriptionDate.getMonth() === selectedDate.getMonth() &&
        subscriptionDate.getFullYear() === selectedDate.getFullYear()
      );
    });

    setSubscriptions(filteredSubscriptions);
  };

  const resetSubscriptions = () => {
    setSearchQuery("");
    setLoading(true);
    const fetchSubscriptionData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("User is not authenticated. Please log in again.");
          return;
        }

        const response = await axios.get(
          'https://ican-api-6000e8d06d3a.herokuapp.com/api/payments/outstanding-breakdown',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSubscriptions(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to reset subscriptions:", error);
      }
    };

    fetchSubscriptionData();
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return subscriptions.slice(startIndex, startIndex + itemsPerPage);
  };

  const renderStatusBadge = (status: string) => {
    if (status === "unpaid") {
      return (
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
            <XCircle className="mr-1 h-3 w-3 rounded-full " />
            Unpaid
          </span>
        </div>
      );
    } else if (status === "partially paid") {
      return (
        <div className="flex flex-col">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
            <TriangleAlert className="mr-1 h-3 w-3 rounded-full " />
            Partially Paid
          </span>
        </div>
      );
    } else if (status === "paid") {
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
          <div className="flex justify-between items-center w-full">
            <div className="relative group w-3/4">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search by title, tag, or category..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full h-10 pl-10 pr-4 rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-blue-500 text-black border border-gray-500 placeholder:text-black"
              />
            </div>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCalendarOpen(!isCalendarOpen);
                }}
                className="flex items-center gap-2 px-4 py-2 border border-gray-500 rounded-lg hover:bg-gray-50"
              >
                <ListFilter className="h-4 w-4" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <CalendarFilter
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                onSelect={handleDateSelect}
              />
            </div>
          </div>

          {subscriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-center text-gray-500 py-4">
                No subscription payments found for the selected date.
              </p>
              <button
                onClick={resetSubscriptions}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full justify-center item-center border-b border-gray-200 px-10 mt-6">
                <thead className="border-b border-t-none border-gray-300">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                      Subscription Period
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                      Base Fee(₦)
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                      Discount(₦)
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                      Total Amount(₦)
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {getCurrentItems().map((sub: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {sub.SubscriptionPeriod}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {sub.BaseFee}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {sub.Discount}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {parseInt(sub.BaseFee.replace(/,/g, "")) -
                          parseInt(sub.Discount.replace(/,/g, ""))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(sub.status)}
                      </td>
                      <td className="px-6 py-4">
                        {sub.Action && (
                          <button className="px-6 py-2 bg-primary text-white text-sm rounded-lg hover:bg-blue-700">
                            Pay now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <TablePagination
            currentPage={currentPage}
            totalPages={Math.ceil(subscriptions.length / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Subscription;