"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  OverdueBills,
  PaymentDetailsTable,
  BillingUsersDetails,
  WaiverCode,
  BillingPaymentTable,
} from "@/libs/types";

import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import Statbtn from "@/components/genui/Statbtn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";

import DeleteWaiver from "@/components/admincomps/payment/actions/DeleteWaiver";
import ViewWaiver from "../actions/ViewWaiver";
import ViewReceipt from "../actions/ViewReceipt";

export const paymentcoloumns: ColumnDef<PaymentDetailsTable>[] = [
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
    accessorKey: "userId",
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
          {row.original.user.firstname} {row.original.user.middlename}
          {row.original.user.surname}
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
  {
    id: "actions",
    cell: ({ row }) => <PaymentActionsCell row={row} />,
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
    accessorKey: "billing.amount",
    header: "Amount",
  },
  {
    accessorKey: "billing.frequency",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0 text-left"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Billing cycle <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.billing.frequency
            .replace(/_/g, " ")
            .charAt(0)
            .toUpperCase() +
            row.original.billing.frequency
              .replace(/_/g, " ")
              .slice(1)
              .toLowerCase()}
        </div>
      );
    },
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

export const paymentdetailscoloumns: ColumnDef<PaymentDetailsTable>[] = [
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

export const billingdetailscoloumns: ColumnDef<BillingPaymentTable>[] = [
  {
    accessorKey: "paymentType",
    header: "Payment Type",
  },
  {
    accessorKey: "amount",
    header: "Amount Paid",
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
    accessorKey: "paymentStatus",
    header: "Payment Status",
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
export const waivercoloumns: ColumnDef<WaiverCode>[] = [
  {
    accessorKey: "code",
    header: "Waiver Code",
  },
  {
    accessorKey: "billing.name",
    header: "Bill Name",
  },
  {
    accessorKey: "billing.amount",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0 text-left"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount Waived
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>₦{row.original?.billing?.amount.toLocaleString("en-NG")}</div>;
    },
  },
  {
    accessorKey: "currentUsages",
    header: "Used By",
    cell: ({ row }) => {
      return <div>{row.original.usedBy?.length || 0} users</div>;
    },
  },
  {
    accessorKey: "maxUsages",
    header: "Max Usages",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.maxUsages ? row.original.maxUsages : "Unlimited"}
        </div>
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
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {new Date(row.original.createdAt).toLocaleString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "expiresAt",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0 text-left"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Expires At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {new Date(row.original.expiresAt).toLocaleString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const currentTime = new Date();
      const expirationTime = new Date(row.original.expiresAt);
      const status = currentTime > expirationTime ? "expired" : "active";
      return <Statbtn status={status} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <WaiverActionsCell row={row} />,
  },
];

const WaiverActionsCell = ({ row }: { row: any }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowViewModal(true)}>
            View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="bg-red-600 text-white"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showViewModal && (
        <ViewWaiver
          key={row.original.id}
          waiver={row.original}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {showDeleteDialog && (
        <DeleteWaiver
          id={row.original.id}
          code={row.original.code}
          billName={row.original.billing.name}
          amount={row.original.billing.amount}
          createdAt={row.original.createdAt}
          onClose={() => setShowDeleteDialog(false)}
        />
      )}
    </>
  );
};

const PaymentActionsCell = ({ row }: { row: any }) => {
  const [showViewModal, setShowViewModal] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowViewModal(true)}>
            View Receipt
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showViewModal && (
        <ViewReceipt
        key={row.original.id}
          open={showViewModal}
          onPrint={() => {}}  
          payment={row.original}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </>
  );
};
