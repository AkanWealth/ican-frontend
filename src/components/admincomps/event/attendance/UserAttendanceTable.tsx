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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setter: React.Dispatch<React.SetStateAction<string[]>>;
}

export function UserAttendanceTable<TData, TValue>({
  columns,
  data,
  setter,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});
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
      rowSelection,
    },
  });

  function onAccept(selectedRows: TData[]) {
    setter(selectedRows.map((row) => String((row as any).id))); // Extract and convert the 'id' field to string
  }

  return (
    <div>
      <div className="flex flex-row justify-between w-full  items-center py-4">
        <Input
          placeholder="Filter by attendee name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <button className=" bg-primary text-white rounded-full py-2 px-3 border border-white whitespace-nowrap ">
          Mark as Present
        </button>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
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
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} member(s) selected.
      </div>
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
      <div className="flex justify-end py-4">
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            const selectedRows = table
              .getSelectedRowModel()
              .rows.map((row) => row.original);
            onAccept(selectedRows); // Pass the selected rows to the parent component via the callback
          }}
        >
          Accept
        </Button>
      </div>
    </div>
  );
}
