"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { UserAttendance } from "./colsdata";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import Statbtn from "@/components/genui/Statbtn";

import { RegisteredUsers } from "@/libs/types";

export const userattendancecolumns: ColumnDef<UserAttendance>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0 text-left"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name of Attendee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "memberid",
    header: "Member ID",
  },
  {
    accessorKey: "email",
    header: "Email",
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
];
export const registereduserscolumns: ColumnDef<RegisteredUsers>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0 text-left"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name of Attendee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "membership",
    header: "Membership",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "proofOfPayment",
    header: "Proof of Payment",
  },
  {
    accessorKey: "createdAt",
    header: "Registered At",
    cell: ({ row }) => {
      const day = new Date(row.original.createdAt);
      return (
        <span>
          {day.toLocaleTimeString()}{" "}
          {`${String(day.getDate()).padStart(2, "0")}-${String(
            day.getMonth() + 1
          ).padStart(2, "0")}-${day.getFullYear()}`}
        </span>
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
