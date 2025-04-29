"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  ListFilter,
  ChevronDown,
  XCircle,
  CheckCircle,
} from "lucide-react";
import CalendarFilter from "@/components/homecomps/CalendarFilter";
import TablePagination from "@/components/Pagenation";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/services/apiClient";
import PaymentReceipt from "@/components/homecomps/RecieptGenerator";

// Define the payment interface based on API response
interface Payment {
  id: string;
  userId: string;
  billingId: string;
  paymentType: string;
  amount: number;
  datePaid: string;
  status: string;
  transactionId: string | null;
  subscriptionId: string | null;
  // Additional fields for UI
  subscriptionPeriod?: string;
  paymentMethod?: string;
}

// Define the billing interface
interface Billing {
  id: string;
  name: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
}

const PaymentHistory = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [paymentHistoryData, setPaymentHistoryData] = useState<Payment[]>([]);
  const [originalData, setOriginalData] = useState<Payment[]>([]);
  const [billingData, setBillingData] = useState<Billing[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);
  const itemsPerPage = 5;
  const { toast } = useToast();

  // Fetch billing data from API
  const fetchBillingData = async () => {
    try {
      const response = await apiClient.get("/billing");
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error("Error fetching billing data:", error);
      return [];
    }
  };

  // Fetch payment history data from the API
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await apiClient.get("/payments/history");
        const billings = await fetchBillingData();
        setBillingData(billings);
        
        // Make sure we're dealing with an array
        const data = Array.isArray(response) ? response : [];
        
        // Process payment data to include subscription period and payment method
        const processedData = data.map((payment: Payment) => {
          // Find related billing record
          const relatedBilling = billings.find(b => b.id === payment.billingId);
          
          // Extract payment method from transactionId (example: CARD_64413c1f-78e4...)
          const paymentMethod = payment.transactionId?.split('_')[0] || 'Unknown';
          
          return {
            ...payment,
            subscriptionPeriod: relatedBilling?.name || 'Unknown Subscription',
            paymentMethod: paymentMethod === 'CARD' ? 'Debit Card' : 'Bank Transfer'
          };
        });
        
        setPaymentHistoryData(processedData);
        setOriginalData(processedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payment history:", error);
        toast({
          title: "Error",
          description: "Failed to fetch payment history.",
          variant: "destructive",
        });
        setPaymentHistoryData([]);
        setOriginalData([]);
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [toast]);

  const handleDateSelect = (date: string) => {
    const selectedDate = new Date(date);
    setSelectedDate(selectedDate);
    setIsFiltered(true);

    // Filter payment history data based on the selected date
    const filteredData = originalData.filter((payment: Payment) => {
      const paymentDate = new Date(payment.datePaid);
      return (
        paymentDate.getDate() === selectedDate.getDate() &&
        paymentDate.getMonth() === selectedDate.getMonth() &&
        paymentDate.getFullYear() === selectedDate.getFullYear()
      );
    });

    setPaymentHistoryData(filteredData);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term.trim()) {
      // If search is cleared, show all data or filtered by date if date is selected
      if (selectedDate) {
        handleDateSelect(selectedDate.toISOString());
      } else {
        setPaymentHistoryData(originalData);
        setIsFiltered(false);
      }
      return;
    }

    setIsFiltered(true);

    // Filter based on search term and possibly selected date
    let dataToFilter = selectedDate ? paymentHistoryData : originalData;

    const filtered = dataToFilter.filter(
      (payment: Payment) =>
        (payment.transactionId?.toLowerCase().includes(term) || false) ||
        (payment.paymentMethod?.toLowerCase().includes(term) || false) ||
        (payment.subscriptionPeriod?.toLowerCase().includes(term) || false)
    );

    setPaymentHistoryData(filtered);
    setCurrentPage(1); // Reset to first page when searching
  };

  const renderStatusBadgePayment = (status: string) => {
    if (status === "FAILED") {
      return (
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
            <XCircle className="mr-1 h-3 w-3 rounded-full" />
            Failed
          </span>
        </div>
      );
    } else if (status === "SUCCESS") {
      return (
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
            <CheckCircle className="mr-1 h-3 w-3 rounded-full" />
            Successful
          </span>
        </div>
      );
    } else if (status === "PENDING") {
      return (
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
            Pending
          </span>
        </div>
      );
    }
    return null;
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const resetFilters = () => {
    setSelectedDate(null);
    setSearchTerm("");
    setPaymentHistoryData(originalData);
    setCurrentPage(1);
    setIsFiltered(false);
  };

  // Format date to display in a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Safely truncate string to avoid null errors
  const truncateString = (str: string | null | undefined, length: number): string => {
    if (!str) return 'N/A';
    return str.slice(0, length);
  };

  // Notify user when receipt is downloaded
  const handleReceiptSuccess = () => {
    toast({
      title: "Success",
      description: "Receipt has been downloaded successfully.",
      variant: "default",
    });
  };

  // Render different states based on data and filters
  const renderContent = () => {
    // Show loading state
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500">Loading payment history...</p>
        </div>
      );
    }

    // No data from API
    if (originalData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-center text-gray-500 py-4">
            No payment history available.
          </p>
        </div>
      );
    }

    // Data exists but filter returned no results
    if (isFiltered && paymentHistoryData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-center text-gray-500 py-4">
            No activities found for the selected criteria.
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
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                  Transaction ID
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                  Subscription Period
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                  Amount Paid (₦)
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                  Payment Method
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {paymentHistoryData
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((payment: Payment, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {truncateString(payment.transactionId, 12)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {payment.subscriptionPeriod || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {payment.paymentMethod || 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      {renderStatusBadgePayment(payment.status)}
                    </td>
                    <td className="px-6 py-4">
                      {payment.status === "SUCCESS" ? (
                        <PaymentReceipt payment={payment} onSuccess={handleReceiptSuccess} />
                      ) : (
                        <button className="px-4 py-1 bg-primary text-white text-sm rounded-full hover:bg-blue-700">
                          Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={currentPage}
          totalPages={Math.ceil(paymentHistoryData.length / itemsPerPage)}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto">
        <div className="bg-white w-full flex flex-col item-center rounded-xl border border-gray-300 p-6 mb-10">
          <h1 className="font-medium text-lg mb-6">Payment History</h1>
          <div className="flex justify-between items-center w-full">
            <div className="w-1/2"></div>
            <div className="flex flex-row gap-10 w-3/4">
              <div className="relative group w-3/4">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search by transaction ID, payment method..."
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
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;