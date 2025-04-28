"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack, MdDelete } from "react-icons/md";
import InputEle from "@/components/genui/InputEle";
import { BillUserTable } from "@/components/admincomps/billing/create/BillUserTable";
import { userbillingcolumns } from "@/components/admincomps/billing/create/columns";
import { billings } from "@/components/admincomps/billing/create/colsdata";
import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

import { toast, useToast } from "@/hooks/use-toast";
import { handleUnauthorizedRequest } from "@/utils/refresh_token";

interface IBilling {
  billing_name: string;
  billing_type: string;
  billing_description: string;
  billing_amount: string;
  billing_date: string;
  reciepients: "all" | string[];
}

function CreateBillingPage() {
  //const selected = React.useMemo(() => [], []);
  const [selected, setSelected] = useState<string[]>([]);
  const [recipientType, setRecipientType] = useState<string>("all");

  const router = useRouter();
  const [newBill, setNewBill] = useState<IBilling>({
    billing_name: "",
    billing_type: "",
    billing_description: "",
    billing_amount: "0",
    billing_date: "",
    reciepients: "all",
  });
  useEffect(() => {
    console.log("Selected recipients:", selected);
  }, [selected]);

  const onInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setNewBill((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const saveBill = async () => {
    let data = JSON.stringify({
      name: newBill.billing_name,
      type: newBill.billing_type,
      amount: newBill.billing_amount,
      affectedUserIds: newBill.reciepients,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BASE_API_URL}/billing`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      data: data,
    };
    try {
      const response = await axios.request(config);

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Bill created successfully.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error creating bill:", error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          await handleUnauthorizedRequest(config, router, setNewBill);
        }
      } else {
        toast({
          title: "Error",
          description: "An error occurred while creating the bill.",
          variant: "destructive",
        });
      }
    }
  };
  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-col mb-6 w-full items-start justify-start">
        <button
          className="text-gray-500 text-base flex flex-row gap-2  font-semibold w-fit my-2 h-fit"
          onClick={() => router.back()}
        >
          <MdArrowBack className="w-6 h-6 " />
          Back
        </button>
        <h2 className="font-semibol text-2xl text-black">Create New Billing</h2>
      </div>
      {/* Tab sections */}
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl w-full font-semibold text-left border-b border-gray-500 ">
          Bill Creation
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <InputEle
            label="Billing Name"
            id="billing_name"
            type="text"
            value={newBill.billing_name}
            onChange={onInputChange}
            placeholder="Enter bill name"
          />{" "}
          <InputEle
            label="Bill type"
            id="billing_type"
            type="text"
            value={newBill.billing_type}
            onChange={onInputChange}
            placeholder="Enter bill type"
          />
          <InputEle
            label="Billing Description"
            id="billing_description"
            type="text"
            value={newBill.billing_description}
            onChange={onInputChange}
            placeholder="Enter bill description"
          />
          <InputEle
            label="Bill Amount"
            id="billing_amount"
            type="text"
            value={newBill.billing_amount}
            onChange={onInputChange}
            placeholder="Enter bill amount"
          />
          <InputEle
            label="Due Date"
            id="billing_date"
            type="date"
            value={newBill.billing_date}
            onChange={onInputChange}
            placeholder="Enter bill due date"
          />
          <InputEle
            label="Reciepients"
            id="reciepients"
            type="select"
            options={[
              { value: "all", label: "All members" },
              { value: "select", label: "Select members" },
            ]}
            value={recipientType}
            onChange={(e) => setRecipientType(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={saveBill}
        >
          Create Bill
        </button>
      </div>
      {recipientType === "select" && (
        <div className="rounded-3xl mt-10 px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
          <h2 className="text-xl w-full font-semibold text-left border-b border-gray-500 ">
            Select members{" "}
          </h2>
          <BillUserTable
            columns={userbillingcolumns}
            data={billings}
            setter={setSelected}
          />
        </div>
      )}
    </div>
  );
}

export default CreateBillingPage;
