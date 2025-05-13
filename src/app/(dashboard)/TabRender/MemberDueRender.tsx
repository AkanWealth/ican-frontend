// "use client";

// import React, { useState, useEffect } from "react";
// import TablePagination from "@/components/Pagenation";
// import {
//   Search,
//   SquareCheckBig,
//   CircleSlash,
//   ChevronDown,
//   XCircle,
//   CheckCircle,
//   Filter,
//   MoreVertical,
// } from "lucide-react";
// import { parseCookies } from 'nookies';
// import apiClient from '@/services/apiClient';
// import PaymentModal from "@/components/Modal/PaymentModal";
// import { useToast } from "@/hooks/use-toast";
// import paymentService from "@/services/PaymentService";
// import CalendarFilter from "@/components/homecomps/CalendarFilter";

// // Define interfaces outside the component
// interface UserData {
//   id: string;
//   email?: string;
//   phoneNumber?: string;
//   fullName?: string;
//   [key: string]: any;
// }

// interface Due {
//   id: string;
//   name: string;
//   type: string;
//   amount: number;
//   totalPaid: number;
//   balance: number;
//   paymentStatus: string;
//   date?: string; // Added date field for filtering
// }

// interface SelectedPayment {
//   id?: string;
//   title: string;
//   amount: number;
//   isSettleAll: boolean;
// }

// function MemberDueRender() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedMonth, setSelectedMonth] = useState("April");
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
//   const [isLoadingDues, setIsLoadingDues] = useState(true);
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const { toast } = useToast();
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
//   const [dues, setDues] = useState<Due[]>([]);
//   const [metrics, setMetrics] = useState({
//     totalPaid: 0,
//     totalOutstanding: 0
//   });
//   const [originalDues, setOriginalDues] = useState<Due[]>([]); 
//   const [selectedPayment, setSelectedPayment] = useState<SelectedPayment | null>(null);
//   const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null); // Fixed type
//   const itemsPerPage = 4;

//   // Fetch user data and dues data on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoadingMetrics(true);
//       setIsLoadingDues(true);

//       try {
//         // Get user data from cookies
//         const cookies = parseCookies();
//         const userDataCookie = cookies["user_data"];
//         const parsedUserData = userDataCookie ? JSON.parse(userDataCookie) : null;

//         if (!parsedUserData) {
//           console.error("User data not found in cookies");
//           setIsLoadingMetrics(false);
//           setIsLoadingDues(false);
//           return;
//         }

//         setUserData(parsedUserData);

//         const userId = parsedUserData?.id;
//         if (!userId) {
//           console.error("User ID not found");
//           setIsLoadingMetrics(false);
//           setIsLoadingDues(false);
//           return;
//         }

//         // Fetch dues data from the endpoint
//         const response = await apiClient.get(`/billing/user/${userId}/billings`);
//         console.log("API Response:", response);

//         // Proper response handling
//         const duesData = response?.data && Array.isArray(response.data) 
//           ? response.data 
//           : Array.isArray(response) 
//             ? response 
//             : [];

//         // Ensure data consistency
//         const processedDues = duesData.map((due: any) => ({
//           id: due.id || "",
//           name: due.name || "",
//           type: due.type || "",
//           amount: typeof due.amount === 'number' ? due.amount : 0,
//           totalPaid: typeof due.totalPaid === 'number' ? due.totalPaid : 0,
//           balance: typeof due.balance === 'number' ? due.balance : 0,
//           paymentStatus: due.paymentStatus || "NOT_PAID",
//           date: due.createdAt || new Date().toISOString(),
//         }));

//         setDues(processedDues);
//         setOriginalDues(processedDues);

//         // Calculate metrics
//         const totalPaid = processedDues.reduce((sum: any, due: any) => sum + (due.totalPaid || 0), 0);
//         const totalOutstanding = processedDues.reduce((sum: any, due: any) => sum + (due.balance || 0), 0);

