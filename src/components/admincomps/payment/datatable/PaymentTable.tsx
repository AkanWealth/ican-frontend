"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

//for Pagination
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// For Sorting
import * as React from "react";

import Image from "next/image";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setter?: React.Dispatch<React.SetStateAction<string[]>>;
  type?: string;
}

export function PaymentTable<TData, TValue>({
  columns,
  data,
  setter,
  type,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 30,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  // Automatically update setter when selection changes
  React.useEffect(() => {
    if (setter) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      setter(selectedRows.map((row) => String((row as any).id)));
    }
    // Only run when the selected rows change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection, setter]);

  // Allowed statuses for billingDetails
  const allowedStatuses = [
    "SUCCESS",
    "WAIVED",
    "FAILED",
    "PENDING",
    "REFUNDED",
    "NOT_PAID",
    "PARTIALLY_PAID",
    "FULLY_PAID",
  ];

  // Filter data based on selected statuses (if billingDetails)
  const filteredData =
    type === "billingDetails" &&
    Array.isArray(data) &&
    selectedStatuses.length > 0
      ? data.filter((user: any) =>
          selectedStatuses.includes(user.paymentStatus)
        )
      : data;

  return (
    <div>
      <div className="flex items-center justify-between py-4 gap-4">
        <Input
          placeholder="Search across all fields..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        {type === "billingDetails" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[180px] justify-between"
              >
                {selectedStatuses.length > 0
                  ? `Status: ${selectedStatuses.join(", ")}`
                  : "Filter by Status"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="flex flex-col gap-2">
                {allowedStatuses.map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={(checked) => {
                        setSelectedStatuses((prev) =>
                          checked
                            ? [...prev, status]
                            : prev.filter((s) => s !== status)
                        );
                      }}
                      id={`status-${status}`}
                    />
                    <Label htmlFor={`status-${status}`}>
                      {status
                        .toLowerCase()
                        .replace(/[_-]/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())
                        .replace(/^./, (c) => c.toUpperCase())}
                    </Label>
                  </label>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => setSelectedStatuses([])}
                >
                  Clear
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <div className="">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="font-medium text-neutral-700"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {filteredData.length ? (
              table
                .getRowModel()
                .rows.filter((row) =>
                  // Only show rows that are in filteredData
                  filteredData.some(
                    (item: any) => item.id === (row.original as any).id
                  )
                )
                .map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Image
                    className="mx-auto"
                    src="/EmptyBillingTable.png"
                    alt="Empty"
                    width={400}
                    height={400}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {setter && (
        <div className="flex-1 text-sm text-muted-foreground">
          <p>
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} member(s) selected.
          </p>
        </div>
      )}
      <div className="flex flex-row items-center justify-center">
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          {Array.from({ length: table.getPageCount() }, (_, index) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageCount = table.getPageCount();
            if (
              index === 0 ||
              index === pageCount - 1 ||
              (index >= pageIndex - 1 && index <= pageIndex + 1)
            ) {
              return (
                <Button
                  key={index}
                  variant={pageIndex === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => table.setPageIndex(index)}
                >
                  {index + 1}
                </Button>
              );
            } else if (
              (index === pageIndex - 2 && index > 1) ||
              (index === pageIndex + 2 && index < pageCount - 2)
            ) {
              return <span key={index}>...</span>;
            } else {
              return null;
            }
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
