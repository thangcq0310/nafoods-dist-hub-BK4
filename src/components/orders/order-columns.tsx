"use client";

import type { Order, OrderStatus } from "@/lib/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Check, X } from "lucide-react";
import { useData } from "@/hooks/use-data";
import { useToast } from "@/hooks/use-toast";

const statusVariant: { [key in OrderStatus]: "default" | "secondary" | "destructive" } = {
  "Confirmed": "default",
  "Pending Approval": "secondary",
  "Canceled": "destructive",
};

const RowActions = ({ order }: { order: Order }) => {
  const { updateOrderStatus } = useData();
  const { toast } = useToast();

  const handleConfirm = () => {
    updateOrderStatus(order.id, "Confirmed");
    toast({ title: "Thành công", description: `Đơn hàng ${order.id} đã được xác nhận.` });
  };
  
  const handleCancel = () => {
    updateOrderStatus(order.id, "Canceled");
    toast({ title: "Thông báo", description: `Đơn hàng ${order.id} đã được hủy.`, variant: 'destructive' });
  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Mở menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>
          Sao chép mã đơn
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {order.status === "Pending Approval" && (
          <DropdownMenuItem onClick={handleConfirm}>
            <Check className="mr-2 h-4 w-4" />
            Xác nhận
          </DropdownMenuItem>
        )}
        {order.status !== "Canceled" && (
           <DropdownMenuItem className="text-destructive" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Hủy đơn
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const orderColumns = [
  {
    accessorKey: "id",
    header: "Mã Đơn",
    cell: ({ row }: { row: Order }) => <div className="font-medium">{row.id}</div>,
  },
  {
    accessorKey: "customer",
    header: "Khách hàng",
    cell: ({ row }: { row: Order }) => row.customer.name,
  },
  {
    accessorKey: "shippingAddress",
    header: "Địa chỉ",
    cell: ({ row }: { row: Order }) => `${row.shippingAddress.street}, ${row.shippingAddress.city}`,
  },
  {
    accessorKey: "orderDate",
    header: "Ngày đặt",
    cell: ({ row }: { row: Order }) => format(new Date(row.orderDate), "dd/MM/yyyy"),
  },
  {
    accessorKey: "deliveryDate",
    header: "Ngày giao",
    cell: ({ row }: { row: Order }) => format(new Date(row.deliveryDate), "dd/MM/yyyy"),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }: { row: Order }) => (
      <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }: { row: Order }) => <RowActions order={row} />,
  },
];
