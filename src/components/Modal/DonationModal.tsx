import React, { useState } from "react";
import { X } from "lucide-react";
import FlutterModal from "@/components/genui/FlutterModal";
import donationService from "@/services/donationService";
import { useToast } from "@/hooks/use-toast";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    email?: string;
    phoneNumber?: string;
    fullName?: string;
  };
}

const donationOptions = [
  { id: "one-time", label: "One-Time" },
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly" },
  { id: "yearly", label: "Annually" },
];

const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  userData,
}) => {
  const [amount, setAmount] = useState("");
  const [donationOption, setDonationOption] = useState<
    "one-time"|"monthly" | "quarterly" | "yearly"
  >("one-time");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimal points
    setAmount(value);
  };

  const handleSuccess = async (response: any) => {
    try {
      // Call the donation service to record the donation
      await donationService.makeDonation({
        paymentType: "CARD",
        amount: parseFloat(amount),
        donationOption,
        anonymous: isAnonymous,
        transactionId: response.transaction_id,
      });

      toast({
        title: "Donation Successful",
        description: `Thank you for your ${donationOption} donation of ₦${parseFloat(
          amount
        ).toLocaleString()}`,
        variant: "default",
        duration: 3000,
      });

      onClose();
    } catch (error) {
      console.error("Failed to record donation:", error);
      toast({
        title: "Error",
        description:
          "Your payment was processed, but we couldn't record your donation. Please contact support.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const isFormValid = () => {
    return amount && parseFloat(amount) > 0;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-[720px] relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold mb-4">
          Support ICAN SDS - Make A Donation
        </h2>

        <div className="space-y-6">
          {/* Amount Input */}
          <div className="mb-4 border border-gray-400 p-4 rounded-xl">
            <p className="text-base text-gray-700">Amount (₦)</p>
            <input
              type="text"
              placeholder="Enter Amount"
              value={amount}
              onChange={handleAmountChange}
              className="border border-gray-500 focus:outline-none focus:border-blue-500 w-full p-2"
            />
          </div>

          {/* Donation Options */}
          <div className="border border-gray-400 rounded-lg p-4 mt-6">
            <h3 className="text-2xl font-medium text-gray-700 mb-4">
              Donation Options
            </h3>
            <p className="font-semibold">Make this a recurring donation</p>
            <div className="flex space-x-6 mb-4">
              {donationOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center space-x-2 text-gray-700 cursor-pointer ${
                    donationOption === option.id
                      ? "text-blue-600 font-semibold"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="donationOption"
                    value={option.id}
                    checked={donationOption === option.id}
                    onChange={() => setDonationOption(option.id as any)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>

            {/* Anonymous Option */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm text-black font-semibold">
                Donate Anonymously
              </span>
              <span className="text-gray-700">
                {" "}
                (Your name won't be displayed publicly)
              </span>
            </label>
          </div>
        </div>

        <div className="pt-4 space-y-4">
          <FlutterModal
            amount={parseFloat(amount) || 0}
            email={userData?.email || ""}
            phoneNumber={userData?.phoneNumber || "08000000000"}
            name={userData?.fullName || "Donor"}
            title="Donation"
            description={`${donationOption} donation${
              isAnonymous ? " (Anonymous)" : ""
            }`}
            paymentType="CARD"
            onSuccess={handleSuccess}
            onFailure={() => {
              toast({
                title: "Payment Failed",
                description: "Something went wrong with your payment.",
                variant: "destructive",
                duration: 3000,
              });
            }}
            onClose={onClose}
            buttonText={`Proceed to Donate ₦${(parseFloat(amount) || 0).toLocaleString()}`}
            disabled={!isFormValid()}
          />
        </div>
      </div>
    </div>
  );
};

export default DonationModal;