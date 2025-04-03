"use client";
import React, { useState } from "react";
import { useFlutterwave } from "flutterwave-react-v3";
import { FlutterWaveResponse } from "flutterwave-react-v3/dist/types";

interface TransactionDetails {
  amount: number;
  email: string;
  phone_number: string;
  name: string;
  title: string;
}

function FlutterModal({
  amount,
  email,
  phone_number,
  name,
  title,
}: TransactionDetails) {
  const config = {
    public_key:
      process.env.FLW_PUBLIC_KEY ||
      "FLWPUBK_TEST-534b5997be3928deed468163ca379112-X",
    tx_ref: Date.now().toString(),
    amount: amount,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: email,
      phone_number: phone_number,
      name: name,
    },
    customizations: {
      title: title,
      description: "Pay to complete processes",
      logo: "",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  function setTransactionResponse(response: FlutterWaveResponse) {
    console.log("Transaction Response:", response);
    if (response.status === "successful") {
      alert("Payment successful! Transaction ID: " + response.transaction_id);
    } else {
      alert("Payment failed. Please try again.");
    }
  }

  // Removed duplicate function implementation

  return (
    <div>
      <button
        className="bg-blue-500 text-white p-2 rounded"
        onClick={() => {
          handleFlutterPayment({
            callback: (response) => {
              setTransactionResponse(response);
              //   closePaymentModal(); // this will close the modal programmatically
            },
            onClose: () => {},
          });
        }}
      >
        Pay with Flutterwave
      </button>
    </div>
  );
}

export default FlutterModal;
