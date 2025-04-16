"use client";
import React, { useState, ReactNode, useEffect } from "react";
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
import CalendarFilter from "@/components/homecomps/CalendarFilter";
import Image from "next/image";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Checkbox } from "@mui/material";
import TablePagination from "@/components/Pagenation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import PaymentHistory from "../TabRender/PaymentHistory";
import Outstanding from "../TabRender/Outstanding";
import Subscription from "../TabRender/Subscription";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface FormData {
  eventName: string;
  description: string;
}

interface FormErrors {
  eventName?: string;
  description?: string;
}

interface PaymentDetails {
  paymentType: string;
  amountDue: string;
  dueDate: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

const PaymentPage = () => {
  const [activeTab, setActiveTab] = useState("Outstanding");
  const [searchQuery, setSearchQuery] = useState("");

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  isCalendarOpen;
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    eventName: "",
    description: "",
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState("Full");
  const [partialAmount, setPartialAmount] = useState("");
  const [isTotalModalOpen, setIsTotalModalOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isDonationModalOpen, setisDonationModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [activities, setActivities] = useState([
    {
      PaymentType: "Registration fee",
      AmountDue: "10,000",
      date: "Jan 15, 2022",
      status: "unpaid",
      Payment: true,
    },
    {
      PaymentType: "Annual Dues (2024) fee",
      AmountDue: "10,000",
      date: "Jan 15, 2024",
      status: "unpaid",
      Payment: true,
    },
    {
      PaymentType: "Annual Dues (2023)",
      AmountDue: "10,000",
      date: "Jan 15, 2023",
      status: "unpaid",
      Payment: true,
    },
    {
      PaymentType: "Annual Dues (2024) fee",
      AmountDue: "10,000",
      date: "Jan 15, 2025",
      status: "partially paid",
      Payment: true,
      amountLeft: "3,000",
    },
    {
      PaymentType: "Registration fee",
      AmountDue: "10,000",
      date: "Jan 15, 2022",
      status: "unpaid",
      Payment: true,
    },
    {
      PaymentType: "Annual Dues (2024) fee",
      AmountDue: "5,000",
      date: "Jan 15, 2024",
      status: "unpaid",
      Payment: true,
    },
    {
      PaymentType: "Monthly Dues (2023)",
      AmountDue: "7,000",
      date: "Jan 15, 2023",
      status: "unpaid",
      Payment: true,
    },
    {
      PaymentType: "Annual Dues (2024) fee",
      AmountDue: "10,000",
      date: "Jan 15, 2025",
      status: "partially paid",
      Payment: true,
      amountLeft: "3,000",
    },
  ]);

  const resetActivities = () => {
    setActivities([
      {
        PaymentType: "Registration fee",
        AmountDue: "10,000",
        date: "Jan 15, 2022",
        status: "unpaid",
        Payment: true,
      },
      {
        PaymentType: "Annual Dues (2024) fee",
        AmountDue: "10,000",
        date: "Jan 15, 2024",
        status: "unpaid",
        Payment: true,
      },
      {
        PaymentType: "Annual Dues (2023)",
        AmountDue: "10,000",
        date: "Jan 15, 2023",
        status: "unpaid",
        Payment: true,
      },
      {
        PaymentType: "Annual Dues (2024) fee",
        AmountDue: "10,000",
        date: "Jan 15, 2025",
        status: "partially paid",
        Payment: true,
        amountLeft: "3,000",
      },
      {
        PaymentType: "Registration fee",
        AmountDue: "10,000",
        date: "Jan 15, 2022",
        status: "unpaid",
        Payment: true,
      },
      {
        PaymentType: "Annual Dues (2024) fee",
        AmountDue: "5,000",
        date: "Jan 15, 2024",
        status: "unpaid",
        Payment: true,
      },
      {
        PaymentType: "Monthly Dues (2023)",
        AmountDue: "7,000",
        date: "Jan 15, 2023",
        status: "unpaid",
        Payment: true,
      },
      {
        PaymentType: "Annual Dues (2024) fee",
        AmountDue: "10,000",
        date: "Jan 15, 2025",
        status: "partially paid",
        Payment: true,
        amountLeft: "3,000",
      },
    ]);
  };

  const [Subcription, setSubcription] = useState([
    {
      SubcriptionPeroid: "2025(Current)",
      BaseFee: "10,000",
      Discount: "0",
      status: "unpaid",
      Action: true,
    },
    {
      SubcriptionPeroid: "2024",
      BaseFee: "10,000",
      Discount: "0",
      status: "paid",
      Action: false,
    },
    {
      SubcriptionPeroid: "2023",
      BaseFee: "10,000",
      Discount: "0",
      status: "paid",
      Action: false,
    },
    {
      SubcriptionPeroid: "2022",
      BaseFee: "10,000",
      Discount: "0",
      status: "unpaid",
      Action: true,
    },
    {
      SubcriptionPeroid: "2021",
      BaseFee: "10,000",
      Discount: "0",
      status: "paid",
      Action: false,
    },
    {
      SubcriptionPeroid: "2024",
      BaseFee: "10,000",
      Discount: "0",
      status: "unpaid",
      Action: true,
    },
    {
      SubcriptionPeroid: "2023",
      BaseFee: "10,000",
      Discount: "0",
      status: "paid",
      Action: false,
    },
    {
      SubcriptionPeroid: "2022",
      BaseFee: "10,000",
      Discount: "0",
      status: "paid",
      Action: false,
    },
    {
      SubcriptionPeroid: "2021",
      BaseFee: "10,000",
      Discount: "0",
      status: "unpaid",
      Action: true,
    },
  ]);

  const resetSubcription = () => {
    setSubcription([
      {
        SubcriptionPeroid: "2025(Current)",
        BaseFee: "10,000",
        Discount: "0",
        status: "unpaid",
        Action: true,
      },
      {
        SubcriptionPeroid: "2024",
        BaseFee: "10,000",
        Discount: "0",
        status: "paid",
        Action: false,
      },
      {
        SubcriptionPeroid: "2023",
        BaseFee: "10,000",
        Discount: "0",
        status: "paid",
        Action: false,
      },
      {
        SubcriptionPeroid: "2022",
        BaseFee: "10,000",
        Discount: "0",
        status: "unpaid",
        Action: true,
      },
      {
        SubcriptionPeroid: "2021",
        BaseFee: "10,000",
        Discount: "0",
        status: "paid",
        Action: false,
      },
      {
        SubcriptionPeroid: "2024",
        BaseFee: "10,000",
        Discount: "0",
        status: "unpaid",
        Action: true,
      },
      {
        SubcriptionPeroid: "2023",
        BaseFee: "10,000",
        Discount: "0",
        status: "paid",
        Action: false,
      },
      {
        SubcriptionPeroid: "2022",
        BaseFee: "10,000",
        Discount: "0",
        status: "paid",
        Action: false,
      },
      {
        SubcriptionPeroid: "2021",
        BaseFee: "10,000",
        Discount: "0",
        status: "unpaid",
        Action: true,
      },
    ]);
  };

  const [Payment, setPayment] = useState([
    {
      TransactionID: "TXN123456",
      SubcriptionPeroid: "Amount Due 2023",
      AmountPaid: "5,000",
      PaymentMethod: "Bank Transfer",
      status: "failed",
      reciept: false,
    },
    {
      TransactionID: "TXN123456",
      SubcriptionPeroid: "Amount Due 2024",
      AmountPaid: "10,000",
      PaymentMethod: "Debit Card",
      status: "successful",
      reciept: true,
    },
    {
      TransactionID: "TXN123456",
      SubcriptionPeroid: "Amount Due 2022",
      AmountPaid: "10,000",
      PaymentMethod: "Bank Transfer",
      status: "successful",
      reciept: true,
    },
    {
      TransactionID: "TXN123456",
      SubcriptionPeroid: "Amount Due 2021",
      AmountPaid: "5,000",
      PaymentMethod: "Debit Card",
      status: "failed",
      reciept: false,
    },
    {
      TransactionID: "TXN123456",
      SubcriptionPeroid: "Amount Due 2023",
      AmountPaid: "6,000",
      PaymentMethod: "Bank Transfer",
      status: "successful",
      reciept: true,
    },
    {
      TransactionID: "TXN123456",
      SubcriptionPeroid: "Amount Due 2025",
      AmountPaid: "7,000",
      PaymentMethod: "Debit Card",
      status: "successful",
      reciept: true,
    },
    {
      TransactionID: "TXN123456",
      SubcriptionPeroid: "Amount Due 2022",
      AmountPaid: "8,000",
      PaymentMethod: "Bank Transfer",
      status: "failed",
      reciept: false,
    },
    {
      TransactionID: "TXN123456",
      SubcriptionPeroid: "Amount Due 2021",
      AmountPaid: "10,000",
      PaymentMethod: "Debit Card",
      status: "successful",
      reciept: true,
    },
    {
      TransactionID: "TXN123456",
      SubcriptionPeroid: "Amount Due 2020",
      AmountPaid: "10,000",
      PaymentMethod: "Bank Transfer",
      status: "successful",
      reciept: true,
    },
  ]);

  const resetPayment = () => {
    setPayment([
      {
        TransactionID: "TXN123456",
        SubcriptionPeroid: "Amount Due 2023",
        AmountPaid: "5,000",
        PaymentMethod: "Bank Transfer",
        status: "failed",
        reciept: false,
      },
      {
        TransactionID: "TXN123456",
        SubcriptionPeroid: "Amount Due 2024",
        AmountPaid: "10,000",
        PaymentMethod: "Debit Card",
        status: "successful",
        reciept: true,
      },
      {
        TransactionID: "TXN123456",
        SubcriptionPeroid: "Amount Due 2022",
        AmountPaid: "10,000",
        PaymentMethod: "Bank Transfer",
        status: "successful",
        reciept: true,
      },
      {
        TransactionID: "TXN123456",
        SubcriptionPeroid: "Amount Due 2021",
        AmountPaid: "5,000",
        PaymentMethod: "Debit Card",
        status: "failed",
        reciept: false,
      },
      {
        TransactionID: "TXN123456",
        SubcriptionPeroid: "Amount Due 2023",
        AmountPaid: "6,000",
        PaymentMethod: "Bank Transfer",
        status: "successful",
        reciept: true,
      },
      {
        TransactionID: "TXN123456",
        SubcriptionPeroid: "Amount Due 2025",
        AmountPaid: "7,000",
        PaymentMethod: "Debit Card",
        status: "successful",
        reciept: true,
      },
      {
        TransactionID: "TXN123456",
        SubcriptionPeroid: "Amount Due 2022",
        AmountPaid: "8,000",
        PaymentMethod: "Bank Transfer",
        status: "failed",
        reciept: false,
      },
      {
        TransactionID: "TXN123456",
        SubcriptionPeroid: "Amount Due 2021",
        AmountPaid: "10,000",
        PaymentMethod: "Debit Card",
        status: "successful",
        reciept: true,
      },
      {
        TransactionID: "TXN123456",
        SubcriptionPeroid: "Amount Due 2020",
        AmountPaid: "10,000",
        PaymentMethod: "Bank Transfer",
        status: "successful",
        reciept: true,
      },
    ]);
  };

  const totalPages = Math.ceil(activities.length / itemsPerPage);

  const getCurrentItems = () => {
    // const indexOfLastItem = currentPage * itemsPerPage;
    // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // return activities.slice(indexOfFirstItem, indexOfLastItem);
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredActivities.slice(startIndex, startIndex + itemsPerPage);
  };
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activities.length]);

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

