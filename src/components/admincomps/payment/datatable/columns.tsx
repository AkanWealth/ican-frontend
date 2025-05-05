"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import {
  OverdueBills,
  PaymentDetails,
  PaymentBasic,
  BillingUsersDetails,
} from "@/libs/types";

import { Button } from "@/components/ui/button";
import Statbtn from "@/components/genui/Statbtn";
import CellActions from "@/components/admincomps/payment/actions/CellActions";

export const paymentcoloumns: ColumnDef<PaymentDetails>[] = [
  {
    accessorKey: "user.firstname",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0 text-left"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Member Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.user.firstname} {row.original.user.surname}
        </div>
      );
    },
  },

  {
    accessorKey: "paymentType",
    header: "Payment Type",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "datePaid",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0 text-left"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Paid
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>{new Date(row.original.datePaid).toLocaleDateString("en-GB")}</div>
      );
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0 text-left"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <Statbtn status={row.original.status} />;
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     return <CellActions row={row} />;
  //   },
  // },
];
export const dashPaymentcoloumns: ColumnDef<OverdueBills>[] = [
  {
    accessorKey: "user.firstname",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0 text-left"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Member Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      return (
        <div>
          {row.original.user.firstname} {row.original.user.surname}
        </div>
      );
    },
  },

  {
    accessorKey: "billing.name",
    header: "Bill Name",
  },
  {
    accessorKey: "billing.type",
    header: "Bill Type",
  },
  {
    accessorKey: "billing.amount",
    header: "Amount",
  },
  {
    accessorKey: "billing.createdAt",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0 text-left"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {new Date(row.original.billing.createdAt).toLocaleDateString("en-GB")}
        </div>
      );
    },
  },
];

export const paymentdetailscoloumns: ColumnDef<PaymentDetails>[] = [
  {
    accessorKey: "user.firstname",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0 text-left"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Member Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.user.firstname} {row.original.user.surname}
        </div>
      );
    },
  },
  {
    accessorKey: "user.membershipId",
    header: "Member ID",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "datePaid",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0 text-left"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Paid Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>{new Date(row.original.datePaid).toLocaleDateString("en-GB")}</div>
      );
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0 text-left"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invoice Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <Statbtn status={row.original.status} />;
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     return <CellActions row={row} />;
  //   },
  // },
];

export const billingdetailscoloumns: ColumnDef<PaymentBasic>[] = [
  {
    accessorKey: "paymentType",
    header: "Payment Type",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "datePaid",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0 text-left"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Paid
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>{new Date(row.original.datePaid).toLocaleDateString("en-GB")}</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <Statbtn status={row.original.status} />;
    },
  },
];
export const billingusersdetailscoloumns: ColumnDef<BillingUsersDetails>[] = [
  {
    accessorKey: "paymentType",
    header: "Payment Type",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "affectedUsers.amountPaid",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0 text-left"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount Paid
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
   
  },
  {
    accessorKey: "affectedUsers.paymentStatus",
    header: "Status",
    cell: ({ row }) => {
      return <Statbtn status={row.original.affectedUsers[0].paymentStatus} />;
    },
  },
];
