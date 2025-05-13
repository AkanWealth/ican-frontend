import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { FlutterWaveButton } from "flutterwave-react-v3";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

import { EventDetails } from "@/libs/types";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventDetails;
}

const RegisterModal = ({ isOpen, onClose, event }: RegisterModalProps) => {
  const { toast } = useToast();

  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    membership: "NON_MEMBER",
    proofOfPayment: "NOTPAID",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.proofOfPayment === "NOTPAID") {
      toast({
        title: "Payment Required",
        description: "Please pay to validate registration",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log(formData);

    try {
      const response = await axios.post(
        `${BASE_API_URL}/events/registrations/${event.id}/register`,
        {
          fullName: formData.fullName,
          email: formData.email,
          membership: formData.membership,
          proofOfPayment: formData.proofOfPayment,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        console.log("Registration response:", response.data);
      }

      toast({
        title: "Registration Successful",
        description: `You've registered for ${event.name}`,
        variant: "default",
      });

      setFormData({
        fullName: "",
        email: "",
        membership: "NON_MEMBER",
        proofOfPayment: "NOTPAID",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFlutterwavePayment = () => {
    const config = {
      public_key:
        process.env.FLW_PUBLIC_KEY ||
        "FLWPUBK_TEST-534b5997be3928deed468163ca379112-X", // Replace with your actual public key
      tx_ref: Date.now().toString(),
      amount: Number(event.fee),
      currency: "NGN",
      payment_options: "card, banktransfer",
      customer: {
        email: formData.email,
        name: formData.fullName,
        phonenumber: phoneNumber, // Replace with a valid phone number
      },
      customizations: {
        title: event.name,
        description: "Event Registration Payment",
        logo: "https://your-logo-url.com/logo.png", // Replace with your logo URL
      },
    };

    return config;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register for Event</DialogTitle>
          <DialogDescription>
            {event.name} - {new Date(event.date).toLocaleDateString()} at{" "}
            {event.venue}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="fullName"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <FlutterWaveButton
            {...handleFlutterwavePayment()}
            callback={(response) => {
              if (response.status === "successful") {
                setIsPaymentSuccessful(true); // Mark payment as successful
                toast({
                  title: "Payment Successful",
                  description: "You can proceed to submit your registration",
                  variant: "default",
                  duration: 3000, // Ensure duration is long enough to be visible
                });
                formData.proofOfPayment = response.transaction_id.toString();
              } else {
                toast({
                  title: "Payment Failed",
                  description: "Something went wrong. Please try again.",
                  variant: "destructive",
                  duration: 3000,
                });
              }
              console.log(response);
            }}
            onClose={() => {
              console.log("Payment closed");
            }}
            text={`Pay ₦${event.fee}`}
            className={`w-full py-2 px-4 rounded-full ${
              isPaymentSuccessful
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white transition duration-300 mb-4`}
            disabled={isPaymentSuccessful}
          />

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