//         setMetrics({
//           totalPaid,
//           totalOutstanding,
//         });
//       } catch (error) {
//         console.error("Error fetching dues data:", error);
//         toast({
//           title: "Error",
//           description: "Failed to load dues data. Please try again later.",
//           variant: "destructive",
//           duration: 5000,
//         });
//       } finally {
//         setIsLoadingMetrics(false);
//         setIsLoadingDues(false);
//       }
//     };

//     fetchData();
//   }, [toast]); // Added toast dependency

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//   };

//   // Filter dues based on search query
//   const filteredDues = dues.filter(
//     (due) =>
//       due.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       due.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       due.paymentStatus.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredDues.length / itemsPerPage) || 1;

//   const getCurrentItems = () => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filteredDues.slice(startIndex, startIndex + itemsPerPage);
//   };

//   const handlePageChange = (pageNumber: number) => {
//     setCurrentPage(pageNumber);
//   };

//   const renderStatusBadge = (status: string, balance = 0) => {
//     if (status === "NOT_PAID") {
//       return (
//         <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
//           <XCircle className="mr-1 h-3 w-3" />
//           Unpaid
//         </div>
//       );
//     } else if (status === "FULLY_PAID") {
//       return (
//         <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//           <CheckCircle className="mr-1 h-3 w-3" />
//           Paid
//         </div>
//       );
//     } else if (status === "PARTIALLY_PAID") {
//       return (
//         <div>
//           <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
//             <span className="mr-1">⚠️</span>
//             Partially Paid
//           </div>
//           <div className="text-xs text-gray-500 mt-1">
//             ₦{balance.toLocaleString()} left
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   const toggleActionMenu = (index: number) => {
//     setActionMenuOpen(actionMenuOpen === index ? null : index);
//   };

//   // Handle settling all payments
//   const handleSettleAllPayments = () => {
//     if (metrics.totalOutstanding <= 0) {
//       toast({
//         title: "No Outstanding Dues",
//         description: "You have no outstanding dues to settle.",
//         variant: "default",
//         duration: 3000,
//       });
//       return;
//     }
    
//     // Open payment modal with total outstanding amount
//     setSelectedPayment({
//       title: "Settle All Dues",
//       amount: metrics.totalOutstanding,
//       isSettleAll: true
//     });
//     setIsPaymentModalOpen(true);
//   };

//   // Handle individual payment
//   const handleMakePayment = (due: Due) => {
//     if (due.balance <= 0) {
//       toast({
//         title: "No Balance Due",
//         description: "This payment has already been fully paid.",
//         variant: "default",
//         duration: 3000,
//       });
//       return;
//     }
    
//     setSelectedPayment({
//       id: due.id,
//       title: due.name,
//       amount: due.balance,
//       isSettleAll: false
//     });
//     setIsPaymentModalOpen(true);
//     setActionMenuOpen(null);
//   };

//   const handlePaymentSuccess = async (paymentDetails: any) => {
//     try {
//       if (!userData || !userData.id) {
//         throw new Error("User data is not available");
//       }
      
//       if (selectedPayment && selectedPayment.isSettleAll) {
//         // Handle "Settle All Payments" logic
//         await paymentService.processSettleAllPayment({
//           userId: userData.id,
//           paymentType: paymentDetails.paymentType || "CARD",
//           transactionId: paymentDetails.transactionId,
//           amount: paymentDetails.amount,
//         });
//       } else if (selectedPayment && selectedPayment.id) {
//         // Handle individual payment logic
//         await paymentService.processPayment(
//           userData.id,
//           selectedPayment.id,
//           {
//             amount: paymentDetails.amount,
//             paymentType: paymentDetails.paymentType || "CARD",
//             transactionId: paymentDetails.transactionId,
//           }
//         );
//       } else {
//         throw new Error("Invalid payment selection");
//       }
  
//       // Refresh dues data
//       const updatedDuesResponse = await apiClient.get(`/billing/user/${userData.id}/billings`);
//       const updatedDues = updatedDuesResponse?.data && Array.isArray(updatedDuesResponse.data) 
//         ? updatedDuesResponse.data 
//         : Array.isArray(updatedDuesResponse) 
//           ? updatedDuesResponse 
//           : [];

//       // Process and set updated dues
//       const processedDues = updatedDues.map((due: any) => ({
//         id: due.id || "",
//         name: due.name || "",
//         type: due.type || "",
//         amount: typeof due.amount === 'number' ? due.amount : 0,
//         totalPaid: typeof due.totalPaid === 'number' ? due.totalPaid : 0,
//         balance: typeof due.balance === 'number' ? due.balance : 0,
//         paymentStatus: due.paymentStatus || "NOT_PAID",
//         date: due.date || new Date().toISOString(),
//       }));

//       setDues(processedDues);
//       setOriginalDues(processedDues);
  
//       // Recalculate metrics
//       const totalPaid = processedDues.reduce((sum: any, due: any) => sum + (due.totalPaid || 0), 0);
//       const totalOutstanding = processedDues.reduce((sum: any, due: any) => sum + (due.balance || 0), 0);
  
//       setMetrics({
//         totalPaid,
//         totalOutstanding,
//       });
  
//       toast({
//         title: "Payment Successful",
//         description: `Your payment of ₦${paymentDetails.amount.toLocaleString()} has been processed.`,
//         variant: "default",
//         duration: 5000,
//       });
  
//       setIsPaymentModalOpen(false);
//       setSelectedPayment(null);
//     } catch (error) {
//       console.error("Error processing payment:", error);
//       toast({
//         title: "Payment Error",
//         description: error instanceof Error ? error.message : "There was an error processing your payment.",
//         variant: "destructive",
//         duration: 5000,
//       });
//     }
//   };

//   const handleDateSelect = (date: string) => {
//     try {
//       const selectedDate = new Date(date);
      
//       if (isNaN(selectedDate.getTime())) {
//         throw new Error("Invalid date");
//       }
      
//       // Create a function to check if dates are the same day
//       const isSameDay = (date1: Date, date2: Date) => {
//         return date1.getDate() === date2.getDate() &&
//                date1.getMonth() === date2.getMonth() &&
//                date1.getFullYear() === date2.getFullYear();
//       };
      
//       // Filter dues based on date
//       const filteredDuesByDate = originalDues.filter((due) => {
//         if (!due.date) return false;
        
//         try {
//           const dueDate = new Date(due.date);
//           return isSameDay(dueDate, selectedDate);
//         } catch (error) {
//           console.error("Error parsing due date:", error);
//           return false;
//         }
//       });
      
//       setDues(filteredDuesByDate);
//       setCurrentPage(1);
      
//       // Close calendar after selection
//       setIsCalendarOpen(false);
      
//       toast({
//         title: "Filter Applied",
//         description: `Showing dues for ${selectedDate.toLocaleDateString()}`,
//         variant: "default",
//         duration: 3000,
//       });
//     } catch (error) {
//       console.error("Error applying date filter:", error);
//       toast({
//         title: "Filter Error",
//         description: "Could not apply date filter. Please try again.",
//         variant: "destructive",
//         duration: 3000,
//       });
//     }
//   };

//   const isValidUserData = (data: any): data is UserData => {
//     return (
//       data !== null &&
//       typeof data === "object" &&
//       typeof data.id === "string"
//     );
//   };

//   const resetFilters = () => {
//     setSearchQuery("");
//     setDues(originalDues);
//     setCurrentPage(1);
    
//     toast({
//       title: "Filters Reset",
//       description: "All filters have been cleared.",
//       variant: "default",
//       duration: 3000,
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="w-full">
//         <div className="w-full mx-auto">
//           <div className="bg-white w-full rounded-xl border border-gray-200 p-6 mb-8">
//             <h3 className="text-lg font-semibold mb-2">Dues</h3>

//             {/* Metrics */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//               <div className="border border-gray-300 rounded-lg p-4">
//                 <div className="flex items-center mb-4">
//                   <div className="flex bg-green-100 w-8 h-8 rounded-lg items-center justify-center mr-2">
//                     <SquareCheckBig className="text-green-600" />
//                   </div>
//                   <p className="text-sm text-gray-600">Total amount Paid</p>
//                 </div>
//                 {isLoadingMetrics ? (
//                   <div className="h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
//                 ) : (
//                   <p className="font-bold text-3xl">₦{metrics.totalPaid.toLocaleString()}</p>
//                 )}
//               </div>

//               <div className="border border-gray-300 rounded-lg p-4">
//                 <div className="flex items-center mb-4">
//                   <div className="flex bg-green-100 w-8 h-8 rounded-lg items-center justify-center mr-2">
//                     <CircleSlash className="text-green-600" />
//                   </div>
//                   <p className="text-sm text-gray-600">Total outstanding</p>
//                 </div>
//                 {isLoadingMetrics ? (
//                   <div className="h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
//                 ) : (
//                   <p className="font-bold text-3xl">₦{metrics.totalOutstanding.toLocaleString()}</p>
//                 )}
//               </div>

//               <div className="flex justify-end rounded-lg p-4">
//                 <div className="flex rounded-lg items-center justify-center mr-2">
//                   <button
//                     className={`${
//                       metrics.totalOutstanding === 0 
//                         ? "bg-blue-300 cursor-not-allowed" 
//                         : "bg-blue-900 hover:bg-blue-600"
//                     } text-white p-2 rounded-full`}
//                     onClick={handleSettleAllPayments}
//                     disabled={metrics.totalOutstanding === 0}
//                   >
//                     Settle all Payments
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Dues Breakdown Section */}
//           <div className="bg-white w-full rounded-xl border border-gray-300 p-6 mb-10">
//             <h1 className="font-semibold text-lg mb-6">Dues Breakdown</h1>

