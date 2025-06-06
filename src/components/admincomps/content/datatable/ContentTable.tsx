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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ContentTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  // Let's check the column IDs in the provided columns array
  const columnIds = React.useMemo(() => {
    return columns.map((col) => col.id).filter(Boolean);
  }, [columns]);

  // Check if name or title exists in the columns
  const hasNameColumn = React.useMemo(
    () => columnIds.includes("name"),
    [columnIds]
  );
  const hasTitleColumn = React.useMemo(
    () => columnIds.includes("title"),
    [columnIds]
  );

  // Determine which column to use for filtering
  const filterColumnId = React.useMemo(() => {
    if (hasNameColumn) return "name";
    if (hasTitleColumn) return "title";
    return null;
  }, [hasNameColumn, hasTitleColumn]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        {filterColumnId && (
          <Input
            placeholder="Search by titles..."
            value={
              (table.getColumn(filterColumnId)?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) => {
              table
                .getColumn(filterColumnId)
                ?.setFilterValue(event.target.value);
            }}
            className="max-w-sm"
          />
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
                  <div className="flex items-center justify-center">
                    <Image
                      src="/Emptycontenttable.png"
                      alt="No data"
                      width={400}
                      height={400}
                    />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
    </div>
  );
}
