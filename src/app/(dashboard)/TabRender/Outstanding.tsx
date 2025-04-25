"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { Checkbox } from "@mui/material";
import CalendarFilter from "@/components/homecomps/CalendarFilter";
import TablePagination from "@/components/Pagenation";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  X,
  Search,
  ListFilter,
  ChevronDown,
  XCircle,
  TriangleAlert,
  CheckCircle,
  Circle,
} from "lucide-react";

import apiClient from "@/services/apiClient";
import { parseCookies } from "nookies";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface PaymentDetails {
  paymentType: string;
  amountDue: string;
  dueDate: string;
}
interface Activity {
  amountLeft?: string;
  AmountDue: string;
  date: string;
  PaymentType: string;
  status: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl lg:p-12 md:p-8 w-full lg:max-w-2xl md:w-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

const Outstanding = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [originalActivities, setOriginalActivities] = useState<Activity[]>([]); // Store original data
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(
    null
  );
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isTotalModalOpen, setIsTotalModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [partialAmount, setPartialAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltered, setIsFiltered] = useState(false); // Add this to track when filters are applied
  const { toast } = useToast();

  // Fetch outstanding data from the API
  useEffect(() => {
    const fetchOutstandingData = async () => {
      try {
        // const token = localStorage.getItem("token");

        // if (!token) {
        //   console.error("User is not authenticated. Please log in again.");
        //   setLoading(false);
        //   return;
        // }
        
        // Fetch total outstanding payment
        const response = await apiClient.get("/payments/total-outstanding");
        const totalOutstanding = response.totalOutstanding || 0;

        // Fetch outstanding breakdown
        const outstandingBreakdownResponse = await apiClient.get("/payments/outstanding-breakdown");
        const outstandingBreakdown =
          outstandingBreakdownResponse.breakdown || [];

        // Update state with API data
        setTotalOutstanding(totalOutstanding);
        setActivities(outstandingBreakdown);
        setOriginalActivities(outstandingBreakdown); // Store original data

        // Calculate total pages
        setTotalPages(Math.ceil(outstandingBreakdown.length / itemsPerPage));
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
    };

    fetchOutstandingData();
  }, [itemsPerPage, toast]); // Add missing dependencies here

  const renderStatusBadge = (status: string, amountLeft?: string) => {
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
          {amountLeft && (
            <span className="text-xs text-gray-500 mt-1">
              {amountLeft} left
            </span>
          )}
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

  const handlePaymentSubmit = () => {
    if (!selectedPayment) {
      toast({
        title: "Error",
        description: "Payment details not found",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    let amountPaid = "";

    if (paymentMethod === "full") {
      amountPaid = selectedPayment.amountDue;
    } else {
      if (!partialAmount || partialAmount.trim() === "") {
        toast({
          title: "Error",
          description: "Please enter a valid amount for partial payment",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
      amountPaid = partialAmount;
    }

    toast({
      title: "Payment Successful",
      description: `You have successfully paid ₦${amountPaid} for ${selectedPayment.paymentType}`,
      variant: "default",
      duration: 3000,
    });

    // Close the modal
    setIsPaymentModalOpen(false);
    setSelectedPayment(null);
    setPartialAmount("");
  };

  const handleOpenPaymentModal = (payment: any) => {
    const paymentDetails: PaymentDetails = {
      paymentType: payment.PaymentType,
      amountDue:
        payment.status === "partially paid"
          ? payment.amountLeft
          : payment.AmountDue,
      dueDate: payment.date,
    };
    setSelectedPayment(paymentDetails);
    setIsPaymentModalOpen(true);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setSelectAll(checked);

    if (checked) {
      // Select all items
      const allIndexes = activities.map((_, index) => index);
      setSelectedItems(allIndexes);
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
      const amount = activities[index].amountLeft
        ? parseFloat(activities[index].amountLeft.replace(/,/g, ""))
        : parseFloat(activities[index].AmountDue.replace(/,/g, ""));
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
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      // Get indices of all current page items
      const currentIndices = [];
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, activities.length);

      for (let i = startIndex; i < endIndex; i++) {
        currentIndices.push(i);
      }

      setSelectedItems(currentIndices);

      // Calculate total and open modal
      const total = calculateTotalAmount(currentIndices);
      setTotalAmount(total);
      setIsTotalModalOpen(true);
    } else {
      setSelectedItems([]);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedItems([]);
    setActivities(originalActivities);
    setCurrentPage(1);
    setIsFiltered(false);
  };

  const renderTotalModal = () => {
    // Modal implementation remains the same
    return (
      <Modal
        isOpen={isTotalModalOpen}
        onClose={() => setIsTotalModalOpen(false)}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Total Selected Payments</h2>

          <div className="mb-4">
            <p className="text-base text-gray-700">
              Total Amount Due:{" "}
              <span className="font-medium text-xl">
                ₦{totalAmount.toLocaleString()}
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              You've selected {selectedItems.length} payment(s)
            </p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div
                className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer ${
                  paymentMethod === "full"
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => setPaymentMethod("full")}
              >
                <div className="w-5 h-5 rounded-full border border-gray-300 mb-2 flex items-center justify-center">
                  {paymentMethod === "full" && (
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <p className="font-medium text-center">Full Payment</p>
                <p className="font-medium text-center">
                  ₦{totalAmount.toLocaleString()}
                </p>
              </div>

              <div
                className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer ${
                  paymentMethod === "partial"
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => setPaymentMethod("partial")}
              >
                <div className="w-5 h-5 rounded-full border border-gray-300 mb-2 flex items-center justify-center">
                  {paymentMethod === "partial" && (
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <p className="font-medium text-center">Partial Payment</p>
                <div className="mt-1 flex items-center">
                  <span className="text-gray-600 mr-1">₦</span>
                  <input
                    type="text"
                    placeholder="Enter Amount"
                    className="border-b border-gray-300 focus:outline-none focus:border-blue-500 w-24 text-center"
                    disabled={paymentMethod !== "partial"}
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <button
              onClick={() => {
                // Here you can add logic to handle settling all selected payments
                setIsTotalModalOpen(false);
              }}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Proceed to pay ₦{totalAmount.toLocaleString()}
            </button>
            <button
              onClick={() => setIsTotalModalOpen(false)}
              className="w-full border border-primary text-primary py-3 rounded-lg hover:bg-primary hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const renderPaymentModal = () => {
    if (!selectedPayment) return null;

    return (
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Settle Payment</h2>

          <div className="mb-4">
            <div className="grid grid-cols-1 gap-2">
              <div>
                <p className="text-base text-gray-700">
                  Payment For:{" "}
                  <span className="font-medium">
                    {selectedPayment.paymentType}
                  </span>{" "}
                </p>
              </div>
              <div>
                <p className="text-base text-gray-700">
                  Amount Due:{" "}
                  <span className="font-medium">
                    ₦{selectedPayment.amountDue}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div
                className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer ${
                  paymentMethod === "full"
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => setPaymentMethod("full")}
              >
                <div className="w-5 h-5 rounded-full border border-gray-300 mb-2 flex items-center justify-center">
                  {paymentMethod === "full" && (
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <p className="font-medium text-center">Full Payment</p>
                <p className="font-medium text-center">
                  ₦{selectedPayment?.amountDue || "0"}
                </p>
              </div>

              <div
                className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer ${
                  paymentMethod === "partial"
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => setPaymentMethod("partial")}
              >
                <div className="w-5 h-5 rounded-full border border-gray-300 mb-2 flex items-center justify-center">
                  {paymentMethod === "partial" && (
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <p className="font-medium text-center">Partial Payment</p>
                <div className="mt-1 flex items-center">
                  <span className="text-gray-600 mr-1">₦</span>
                  <input
                    type="text"
                    placeholder="Enter Amount"
                    className="border-b border-gray-300 focus:outline-none focus:border-blue-500 w-24 text-center"
                    disabled={paymentMethod !== "partial"}
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <button
              onClick={handlePaymentSubmit}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700"
              disabled={
                paymentMethod === "partial" &&
                (!partialAmount || partialAmount.trim() === "")
              }
            >
              Proceed to pay ₦{selectedPayment.amountDue}
            </button>
            <button
              onClick={() => {
                setIsPaymentModalOpen(false);
                setPartialAmount("");
              }}
              className="w-full border border-primary text-primary py-3 rounded-lg hover:bg-primary hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