//             {/* Search and Filter */}
//             <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
//               <div className="relative w-full md:w-2/3">
//                 <div className="absolute left-3 top-1/2 -translate-y-1/2">
//                   <Search className="w-5 h-5 text-gray-500" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search by name, type, or status..."
//                   value={searchQuery}
//                   onChange={handleSearchChange}
//                   className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="flex justify-end w-full md:w-1/3 space-x-2">
//                 {/* Reset Filter Button */}
//                 {(searchQuery || dues.length !== originalDues.length) && (
//                   <button
//                     onClick={resetFilters}
//                     className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
//                   >
//                     <span className="text-sm text-gray-700">Reset Filters</span>
//                   </button>
//                 )}
                
//                 {/* Calendar Filter Button */}
//                 <div className="relative">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setIsCalendarOpen(!isCalendarOpen);
//                     }}
//                     className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//                   >
//                     <Filter className="h-4 w-4 text-gray-500" />
//                     <span className="text-sm text-gray-500">Date Filter</span>
//                     <ChevronDown className="h-4 w-4 text-gray-500" />
//                   </button>
//                   <CalendarFilter
//                     isOpen={isCalendarOpen}
//                     onClose={() => setIsCalendarOpen(false)}
//                     onSelect={handleDateSelect}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Dues Table */}
//             {isLoadingDues ? (
//               <div className="flex justify-center items-center py-8">
//                 <div className="h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
//               </div>
//             ) : filteredDues.length === 0 ? (
//               <div className="text-center py-8 text-gray-500">
//                 No dues found. {dues.length !== originalDues.length && (
//                   <button 
//                     onClick={resetFilters}
//                     className="text-blue-500 hover:underline ml-1"
//                   >
//                     Clear filters
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <div className="w-full overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead className="border-b border-gray-300">
//                     <tr>
//                       <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">Payment Name</th>
//                       <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">Type</th>
//                       <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">Total Amount (₦)</th>
//                       {/* <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">Amount Paid (₦)</th> */}
//                       <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">Created Date</th>
//                       <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">Status</th>
//                       <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-300">
//                     {getCurrentItems().map((due, index) => (
//                       <tr key={due.id || index} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 text-sm text-gray-800">{due.name}</td>
//                         <td className="px-6 py-4 text-sm text-gray-800">{due.type}</td>
//                         <td className="px-6 py-4 text-sm text-gray-800">{due.amount.toLocaleString()}</td>
//                         {/* <td className="px-6 py-4 text-sm text-gray-800">{due.totalPaid.toLocaleString()}</td> */}
//                         <td className="px-6 py-4 text-sm text-gray-800">
//         {due.date ? new Date(due.date).toLocaleDateString("en-US", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//         }) : "N/A"}
//       </td>
//                         <td className="px-6 py-4">
//                           {renderStatusBadge(due.paymentStatus, due.balance)}
//                         </td>
//                         <td className="px-6 py-4 relative">
//                           <div className="relative">
//                             <button
//                               onClick={() => toggleActionMenu(index)}
//                               disabled={due.paymentStatus === "FULLY_PAID"}
//                               className={due.paymentStatus === "FULLY_PAID" ? "opacity-50 cursor-not-allowed" : ""}
//                             >
//                               <MoreVertical className="w-5 h-5 text-gray-500" />
//                             </button>

