"use client";
import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { Check, Download } from "lucide-react";
import { Leckerli_One, League_Spartan } from "next/font/google";
import Image from "next/image";
import { parseCookies } from "nookies";

const leckerliOne = Leckerli_One({ subsets: ["latin"], weight: "400" });
const leagueSpartan = League_Spartan({ subsets: ["latin"], weight: "200" });

interface PaymentReceiptProps {
  payment: {
    id: string;
    userId: string;
    billingId: string;
    paymentType: string;
    amount: number;
    datePaid: string;
    status: string;
    transactionId: string | null;
    subscriptionId: string | null;
    subscriptionPeriod?: string;
    paymentMethod?: string;
  };
  onSuccess?: () => void;
}

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  payment,
  onSuccess,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [userData, setUserData] = useState<{
    firstname: string;
    surname: string;
    middleName?: string;
    email?: string;
  }>({
    firstname: "Member",
    surname: "",
    middleName: "",
    email: "",
  });
  const [showPreview, setShowPreview] = useState(false);
  const [receiptDate] = useState(
    new Date(payment.datePaid).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  );

  // Generate random receipt number if not provided
  const [receiptNumber] = useState(
    payment.transactionId || 
    `ICAN-RCP-${Math.floor(100000 + Math.random() * 900000).toString()}`
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const cookies = parseCookies();
        const userDataCookie = cookies["user_data"];
        const userData = userDataCookie ? JSON.parse(userDataCookie) : null;
        
        setUserData({
          firstname: userData?.firstname || "Member",
          surname: userData?.surname || "",
          middleName: userData?.middleName || "",
          email: userData?.email || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const generateAndDownloadReceipt = async () => {
    if (!receiptRef.current) return;

    setIsGenerating(true);

    try {
      // First show the receipt so it can render properly
      setShowPreview(true);

      // Wait for the receipt to be visible in the DOM
      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(receiptRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: true,
      });

      // Convert the canvas to a data URL and download it
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `ICAN_Payment_Receipt_${payment.transactionId || userData.surname.replace(/\s+/g, "_")}.png`;
      link.click();

      // Show success notification
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setShowPreview(false); // Hide preview after download
      }, 3000);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error generating receipt:", error);
      alert("There was an error generating your receipt. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Format amount with commas
  const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    });
  };

  return (
    <>
      {/* Receipt Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">Payment Receipt</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            {/* Receipt Content */}
            <div
              ref={receiptRef}
              className="relative w-[595px] h-[842px] bg-white p-8 rounded-lg shadow-lg overflow-hidden"
              style={{
                fontFamily: "Arial, sans-serif",
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.94), rgba(255,255,255,0.94)), url(/certificate-bg.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Decorative Border */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  right: "20px",
                  bottom: "20px",
                  border: "2px solid #0066CC",
                  borderRadius: "10px",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              ></div>

              {/* Receipt Content */}
              <div className="relative z-10 flex flex-col h-full py-6 space-y-4">
                {/* Header */}
                <div className="text-center items-center border-b border-gray-200 pb-6">
                  <div className="flex justify-center mb-4">
                    <Image
                      src="/Icanlogo.png"
                      alt="ICAN Logo"
                      className="w-auto"
                      width={180}
                      height={90}
                    />
                  </div>
                  <h1 className="text-3xl font-bold text-blue-900 mb-2">
                    OFFICIAL RECEIPT
                  </h1>
                  <p className="text-gray-600">
                    Institute of Chartered Accountants of Nigeria
                  </p>
                </div>

                {/* Receipt Details */}
                <div className="flex flex-col space-y-6 mb-6">
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <p className="text-sm text-gray-600">Receipt issued to:</p>
                      <p className="text-lg font-bold text-blue-800">
                        {`${userData.surname} ${userData.firstname} ${userData.middleName || ""}`}
                      </p>
                      {userData.email && (
                        <p className="text-sm text-gray-600">{userData.email}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Receipt No:</p>
                      <p className="text-lg font-medium">{receiptNumber}</p>
                      <p className="text-sm text-gray-600">Date:</p>
                      <p className="text-lg font-medium">{receiptDate}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Details Table */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-blue-100">
                      <tr>
                        <th className="py-3 px-4 text-left text-blue-800">Description</th>
                        <th className="py-3 px-4 text-right text-blue-800">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="py-4 px-4">
                          <p className="font-medium">{payment.subscriptionPeriod || "Membership Subscription"}</p>
                          <p className="text-sm text-gray-600">Payment Method: {payment.paymentMethod || "Online Payment"}</p>
                        </td>
                        <td className="py-4 px-4 text-right font-bold">
                          {formatAmount(payment.amount)}
                        </td>
                      </tr>
                      <tr className="border-t bg-gray-50">
                        <td className="py-3 px-4 text-right font-bold">Total</td>
                        <td className="py-3 px-4 text-right font-bold">
                          {formatAmount(payment.amount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Payment Status */}
                <div className="flex justify-center my-6">
                  <div className="bg-green-100 text-green-800 px-6 py-2 rounded-full flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    <span className="font-bold">Payment Successful</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-6">
                  <div className="border-t border-gray-200 pt-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">
                      Thank you for your payment
                    </p>
                    <p className="text-xs text-gray-500">
                      This is a computer-generated receipt and requires no signature
                    </p>
                  </div>
                  <div className="mt-6 flex justify-between text-xs text-gray-500">
                    <div>Transaction ID: {payment.transactionId || "N/A"}</div>
                    <div>Receipt generated on: {new Date().toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 mr-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={generateAndDownloadReceipt}
                disabled={isGenerating}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isGenerating ? "Generating..." : "Download Receipt"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md flex items-center shadow-lg z-50">
          <Check className="w-5 h-5 mr-2" />
          <span>Receipt downloaded successfully!</span>
        </div>
      )}

      {/* Download Button */}
      <button
        onClick={() => setShowPreview(true)}
        disabled={isGenerating}
        className="px-4 py-1 rounded-full bg-primary text-white hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-1"
      >
        <Download className="w-4 h-4" />
        <span>{isGenerating ? "Generating..." : "Download"}</span>
      </button>
    </>
  );
};

export default PaymentReceipt;