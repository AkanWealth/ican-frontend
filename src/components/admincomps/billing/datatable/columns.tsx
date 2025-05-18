"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Billing } from "@/libs/types";
import { Button } from "@/components/ui/button";
import Statbtn from "@/components/genui/Statbtn";
import CellActions from "@/components/admincomps/billing/actions/CellActions";

export const billingcolumns: ColumnDef<Billing>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0 text-left"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Billing Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0 text-left"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <span className="text-primary font-semibold">₦</span>
          <span>{row.original.amount}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "frequency ",
    header: "Frequency",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <span>
            {row.original.frequency.replace(/_/g, " ").charAt(0).toUpperCase() +
              row.original.frequency.replace(/_/g, " ").slice(1).toLowerCase()}
          </span>
        </div>
      );
    },
  },

  
  {
    accessorKey: "nextDueDate",
    header: "Next Due Date",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <span>{row.original.nextDueDate ? new Date(row.original.nextDueDate).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/\//g, '-') : '-'}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "autoApply",
    header: "Auto Apply",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <span>{row.original.autoApply ? "Yes" : "No"}</span>
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return <CellActions row={row} />;
    },
  },
];
