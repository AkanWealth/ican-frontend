"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { BillingTable } from "@/components/admincomps/billing/datatable/BillingTable";
import { billingcolumns } from "@/components/admincomps/billing/datatable/columns";
import { billings } from "@/components/admincomps/billing/datatable/colsdata";

function BillingPage() {
  const router = useRouter();
  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <h2 className="flex flex-col gap-2 text-left items-start font-semibol text-2xl text-black">
          Billing Management
          <span className="text-base text-gray-600">
            Create member bills and track their invoices here
          </span>
        </h2>
        <button
          className="bg-primary text-white text-base font-semibold rounded-full w-fit px-3 py-2 whitespace-nowrap h-fit"
          onClick={() => router.push("/admin/billing/create")}
        >
          Create New Bill
        </button>
      </div>
      {/* Tab sections */}
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl w-full font-semibold text-left border-b border-gray-500 ">
          Invoices & Billings
        </h2>
        <div>
          <BillingTable columns={billingcolumns} data={billings} />
        </div>
      </div>
    </div>
  );
}

export default BillingPage;
