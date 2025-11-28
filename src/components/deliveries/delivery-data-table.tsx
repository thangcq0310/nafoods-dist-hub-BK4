
"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
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
import { Card } from "../ui/card";

interface DeliveryDataTableProps {
  statusFilter: DeliveryStatus[] | null;
}

export function DeliveryDataTable({ statusFilter }: DeliveryDataTableProps) {
  const { deliveries } = useData();
  const [data, setData] = React.useState<Delivery[]>([]);
  const [filter, setFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'orderId', desc: true }
  ]);

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
      header: () => <div className="text-right text-card-foreground">Hành động</div>,
      cell: ({ row }) => <RowActions delivery={row.original} />,
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
        sorting,
    }
  });

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        <Input
          placeholder="Lọc theo mã đơn, mã giao, khách hàng, tài xế..."
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
                    <TableHead key={header.id} className="text-card-foreground">
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
                  className="[&_td]:text-card-foreground"
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
                  className="h-24 text-center text-card-foreground"
                >
                  Không tìm thấy kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
