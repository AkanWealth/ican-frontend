"use client";

import React, { useState, useEffect, useMemo } from "react";
import TablePagination from "@/components/Pagenation";
import {
  Search,
SquareCheckBig,
CircleSlash,
  ChevronDown,
  XCircle,
  CheckCircle,
  Filter,
  MoreVertical,
} from "lucide-react";
import CalendarFilter from "@/components/homecomps/CalendarFilter";
import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

function MemberDueRender() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("April");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [isLoadingDues, setIsLoadingDues] = useState(true);
  const [dues, setDues] = useState([
    { 
      type: "Registration fee", 
      amount: 10000, 
      dueDate: "Jan 15, 2022", 
      status: "unpaid"
    },
    { 
      type: "Annual Dues (2024) fee", 
      amount: 10000, 
      dueDate: "Jan 15, 2024", 
      status: "paid" 
    },
    { 
      type: "Annual Dues (2023)", 
      amount: 10000, 
      dueDate: "Jan 15, 2023", 
      status: "paid" 
    },
    { 
      type: "Annual Dues (2024) fee", 
      amount: 10000, 
      dueDate: "Jan 15, 2025", 
      status: "partially_paid",
      remainingAmount: 3000
    },
  ]);
  const [metrics, setMetrics] = useState({
    totalPaid: 50000,
    totalOutstanding: 13000
  });

  const itemsPerPage = 4;

  // Simulate API fetch for dues data
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setIsLoadingMetrics(false);
      setIsLoadingDues(false);
    }, 1000);
  }, []);

  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };

  const handleMonthChange = (e: any) => {
    setSelectedMonth(e.target.value);
  };

  // Filter dues based on search query
  const filteredDues = dues.filter(
    (due) =>
      due.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      due.dueDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      due.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDues.length / itemsPerPage);

  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDues.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  };

  const renderStatusBadge = (status: string, remainingAmount: any ) => {
    if (status === "unpaid") {
      return (
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
          <XCircle className="mr-1 h-3 w-3" />
          Unpaid
        </div>
      );
    } else if (status === "paid") {
      return (
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
          <CheckCircle className="mr-1 h-3 w-3" />
          Paid
        </div>
      );
    } else if (status === "partially_paid") {
      return (
        <div>
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
            <span className="mr-1">⚠️</span>
            Partially Paid
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {remainingAmount.toLocaleString()} left
          </div>
        </div>
      );
    }
    return null;
  };

  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const toggleActionMenu = (index: any) => {
    if (actionMenuOpen === index) {
      setActionMenuOpen(null);
    } else {
      setActionMenuOpen(index);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="w-full mx-auto">
          <div className="bg-white w-full rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold mb-2">Dues</h3>
            
            {/* Month selector */}
            <div className="mb-4">
              <select 
                value={selectedMonth}
                onChange={handleMonthChange}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
              >
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
              </select>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <div className="flex bg-green-100 w-8 h-8 rounded-lg items-center justify-center mr-2">
                  <SquareCheckBig className="text-green-600"/>

                  </div>
                  <p className="text-sm text-gray-600">Total amount Paid</p>
                </div>
                {isLoadingMetrics ? (
                  <div className="h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
                ) : (
                  <p className="font-bold text-3xl">{metrics.totalPaid.toLocaleString()}</p>
                )}
              </div>
              
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <div className="flex bg-green-100 w-8 h-8 rounded-lg items-center justify-center mr-2">
                    <CircleSlash className="text-green-600"/>

                  </div>
                  <p className="text-sm text-gray-600">Total outstanding</p>
                </div>
                {isLoadingMetrics ? (
                  <div className="h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
                ) : (
                  <p className="font-bold text-3xl">{metrics.totalOutstanding.toLocaleString()}</p>
                )}
              </div>

              <div className="flex justify-end rounded-lg p-4">
                <div className="flex  rounded-lg items-center justify-center mr-2">

              <button 
                className=" bg-blue-900 hover:bg-blue-600 text-white p-2 rounded-full"
              >
                Settle all Payments
              </button>
              </div>
            </div>
            </div>
            
            {/* Settle All Button */}
            
          </div>

          {/* Dues Breakdown Section */}
          <div className="bg-white w-full rounded-xl border border-gray-300 p-6 mb-10">
            <h1 className="font-semibold text-lg mb-6">Dues Breakdown</h1>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <div className="relative w-full md:w-2/3">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search by title, tag, or category..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end w-full md:w-1/3">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Filter</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Dues Table */}
            {isLoadingDues ? (
              <div className="flex justify-center items-center py-8">
                <div className="h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="border-b border-gray-300">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">Payment Type</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">Amount Due (₦)</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">Due Date</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">Status</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {getCurrentItems().map((due, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800">{due.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{due.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{due.dueDate}</td>
                        <td className="px-6 py-4">
                          {renderStatusBadge(due.status, due.remainingAmount)}
                        </td>
                        <td className="px-6 py-4 relative">
                          <div className="relative">
                            <button onClick={() => toggleActionMenu(index)}>
                              <MoreVertical className="w-5 h-5 text-gray-500" />
                            </button>
                            
                            {actionMenuOpen === index && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                <div className="py-1">
                                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Make Payment
                                  </button>
                                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {dues.length > 0 && (
              <div className="mt-6">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberDueRender;