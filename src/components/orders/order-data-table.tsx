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
import { orderColumns } from "./order-columns";
import { CreateOrderSheet } from "./create-order-sheet";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Order } from "@/lib/types";

export function OrderDataTable() {
  const { orders } = useData();
  const [filteredOrders, setFilteredOrders] = React.useState<Order[]>(orders);
  const [filter, setFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  React.useEffect(() => {
    let newFilteredOrders = orders;

    if (filter) {
      newFilteredOrders = newFilteredOrders.filter(
        (order) =>
          order.id.toLowerCase().includes(filter.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
        newFilteredOrders = newFilteredOrders.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(newFilteredOrders);
  }, [filter, statusFilter, orders]);


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Lọc theo mã đơn, khách hàng..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
           <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Pending Approval">Chờ duyệt</SelectItem>
              <SelectItem value="Confirmed">Đã xác nhận</SelectItem>
              <SelectItem value="Canceled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
          <CreateOrderSheet />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {orderColumns.map((col) => (
                <TableHead key={col.accessorKey}>{col.header}</TableHead>
              ))}
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  {orderColumns.map((col) => (
                    <TableCell key={col.accessorKey}>
                      {col.cell ? col.cell({ row: order }) : order[col.accessorKey as keyof Order]}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    {orderColumns[orderColumns.length-1].cell!({ row: order })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={orderColumns.length + 1}
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
