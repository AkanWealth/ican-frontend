import React, { useState } from "react";
import { X } from "lucide-react";
import FlutterModal from "@/components/genui/FlutterModal";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  billingId: string;
  title?: string;
  userData: {
    email?: string;
    phoneNumber?: string;
    fullName?: string;
  };
  onPaymentSuccess: (data: {
    billingId: string;
    paymentType: string;
    amount: number;
    transactionId: string;
    status: string;
  }) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  totalAmount, 
  billingId, 
  title = "Payment", 
  userData, 
  onPaymentSuccess 
}) => {
  const [paymentMethod, setPaymentMethod] = useState("full");
  const [partialAmount, setPartialAmount] = useState("");
  
  if (!isOpen) return null;
  
  const handleAmountChange = (e: any) => {
    // Allow only numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    
    // Ensure it's a valid number and not greater than the total amount
    if (!value || parseFloat(value) <= totalAmount) {
      setPartialAmount(value);
    }
  };
  
  const getPaymentAmount = () => {
    return paymentMethod === "full" ? totalAmount : parseFloat(partialAmount || "0");
  };
  
  const isPaymentValid = () => {
    if (paymentMethod === "full") return true;
    return partialAmount && parseFloat(partialAmount) > 0 && parseFloat(partialAmount) <= totalAmount;
  };
  
  // User data for the payment
  const email = userData?.email || "";
  const phoneNumber = userData?.phoneNumber || "08000000000";
  const name = userData?.fullName || "User";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold mb-4">Settle Payment</h2>
        
        <p className="text-base text-gray-700 mb-2">
          Payment For: <span className="font-medium">{title}</span>
        </p>
        <p className="text-base text-gray-700 mb-4">
          Total Amount: <span className="font-medium">₦{totalAmount.toLocaleString()}</span>
        </p>

        {/* Payment Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div
            className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer ${
              paymentMethod === "full" ? "border-blue-500" : "border-gray-300"
            }`}
            onClick={() => setPaymentMethod("full")}
          >
            <div className="w-5 h-5 rounded-full border border-gray-300 mb-2 flex items-center justify-center">
              {paymentMethod === "full" && (
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              )}
            </div>
            <p className="font-medium text-center">Full Payment</p>
            <p className="font-medium text-center">₦{totalAmount.toLocaleString()}</p>
          </div>

          <div
            className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer ${
              paymentMethod === "partial" ? "border-blue-500" : "border-gray-300"
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
                onChange={handleAmountChange}
              />
            </div>
          </div>
        </div>

        {/* Flutter Modal Integration */}
        <FlutterModal
          amount={getPaymentAmount()}
          email={email}
          // email="owoeyeadenike0@gmail.com"
          phoneNumber={phoneNumber}
          name={name}
          title={title}
          description={`Payment for ${title}`}
          paymentType="CARD"
          onSuccess={(response) => {
            // Handle the success response and pass it to the parent component
            onPaymentSuccess({
              billingId,
              paymentType: "CARD",
              amount: getPaymentAmount(),
              transactionId: response.transaction_id,
              status: "SUCCESS"
            });
          }}
          onFailure={() => onClose()}
          onClose={onClose}
          buttonText={`Proceed to Pay ₦${getPaymentAmount().toLocaleString()}`}
          disabled={!isPaymentValid()}
        />
      </div>
    </div>
  );
};

export default PaymentModal;