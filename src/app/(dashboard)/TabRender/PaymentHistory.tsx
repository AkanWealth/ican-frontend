"use client";
import React, { useState, useEffect, ReactNode } from "react";
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
import axios from "axios";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

// Define the payment interface
interface Payment {
  TransactionID: string;
  SubscriptionPeriod: string;
  AmountPaid: number;
  PaymentMethod: string;
  status: string;
  receipt?: string;
  date: string;
}

const PaymentHistory = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [paymentHistoryData, setPaymentHistoryData] = useState<Payment[]>([]);
  const [originalData, setOriginalData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);
  const itemsPerPage = 5;
  const { toast } = useToast();

  // Fetch payment history data from the API
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('User is not authenticated. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          'https://ican-api-6000e8d06d3a.herokuapp.com/api/payments/total-outstanding',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        // Make sure we're dealing with an array
        const data = Array.isArray(response.data) ? response.data : [];
        setPaymentHistoryData(data);
        setOriginalData(data);
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
      const paymentDate = new Date(payment.date);
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
    
    const filtered = dataToFilter.filter((payment: Payment) => 
      payment.TransactionID.toLowerCase().includes(term) ||
      payment.PaymentMethod.toLowerCase().includes(term) ||
      payment.SubscriptionPeriod.toLowerCase().includes(term)
    );
    
    setPaymentHistoryData(filtered);
    setCurrentPage(1); // Reset to first page when searching
  };

  const renderStatusBadgePayment = (status: string) => {
    if (status === "failed") {
      return (
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
            <XCircle className="mr-1 h-3 w-3 rounded-full " />
            Failed
          </span>
        </div>
      );
    } else if (status === "successful") {
      return (
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
            <CheckCircle className="mr-1 h-3 w-3 rounded-full" />
            Successful
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
                .map((pay: Payment, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {pay.TransactionID}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {pay.SubscriptionPeriod}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {pay.AmountPaid}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {pay.PaymentMethod}
                    </td>
                    <td className="px-6 py-4">
                      {renderStatusBadgePayment(pay.status)}
                    </td>
                    <td className="px-6 py-4">
                      {pay.receipt ? (
                        <button className="px-4 py-1 bg-primary text-white text-sm rounded-full hover:bg-blue-700">
                          Download
                        </button>
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
                  placeholder="Search by title, tag, or category..."
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