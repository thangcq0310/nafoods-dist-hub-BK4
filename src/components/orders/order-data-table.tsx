
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
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import type { Order } from "@/lib/types";
import { exportToExcel } from "@/lib/export";
import { Card } from "../ui/card";
import { format } from "date-fns";

export function OrderDataTable() {
  const { orders } = useData();
  const [data, setData] = React.useState<Order[]>(orders);
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

    setData(newFilteredOrders);
  }, [filter, statusFilter, orders]);

  const table = useReactTable({
    data,
    columns: orderColumns as ColumnDef<Order, unknown>[],
    getCoreRowModel: getCoreRowModel(),
  });

  const handleExport = () => {
    const dataToExport = data.map(o => ({
        'Mã Đơn': o.id,
        'Khách hàng': o.customer.name,
        'Ngày đặt': format(new Date(o.orderDate), 'dd/MM/yyyy'),
        'Ngày giao': format(new Date(o.deliveryDate), 'dd/MM/yyyy'),
        'Thời gian xác nhận': o.confirmationDate ? format(new Date(o.confirmationDate), 'dd/MM/yyyy HH:mm') : 'N/A',
        'Trạng thái': o.status,
        'Sản phẩm': o.items.map(item => `${item.product.name} (SL: ${item.quantity} ${item.unit})`).join('; ')
    }));
    exportToExcel(dataToExport, "Danh_sach_don_hang");
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4 mb-4">
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
          <Button onClick={handleExport} variant="outline">
            <FileDown className="mr-2 h-4 w-4" /> Export Excel
          </Button>
          <CreateOrderSheet />
        </div>
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
                  colSpan={orderColumns.length}
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