//                             {actionMenuOpen === index && due.paymentStatus !== "FULLY_PAID" && (
//                               <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
//                                 <div className="py-1">
//                                   <button
//                                     onClick={() => handleMakePayment(due)}
//                                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                                   >
//                                     Make Payment
//                                   </button>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {/* Pagination */}
//             {filteredDues.length > 0 && (
//               <div className="mt-6">
//                 <TablePagination
//                   currentPage={currentPage}
//                   totalPages={totalPages}
//                   onPageChange={handlePageChange}
//                   itemsPerPage={itemsPerPage}
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Payment Modal */}
//       {isPaymentModalOpen && selectedPayment && (
//         <PaymentModal
//           isOpen={isPaymentModalOpen}
//           onClose={() => {
//             setIsPaymentModalOpen(false);
//             setSelectedPayment(null);
//           }}
//           totalAmount={selectedPayment.amount}
//           billingId={selectedPayment.id || ""}
//           title={selectedPayment.title}
//           userData={isValidUserData(userData) ? userData : {}}
//           onPaymentSuccess={handlePaymentSuccess}
//         />
//       )}
//     </div>
//   );
// }

// export default MemberDueRender;


"use client";

import React, { useState, useEffect } from "react";
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
import { parseCookies } from 'nookies';
import apiClient from '@/services/apiClient';
import PaymentModal from "@/components/Modal/PaymentModal";
import { useToast } from "@/hooks/use-toast";
import paymentService from "@/services/PaymentService";
import CalendarFilter from "@/components/homecomps/CalendarFilter";

