"use client";

import * as React from "react";
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
  const [filteredDeliveries, setFilteredDeliveries] = React.useState<Delivery[]>([]);
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

    setFilteredDeliveries(newFilteredDeliveries);
  }, [filter, statusFilter, deliveries]);

  const columns = deliveryColumns;

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
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.accessorKey}>{col.header}</TableHead>
              ))}
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeliveries.length ? (
              filteredDeliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  {columns.map((col) => (
                    <TableCell key={col.accessorKey}>
                      {col.cell ? col.cell({ row: delivery }) : (delivery as any)[col.accessorKey]}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <RowActions delivery={delivery} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
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