  const handleSearchChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchQuery(e.target.value);
  };

  const filteredActivities = activities.filter(
    (activity) =>
      activity.PaymentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.AmountDue.toString().includes(searchQuery) ||
      activity.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.status.toLowerCase().includes(searchQuery) ||
      activity.PaymentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle payment submission
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

    console.log(`Payment method: ${paymentMethod}, Amount paid: ${amountPaid}`); // Debug log

    // Close the modal
    setIsPaymentModalOpen(false);
    setSelectedPayment(null);
    setPartialAmount("");
  };
  const calculateTotalAmount = (selectedIndices: any[]) => {
    return selectedIndices.reduce((total, index) => {
      const amount = activities[index].amountLeft
        ? parseFloat(activities[index].amountLeft.replace(/,/g, ""))
        : parseFloat(activities[index].AmountDue.replace(/,/g, ""));
      return total + amount;
    }, 0);
  };

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
  const handleMakeDonation = () => {
    setisDonationModalOpen(true);
  };
  const handleProceedToDonate = () => {
    if (donationAmount.trim() === "" || isNaN(Number(donationAmount))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive", // Use a warning style if needed
      });
      return;
    }

    toast({
      title: "Donation Successful",
      description: `You have donated ₦${donationAmount}. Thank you for your support!`,
      variant: "default",
    });

    setisDonationModalOpen(false); // Close modal after donation
    setDonationAmount(""); // Reset input field
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

  const handleSelectItem = (index: number) => {
    const selectedItemsCopy = [...selectedItems];
    const itemIndex = selectedItemsCopy.indexOf(index);

    if (itemIndex === -1) {
      // Add to selected
      selectedItemsCopy.push(index);
    } else {
      // Remove from selected
      selectedItemsCopy.splice(itemIndex, 1);
    }

    setSelectedItems(selectedItemsCopy);

    // Update select all checkbox state
    setSelectAll(selectedItemsCopy.length === activities.length);
  };

  const handleTabChange = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);

    const selectedDateObj = new Date(date);

    const filteredActivities = activities.filter((activity) => {
      const activityDate = new Date(activity.date);
      return (
        activityDate.getDate() === selectedDateObj.getDate() &&
        activityDate.getMonth() === selectedDateObj.getMonth() &&
        activityDate.getFullYear() === selectedDateObj.getFullYear()
      );
    });

    setActivities(filteredActivities);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: FormErrors = {};

    if (!formData.eventName.trim()) {
      errors.eventName = "Event/Activity Name is required";
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Handle form submission here
    setIsModalOpen(false);
    setFormData({ eventName: "", description: "" });
  };

  const renderDonationModal = () => {
    return (
      <Modal
        isOpen={isDonationModalOpen}
        onClose={() => setisDonationModalOpen(false)}
      >
        <div className="p-2">
          <div className="space-y-6">
            <div className=" space-y-4 mb-4">
              <h2 className="text-2xl font-bold">
                Support ICAN SDS - Make A Donation
              </h2>

              <div className="mb-4 border border-gray-400 p-4 rounded-xl">
                <p className="text-base text-gray-700">Amount(₦)</p>
                <input
                  type="text"
                  placeholder="Enter Amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="border border-gray-500 focus:outline-none focus:border-blue-500 w-full p-2"
                />
              </div>
            </div>
            <div className="border border-[#7B7B7B] mt-6 mb-8"></div>
            <div className="border border-gray-400 rounded-lg p-4 mt-6">
              <h3 className="text-2xl font-medium text-gray-700 mb-4">
                Donation Options
              </h3>

              <p className="font-semibold">Make this a recurring donation</p>
              <p className="font-medium text-gray-600 mb-3"></p>
              <div className="flex space-x-6 mb-4">
                <label className="flex items-center space-x-2 text-gray-700">
                  <input type="checkbox" className="h-4 w-4 text-gray-200" />
                  <span>Monthly</span>
                </label>

                <label className="flex items-center space-x-2 text-gray-700">
                  <input type="checkbox" className="h-4 w-4 text-blue-600" />
                  <span>Quarterly</span>
                </label>

                <label className="flex items-center space-x-2 text-gray-700">
                  <input type="checkbox" className="h-4 w-4 text-primary" />
                  <span>Annually</span>
                </label>
              </div>

              <label className="flex items-center space-x-2 ">
                <input type="checkbox" className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-black font-semibold">
                  Donate Anonymously
                </span>{" "}
                <span className="text-gray-700">
                  {" "}
                  (Your name won't be displayed publicly)
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <button
              onClick={handleProceedToDonate}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Proceed to Donate
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const renderTotalModal = () => {
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

  const renderSubscription = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white max-w-[1100px] flex flex-col item-center rounded-xl border border-gray-300 p-6 mb-10">
            <h1 className="font-medium text-lg mb-6">Subsription Payment</h1>
            <div className="flex justify-between items-center w-full">
              <div className="w-1/2"></div>
              <div className="flex flex-row gap-10 w-3/4">
                <div className="relative group w-3/4">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Search className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by title, tag, or category..."
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

            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-center text-gray-500 py-4">
                  No Subcription payment found for the selected date.
                </p>
                <button
                  onClick={resetSubcription}
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
                    {Subcription.slice(0, itemsPerPage).map((sub, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800  whitespace-nowrap">
                          {sub.SubcriptionPeroid}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800  whitespace-nowrap">
                          {sub.BaseFee}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800  whitespace-nowrap">
                          {sub.Discount}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800  whitespace-nowrap">
                          {parseInt(sub.BaseFee.replace(/,/g, "")) -
                            parseInt(sub.Discount.replace(/,/g, ""))}
                        </td>
                        <td className="px-6 py-4  whitespace-nowrap">
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
              totalPages={Math.ceil(Subcription.length / itemsPerPage)}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      </div>
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      >
        <h2 className="text-xl font-bold mb-4">Report Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Event/Activity Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter event name"
            />
            {formErrors.eventName && (
              <p className="mt-1 text-sm text-red-500">
                {formErrors.eventName}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Description of Issue<span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg h-36"
              placeholder="Enter details of the issue"
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-500">
                {formErrors.description}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Submit Request
          </button>
        </form>
      </Modal>
    </div>
  );
  const renderPaymentHistory = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white max-w-[1100px] flex flex-col item-center rounded-xl border border-gray-300 p-6 mb-10">
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
                    placeholder="Search by title, tag, or category..."
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

            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-center text-gray-500 py-4">
                  No activities found for the selected date.
                </p>
                <button
                  onClick={resetPayment}
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
                        Transaction ID
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                        Subcription Peroid
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                        Amount Due(₦)
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
                    {Payment.slice(0, itemsPerPage).map((pay, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {pay.TransactionID}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {pay.SubcriptionPeroid}
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
                          {pay.reciept ? (
                            <button className="px-4 py-1 bg-primary text-white text-sm rounded-full hover:bg-blue-700">
                              Download
                            </button>
                          ) : (
                            <span className="px-4 py-1 bg-primary text-white text-sm rounded-full hover:bg-blue-700">
                              Retry
                            </span>
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
              totalPages={Math.ceil(Payment.length / itemsPerPage)}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Report Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Event/Activity Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter event name"
            />
            {formErrors.eventName && (
              <p className="mt-1 text-sm text-red-500">
                {formErrors.eventName}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Description of Issue<span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg h-36"
              placeholder="Enter details of the issue"
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-500">
                {formErrors.description}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Submit Request
          </button>
        </form>
      </Modal>
    </div>
  );

  const [totalOutstanding, setTotalOutstanding] = useState(0);

  useEffect(() => {
    const fetchOutstandingData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("User is not authenticated. Please log in again.");
          return;
        }

        // Fetch total outstanding payment
        const totalOutstandingResponse = await axios.get(
          "https://ican-api-6000e8d06d3a.herokuapp.com/api/payments/total-outstanding",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const totalOutstanding =
          totalOutstandingResponse.data?.totalOutstanding || 0;

        // Fetch outstanding breakdown
        const outstandingBreakdownResponse = await axios.get(
          "https://ican-api-6000e8d06d3a.herokuapp.com/api/payments/outstanding-breakdown",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const outstandingBreakdown =
          outstandingBreakdownResponse.data?.breakdown || [];

        // Update state with API data
        setTotalOutstanding(totalOutstanding);
        setActivities(outstandingBreakdown);
      } catch (error) {
        console.error("Failed to fetch outstanding data:", error);
      }
    };

    fetchOutstandingData();
  }, []);

  const renderOutstanding = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        <div className="w-full mx-auto">
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="lg:w-1/2  md:w-full h-30 bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-gray-600 mb-2">Total Outstanding</h3>
              <div className="flex items-center justify-between">
                <span className="lg:text-xl md:text-sm font-medium">
                  ₦{totalOutstanding.toLocaleString()}
                </span>
                <div className="rounded-full flex items-center justify-center px-4 py-2 bg-primary  hover:bg-blue-700 hover:text-lg">
                  <button
                    onClick={handleSelectPaymentAll}
                    className="text-sm text-white rounded-xl flex items-center "
                  >
                    Settle All Payment
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white max-w-[1100px] flex flex-col item-center rounded-xl border border-gray-300 p-6 mb-10">
            <h1 className="font-semibold lg:text-lg md:text-base mb-6">
              Outstanding Dues Breakdown
            </h1>
            <div className="flex lg:flex-row md:flex-col justify-between items-center w-full">
              <div className="w-1/2">
                <button className="px-4 py-2 lg:text-base md:text-sm bg-primary text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 hover:text-lg">
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

            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-center text-gray-500 py-4">
                  No payment activities found for the selected date.
                </p>
                <button
                  onClick={resetActivities}
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
                          {renderStatusBadge(
                            activity.status,
                            activity.amountLeft
                          )}
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
            )}
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      </div>
      {renderPaymentModal()}
      {renderTotalModal()}
    </div>
  );

  return (
    <div className="py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Payment</h1>
        </div>
        <button
          onClick={handleMakeDonation}
          className="px-4 py-2 text-base bg-primary text-white rounded-xl flex items-center gap-2 hover:bg-blue-700"
        >
          Make a Donation
        </button>
      </div>

      {/* Personal Details Section */}
      <div className="w-full mb-6">
        <div className="flex w-full max-w-[600px] bg-gray-200 rounded-xl p-2">
          <button
            onClick={() => handleTabChange("Outstanding")}
            className={`flex-1 text-xs px-2 md:px-2 lg:px-8 py-2 rounded-lg hover:bg-blue-700 ${
              activeTab === "Outstanding"
                ? "bg-primary text-white"
                : "text-gray-800 hover:bg-gray-300"
            }`}
          >
            Settle Payments
          </button>
          <button
            onClick={() => handleTabChange("Subcription")}
            className={`flex-1 text-xs px-2 md:px-4 lg:px-8 py-2 rounded-lg ${
              activeTab === "Subcription"
                ? "bg-primary text-white"
                : "text-gray-800 hover:bg-gray-300"
            }`}
          >
            Subcription Payment
          </button>
          <button
            onClick={() => handleTabChange("PaymentHistory")}
            className={`flex-1 text-xs px-2 md:px-4 lg:px-8 py-2 rounded-lg  ${
              activeTab === "PaymentHistory"
                ? "bg-primary text-white"
                : "text-gray-800 hover:bg-gray-300"
            }`}
          >
            Payment History
          </button>
        </div>
        {/* <div className="text-sm text-gray-500 mt-6">{getTabDescription()}</div> */}
      </div>

      {activeTab === "Outstanding" && <Outstanding />}
      {activeTab === "Subcription" && <Subscription />}
      {activeTab === "PaymentHistory" && <PaymentHistory />}

      {renderDonationModal()}
    </div>
  );
};

export default PaymentPage;