// Define interfaces outside the component
interface UserData {
  id: string;
  email?: string;
  phoneNumber?: string;
  fullName?: string;
  [key: string]: any;
}

interface Due {
  id: string;
  name: string;
  type: string;
  amount: number;
  totalPaid: number;
  balance: number;
  paymentStatus: string;
  date?: string; // Added date field for filtering
}

interface SelectedPayment {
  id?: string;
  title: string;
  amount: number;
  isSettleAll: boolean;
}

function MemberDueRender() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("April");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [isLoadingDues, setIsLoadingDues] = useState(true);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [dues, setDues] = useState<Due[]>([]);
  const [metrics, setMetrics] = useState({
    totalPaid: 0,
    totalOutstanding: 0
  });
  const [originalDues, setOriginalDues] = useState<Due[]>([]); 
  const [selectedPayment, setSelectedPayment] = useState<SelectedPayment | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null); // Fixed type
  const itemsPerPage = 4;

  // Fetch user data and dues data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingMetrics(true);
      setIsLoadingDues(true);

      try {
        // Get user data from cookies
        const cookies = parseCookies();
        const userDataCookie = cookies["user_data"];
        const parsedUserData = userDataCookie ? JSON.parse(userDataCookie) : null;

        if (!parsedUserData) {
          console.error("User data not found in cookies");
          setIsLoadingMetrics(false);
          setIsLoadingDues(false);
          return;
        }

        setUserData(parsedUserData);

        const userId = parsedUserData?.id;
        if (!userId) {
          console.error("User ID not found");
          setIsLoadingMetrics(false);
          setIsLoadingDues(false);
          return;
        }

        // Fetch dues data from the endpoint
        const response = await apiClient.get(`/billing/user/${userId}/billings`);
        console.log("API Response:", response);

        // Proper response handling
        const duesData = response?.data && Array.isArray(response.data) 
          ? response.data 
          : Array.isArray(response) 
            ? response 
            : [];

        // Ensure data consistency
        const processedDues = duesData.map((due: any) => ({
          id: due.id || "",
          name: due.name || "",
          type: due.type || "",
          amount: typeof due.amount === 'number' ? due.amount : 0,
          totalPaid: typeof due.totalPaid === 'number' ? due.totalPaid : 0,
          balance: typeof due.balance === 'number' ? due.balance : 0,
          paymentStatus: due.paymentStatus || "NOT_PAID",
          date: due.createdAt || new Date().toISOString(),
        }));

        setDues(processedDues);
        setOriginalDues(processedDues);

        // Calculate metrics
        const totalPaid = processedDues.reduce((sum: any, due: any) => sum + (due.totalPaid || 0), 0);
        const totalOutstanding = processedDues.reduce((sum: any, due: any) => sum + (due.balance || 0), 0);

        setMetrics({
          totalPaid,
          totalOutstanding,
        });
      } catch (error) {
        console.error("Error fetching dues data:", error);
        toast({
          title: "Error",
          description: "Failed to load dues data. Please try again later.",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsLoadingMetrics(false);
        setIsLoadingDues(false);
      }
    };

    fetchData();
  }, [toast]); // Added toast dependency

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter dues based on search query
  const filteredDues = dues.filter(
    (due) =>
      due.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      due.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      due.paymentStatus.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDues.length / itemsPerPage) || 1;

  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDues.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderStatusBadge = (status: string) => {
    if (status === "NOT_PAID") {
      return (
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
          <XCircle className="mr-1 h-3 w-3" />
          Unpaid
        </div>
      );
    } else if (status === "FULLY_PAID") {
      return (
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
          <CheckCircle className="mr-1 h-3 w-3" />
          Paid
        </div>
      );
    } else if (status === "PARTIALLY_PAID") {
      return (
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
          <span className="mr-1">⚠️</span>
          Partially Paid
        </div>
      );
    }
    return null;
  };

  const toggleActionMenu = (index: number) => {
    setActionMenuOpen(actionMenuOpen === index ? null : index);
  };

  // Handle settling all payments
  const handleSettleAllPayments = () => {
    if (metrics.totalOutstanding <= 0) {
      toast({
        title: "No Outstanding Dues",
        description: "You have no outstanding dues to settle.",
        variant: "default",
        duration: 3000,
      });
      return;
    }
    
    // Open payment modal with total outstanding amount
    setSelectedPayment({
      title: "Settle All Dues",
      amount: metrics.totalOutstanding,
      isSettleAll: true
    });
    setIsPaymentModalOpen(true);
  };

  // Handle individual payment
  const handleMakePayment = (due: Due) => {
    if (due.balance <= 0) {
      toast({
        title: "No Balance Due",
        description: "This payment has already been fully paid.",
        variant: "default",
        duration: 3000,
      });
      return;
    }
    
    setSelectedPayment({
      id: due.id,
      title: due.name,
      amount: due.balance,
      isSettleAll: false
    });
    setIsPaymentModalOpen(true);
    setActionMenuOpen(null);
  };

  const handlePaymentSuccess = async (paymentDetails: any) => {
    try {
      if (!userData || !userData.id) {
        throw new Error("User data is not available");
      }
      
      if (selectedPayment && selectedPayment.isSettleAll) {
        // Handle "Settle All Payments" logic
        await paymentService.processSettleAllPayment({
          userId: userData.id,
          paymentType: paymentDetails.paymentType || "CARD",
          transactionId: paymentDetails.transactionId,
          amount: paymentDetails.amount,
        });
      } else if (selectedPayment && selectedPayment.id) {
        // Handle individual payment logic
        await paymentService.processPayment(
          userData.id,
          selectedPayment.id,
          {
            amount: paymentDetails.amount,
            paymentType: paymentDetails.paymentType || "CARD",
            transactionId: paymentDetails.transactionId,
            paymentCategory:   "ONE_TIME",
            status: "PAID",
          }
        );
      } else {
        throw new Error("Invalid payment selection");
      }
  
      // Refresh dues data
      const updatedDuesResponse = await apiClient.get(`/billing/user/${userData.id}/billings`);
      const updatedDues = updatedDuesResponse?.data && Array.isArray(updatedDuesResponse.data) 
        ? updatedDuesResponse.data 
        : Array.isArray(updatedDuesResponse) 
          ? updatedDuesResponse 
          : [];

      // Process and set updated dues
      const processedDues = updatedDues.map((due: any) => ({
        id: due.id || "",
        name: due.name || "",
        type: due.type || "",
        amount: typeof due.amount === 'number' ? due.amount : 0,
        totalPaid: typeof due.totalPaid === 'number' ? due.totalPaid : 0,
        balance: typeof due.balance === 'number' ? due.balance : 0,
        paymentStatus: due.paymentStatus || "NOT_PAID",
        date: due.date || new Date().toISOString(),
      }));

      setDues(processedDues);
      setOriginalDues(processedDues);
  
      // Recalculate metrics
      const totalPaid = processedDues.reduce((sum: any, due: any) => sum + (due.totalPaid || 0), 0);
      const totalOutstanding = processedDues.reduce((sum: any, due: any) => sum + (due.balance || 0), 0);
  
      setMetrics({
        totalPaid,
        totalOutstanding,
      });
  
      toast({
        title: "Payment Successful",
        description: `Your payment of ₦${paymentDetails.amount.toLocaleString()} has been processed.`,
        variant: "default",
        duration: 5000,
      });
  
      setIsPaymentModalOpen(false);
      setSelectedPayment(null);
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "There was an error processing your payment.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleDateSelect = (date: string) => {
    try {
      const selectedDate = new Date(date);
      
      if (isNaN(selectedDate.getTime())) {
        throw new Error("Invalid date");
      }
      
      // Create a function to check if dates are the same day
      const isSameDay = (date1: Date, date2: Date) => {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
      };
      
      // Filter dues based on date
      const filteredDuesByDate = originalDues.filter((due) => {
        if (!due.date) return false;
        
        try {
          const dueDate = new Date(due.date);
          return isSameDay(dueDate, selectedDate);
        } catch (error) {
          console.error("Error parsing due date:", error);
          return false;
        }
      });
      
      setDues(filteredDuesByDate);
      setCurrentPage(1);
      
      // Close calendar after selection
      setIsCalendarOpen(false);
      
      toast({
        title: "Filter Applied",
        description: `Showing dues for ${selectedDate.toLocaleDateString()}`,
        variant: "default",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error applying date filter:", error);
      toast({
        title: "Filter Error",
        description: "Could not apply date filter. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const isValidUserData = (data: any): data is UserData => {
    return (
      data !== null &&
      typeof data === "object" &&
      typeof data.id === "string"
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setDues(originalDues);
    setCurrentPage(1);
    
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared.",
      variant: "default",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="w-full mx-auto">
          <div className="bg-white w-full rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold mb-2">Dues</h3>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <div className="flex bg-green-100 w-8 h-8 rounded-lg items-center justify-center mr-2">
                    <SquareCheckBig className="text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">Total amount Paid</p>
                </div>
                {isLoadingMetrics ? (
                  <div className="h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
                ) : (
                  <p className="font-bold text-3xl">₦{metrics.totalPaid.toLocaleString()}</p>
                )}
              </div>

              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <div className="flex bg-green-100 w-8 h-8 rounded-lg items-center justify-center mr-2">
                    <CircleSlash className="text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">Total outstanding</p>
                </div>
                {isLoadingMetrics ? (
                  <div className="h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
                ) : (
                  <p className="font-bold text-3xl">₦{metrics.totalOutstanding.toLocaleString()}</p>
                )}
              </div>

              <div className="flex justify-end rounded-lg p-4">
                <div className="flex rounded-lg items-center justify-center mr-2">
                  <button
                    className={`${
                      metrics.totalOutstanding === 0 
                        ? "bg-blue-300 cursor-not-allowed" 
                        : "bg-blue-900 hover:bg-blue-600"
                    } text-white p-2 rounded-full`}
                    onClick={handleSettleAllPayments}
                    disabled={metrics.totalOutstanding === 0}
                  >
                    Settle all Payments
                  </button>
                </div>
              </div>
            </div>
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
                  placeholder="Search by name, type, or status..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end w-full md:w-1/3 space-x-2">
                {/* Reset Filter Button */}
                {(searchQuery || dues.length !== originalDues.length) && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                  >
                    <span className="text-sm text-gray-700">Reset Filters</span>
                  </button>
                )}
                
                {/* Calendar Filter Button */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCalendarOpen(!isCalendarOpen);
                    }}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Date Filter</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>
                  <CalendarFilter
                    isOpen={isCalendarOpen}
                    onClose={() => setIsCalendarOpen(false)}
                    onSelect={handleDateSelect}
                  />
                </div>
              </div>
            </div>

            {/* Dues Table */}
            {isLoadingDues ? (
              <div className="flex justify-center items-center py-8">
                <div className="h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredDues.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No dues found. {dues.length !== originalDues.length && (
                  <button 
                    onClick={resetFilters}
                    className="text-blue-500 hover:underline ml-1"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="border-b border-gray-300">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">Payment Name</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">Type</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">Total Amount (₦)</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">Balance (₦)</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">Created Date</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">Status</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {getCurrentItems().map((due, index) => (
                      <tr key={due.id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800">{due.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{due.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{due.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {due.balance > 0 ? 
                            <span className="text-red-600">₦{due.balance.toLocaleString()}</span> : 
                            <span className="text-green-600">₦0</span>
                          }
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {due.date ? new Date(due.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }) : "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          {renderStatusBadge(due.paymentStatus)}
                        </td>
                        <td className="px-6 py-4 relative">
                          <div className="relative">
                            <button
                              onClick={() => toggleActionMenu(index)}
                              disabled={due.paymentStatus === "FULLY_PAID"}
                              className={due.paymentStatus === "FULLY_PAID" ? "opacity-50 cursor-not-allowed" : ""}
                            >
                              <MoreVertical className="w-5 h-5 text-gray-500" />
                            </button>

                            {actionMenuOpen === index && due.paymentStatus !== "FULLY_PAID" && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                <div className="py-1">
                                  <button
                                    onClick={() => handleMakePayment(due)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Make Payment
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
            {filteredDues.length > 0 && (
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

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedPayment && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedPayment(null);
          }}
          totalAmount={selectedPayment.amount}
          billingId={selectedPayment.id || ""}
          title={selectedPayment.title}
          userData={isValidUserData(userData) ? userData : {}}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

export default MemberDueRender;