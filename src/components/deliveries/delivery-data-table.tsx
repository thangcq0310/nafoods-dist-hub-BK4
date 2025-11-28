"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useData } from "@/hooks/use-data";
import { deliveryColumns, RowActions } from "./delivery-columns";
import { Input } from "@/components/ui/input";
import type { Delivery, DeliveryStatus } from "@/lib/types";

interface DeliveryDataTableProps {
  statusFilter: DeliveryStatus[] | null;
}

export function DeliveryDataTable({ statusFilter }: DeliveryDataTableProps) {
  const { deliveries } = useData();
  const [data, setData] = React.useState<Delivery[]>([]);
  const [filter, setFilter] = React.useState("");

  React.useEffect(() => {
    let newFilteredDeliveries = deliveries;

    if (statusFilter) {
      newFilteredDeliveries = newFilteredDeliveries.filter(d => statusFilter.includes(d.status));
    }
    
    if (filter) {
      newFilteredDeliveries = newFilteredDeliveries.filter(
        (delivery) =>
          delivery.order.id.toLowerCase().includes(filter.toLowerCase()) ||
          delivery.id.toLowerCase().includes(filter.toLowerCase()) ||
          delivery.order.customer.name.toLowerCase().includes(filter.toLowerCase()) ||
          delivery.driverName?.toLowerCase().includes(filter.toLowerCase()) ||
          delivery.vehicleNumber?.toLowerCase().includes(filter.toLowerCase())
      );
    }

    setData(newFilteredDeliveries);
  }, [filter, statusFilter, deliveries]);
  
  const columns: ColumnDef<Delivery>[] = [
    ...deliveryColumns,
    {
      id: "actions",
      cell: ({ row }) => <RowActions delivery={row.original} />,
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Lọc theo mã đơn, mã giao hàng, khách hàng, tài xế..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-md"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                  Không tìm thấy kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
