"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Checkbox } from "@mui/material";
import CalendarFilter from "@/components/homecomps/CalendarFilter";
import TablePagination from "@/components/Pagenation";

import { useToast } from "@/hooks/use-toast";
import {
  X,
  Search,
  ListFilter,
  ChevronDown,
  XCircle,
  TriangleAlert,
  CheckCircle,
} from "lucide-react";

import apiClient from "@/services/apiClient";
import { parseCookies } from "nookies";
import PaymentModal from "@/components/Modal/PaymentModal";
import paymentService from "@/services/PaymentService";

interface Activity {
  amountLeft?: string;
  AmountDue: string;
  date: string;
  PaymentType: string;
  status: string;
  id: string;
}

const Outstanding = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [originalActivities, setOriginalActivities] = useState<Activity[]>([]); // Store original data
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isTotalModalOpen, setIsTotalModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [partialAmount, setPartialAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedBillingId, setSelectedBillingId] = useState("");
  const [userData, setUserData] = useState({
    email: "",
    phoneNumber: "",
    fullName: ""
  });
  const { toast } = useToast();

  // Function to fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const cookies = parseCookies();
        const userId = cookies.userId;
        if (userId) {
          const userResponse = await apiClient.get(`/users/${userId}`);
          setUserData({
            email: userResponse.email || "",
            phoneNumber: userResponse.phoneNumber || "",
            fullName: userResponse.fullName || ""
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    
    fetchUserData();
  }, []);

  // Function to fetch outstanding data
  const fetchOutstandingData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch total outstanding payment
      const response = await apiClient.get("/payments/total-outstanding");
      const totalOutstanding = response.totalOutstanding || 0;

      // Fetch outstanding breakdown
      const outstandingBreakdownResponse = await apiClient.get(
        "/payments/outstanding-breakdown"
      );

      // Transform the data to match your component's expected structure
      const transformedData = Array.isArray(outstandingBreakdownResponse)
        ? outstandingBreakdownResponse.map((item) => ({
            PaymentType: item.paymentType,
            AmountDue: item.amount.toString(),
            date: new Date(item.datePaid).toLocaleDateString(),
            status: item.status,
            id: item.id,
          }))
        : [];

      // Update state with transformed API data
      setTotalOutstanding(totalOutstanding);
      setActivities(transformedData);
      setOriginalActivities(transformedData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch outstanding data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch outstanding data.",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOutstandingData();
  }, [itemsPerPage, toast, fetchOutstandingData]);

  // Handle payment success
  const handlePaymentSuccess = async (paymentData: {
    billingId: string;
    paymentType: string;
    amount: number;
    transactionId: string;
    status: string;
  }) => {
    try {
      const cookies = parseCookies();
      const userId = cookies.userId;
      
      await paymentService.processPayment(userId, paymentData.billingId, {
        amount: paymentData.amount,
        paymentType: paymentData.paymentType,
        transactionId: paymentData.transactionId
      });
      
      toast({
        title: "Payment Successful",
        description: `Your payment of ₦${paymentData.amount.toLocaleString()} has been processed successfully.`,
        variant: "default",
        duration: 3000,
      });
      
      // Refresh the data
      fetchOutstandingData();
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error("Payment processing failed:", error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Handle settle all payments
  const handleSettleAllPayments = async (paymentData: {
    paymentType: string;
    amount: number;
    transactionId: string;
    status: string;
  }) => {
    try {
      const cookies = parseCookies();
      const userId = cookies.userId;
      
      // Get all selected billing IDs
      const selectedBillingIds = selectedItems.map(index => {
        const realIndex = (currentPage - 1) * itemsPerPage + index;
        return activities[realIndex].id;
      });
      
      await paymentService.processSettleAllPayment({
        userId,
        amount: paymentData.amount,
        paymentType: paymentData.paymentType,
        transactionId: paymentData.transactionId,
        billingIds: selectedBillingIds
      });
      
      toast({
        title: "Payments Successful",
        description: `Your payments totaling ₦${paymentData.amount.toLocaleString()} have been processed successfully.`,
        variant: "default",
        duration: 3000,
      });
      
      // Refresh the data
      fetchOutstandingData();
      setIsTotalModalOpen(false);
      setSelectedItems([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Bulk payment processing failed:", error);
      toast({
        title: "Payments Failed",
        description: "There was an error processing your payments. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const renderStatusBadge = (status: string, amountLeft?: string) => {
    if (status === "UNPAID" || status === "unpaid") {
      return (
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
            <XCircle className="mr-1 h-3 w-3 rounded-full " />
            Unpaid
          </span>
        </div>
      );
    } else if (status === "PENDING" || status === "pending") {
      return (
        <div className="flex flex-col">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
            <TriangleAlert className="mr-1 h-3 w-3 rounded-full " />
            Pending
          </span>
          {amountLeft && (
            <span className="text-xs text-gray-500 mt-1">
              {amountLeft} left
            </span>
          )}
        </div>
      );
    } else if (status === "PARTIALLY_PAID" || status === "partially paid") {
      return (
        <div className="flex flex-col">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
            <TriangleAlert className="mr-1 h-3 w-3 rounded-full " />
            Partially Paid
          </span>
          {amountLeft && (
            <span className="text-xs text-gray-500 mt-1">
              {amountLeft} left
            </span>
          )}
        </div>
      );
    } else if (status === "FULLY_PAID" || status === "paid") {
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

  const handleOpenPaymentModal = (payment: any) => {
    setSelectedBillingId(payment.id);
    setIsPaymentModalOpen(true);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setSelectAll(checked);

    if (checked) {
      // Select all items on current page
      const currentIndices = [];
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, activities.length);

      for (let i = 0; i < endIndex - startIndex; i++) {
        currentIndices.push(i);
      }

      setSelectedItems(currentIndices);
    } else {
      // Deselect all items
      setSelectedItems([]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchQuery(term);

    if (!term.trim()) {
      setActivities(originalActivities);
      setIsFiltered(false);
      return;
    }

    setIsFiltered(true);

    const filtered = originalActivities.filter(
      (activity) =>
        activity.PaymentType.toLowerCase().includes(term) ||
        activity.AmountDue.toLowerCase().includes(term) ||
        activity.status.toLowerCase().includes(term)
    );

    setActivities(filtered);
    setCurrentPage(1); // Reset to first page when searching
  };

  const calculateTotalAmount = (selectedIndices: any[]) => {
    return selectedIndices.reduce((total, index) => {
      // Get real index considering pagination
      const realIndex = (currentPage - 1) * itemsPerPage + index;
      const activity = activities[realIndex];
      
      if (!activity) return total;
      
      const amount = activity.amountLeft
        ? parseFloat(activity.amountLeft.replace(/,/g, ""))
        : parseFloat(activity.AmountDue.replace(/,/g, ""));
      return total + amount;
    }, 0);
  };

  const handleSelectItem = (index: number) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(index)) {
        return prevSelected.filter((item) => item !== index);
      } else {
        return [...prevSelected, index];
      }
    });
  };

  const handleDateSelect = (date: string) => {
    const selectedDate = new Date(date);
    setIsFiltered(true);

    const filteredActivities = originalActivities.filter((activity: any) => {
      const activityDate = new Date(activity.date);
      return (
        activityDate.getDate() === selectedDate.getDate() &&
        activityDate.getMonth() === selectedDate.getMonth() &&
        activityDate.getFullYear() === selectedDate.getFullYear()
      );
    });

    setActivities(filteredActivities);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSelectPaymentAll = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select at least one payment to proceed.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Calculate total for selected items
    const total = calculateTotalAmount(selectedItems);
    setTotalAmount(total);
    setIsTotalModalOpen(true);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedItems([]);
    setActivities(originalActivities);
    setCurrentPage(1);
    setIsFiltered(false);
    setSelectAll(false);
  };

  const renderPaymentModal = () => {
    if (!isPaymentModalOpen) return null;
    
    // Find the payment details from the selected billing ID
    const selectedPayment = activities.find(act => act.id === selectedBillingId);
    
    if (!selectedPayment) return null;
    
    return (
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={parseFloat(selectedPayment.AmountDue.replace(/,/g, ""))}
        billingId={selectedBillingId}
        title={selectedPayment.PaymentType}
        userData={userData}
        onPaymentSuccess={handlePaymentSuccess}
      />
    );
  };

  const renderTotalModal = () => {
    if (!isTotalModalOpen) return null;
    
    return (
      <PaymentModal 
        isOpen={isTotalModalOpen}
        onClose={() => setIsTotalModalOpen(false)}
        totalAmount={totalAmount}
        billingId="multiple" // Indicate it's a multiple payment
        title="Multiple Payments"
        userData={userData}
        onPaymentSuccess={handleSettleAllPayments}
      />
    );
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Reset selections when changing pages
    setSelectedItems([]);
    setSelectAll(false);
  };
  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return activities.slice(startIndex, startIndex + itemsPerPage);
  };

  // New function to render different content states
  const renderContent = () => {
    // Show loading state
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500">Loading outstanding dues...</p>
        </div>
      );
    }

    // No data from API
    if (originalActivities.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-center text-gray-500 py-4">
            No outstanding dues available.
          </p>
        </div>
      );
    }

    // Data exists but filter returned no results
    if (isFiltered && activities.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-center text-gray-500 py-4">
            No outstanding dues found for the selected criteria.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      );
    }

    // Data exists and should be displayed
    return (
      <>
        <div className="relative overflow-x-auto">
          <table className="w-full justify-center item-center border-b border-gray-200 px-10 mt-6">
            <thead className="border-b border-t-none border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                    sx={{
                      color: "#aba8a8",
                      "&.Mui-checked": {
                        color: "#2180B9",
                      },
                    }}
                  />
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500 ">
                  Payment Type
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                  Amount Due(₦)
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                  Due Date
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
              {getCurrentItems().map((activity, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedItems.includes(index)}
                      onChange={() => handleSelectItem(index)}
                      className="text-gray-400"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800  whitespace-nowrap">
                    {activity.PaymentType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800  whitespace-nowrap">
                    {activity.AmountDue}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                    {activity.date}
                  </td>
                  <td className="px-6 py-4  whitespace-nowrap">
                    {renderStatusBadge(activity.status, activity.amountLeft)}
                  </td>
                  <td className="px-6 py-4  whitespace-nowrap">
                    <button
                      onClick={() => handleOpenPaymentModal(activity)}
                      className="px-6 py-2 bg-primary text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      Settle Payment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          currentPage={currentPage}
          totalPages={Math.ceil(activities.length / itemsPerPage)}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="w-full mx-auto">
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="lg:w-1/2 md:w-full h-30 bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-gray-600 mb-2">Total Outstanding</h3>
              <div className="flex items-center justify-between">
                <span className="lg:text-xl md:text-sm font-medium">
                  ₦{totalOutstanding.toLocaleString()}
                </span>
                <div className="rounded-full flex items-center justify-center px-4 py-2 bg-primary hover:bg-blue-700 hover:text-lg">
                  <button
                    onClick={handleSelectPaymentAll}
                    className="text-sm text-white rounded-xl flex items-center"
                    disabled={activities.length === 0}
                  >
                    Settle All Payment
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white w-full flex flex-col item-center rounded-xl border border-gray-300 p-6 mb-10">
            <h1 className="font-semibold lg:text-lg md:text-base mb-6">
              Outstanding Dues Breakdown
            </h1>
            <div className="flex lg:flex-row md:flex-col justify-between items-center w-full">
              <div className="w-1/2">
                <button
                  className="px-4 py-2 lg:text-base md:text-sm bg-primary text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 hover:text-lg"
                  disabled={activities.length === 0}
                >
                  Settle payment
                </button>
              </div>
              <div className="flex flex-row gap-5 w-full">
                <div className="relative group w-full">
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
                      e.stopPropagation(); // Prevent closing when clicking the button
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
            </div>

            {renderContent()}
          </div>
        </div>
      </div>
      {renderPaymentModal()}
      {renderTotalModal()}
    </div>
  );
};

export default Outstanding;
