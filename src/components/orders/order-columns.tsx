
"use client";

import type { Order, OrderStatus } from "@/lib/types";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, Ban } from "lucide-react";
import { useData } from "@/hooks/use-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";


const statusConfig: { [key in OrderStatus]: { variant: "default" | "secondary" | "destructive" | "accent" } } = {
  "Confirmed": "default",
  "Pending Approval": "accent",
  "Canceled": "destructive",
};

const StatusCell = ({ order }: { order: Order }) => {
  const { updateOrderStatus } = useData();
  const { toast } = useToast();
  const config = statusConfig[order.status];

  const handleStatusUpdate = (newStatus: OrderStatus) => {
    updateOrderStatus(order.id, newStatus);
    toast({
      title: "Cập nhật thành công",
      description: `Trạng thái đơn hàng đã đổi thành "${newStatus}".`,
    });
  };

  const getNextStatuses = (): { status: OrderStatus; label: string; icon: React.ElementType; isDestructive?: boolean }[] => {
    switch (order.status) {
      case "Pending Approval":
        return [
          { status: 'Confirmed', label: 'Xác nhận đơn hàng', icon: Check },
          { status: 'Canceled', label: 'Hủy đơn hàng', icon: Ban, isDestructive: true },
        ];
      case "Confirmed":
         return [
          { status: 'Canceled', label: 'Hủy đơn hàng', icon: Ban, isDestructive: true },
        ];
      default:
        return [];
    }
  };

  const nextStatuses = getNextStatuses();

  const button = (
    <Button variant={config.variant} className="w-[150px] justify-center" disabled={!nextStatuses.length}>
        {order.status}
    </Button>
  );

  if (!nextStatuses.length) {
    return button;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {button}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {nextStatuses.map(({ status, label, icon: Icon, isDestructive }) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusUpdate(status)}
            className={cn(isDestructive && "text-destructive")}
          >
            <Icon className="mr-2 h-4 w-4" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


export const orderColumns = [
  {
    accessorKey: "id",
    header: "Mã Đơn",
    cell: ({ row }: { row: { original: Order } }) => <div className="font-medium">{row.original.id}</div>,
  },
  {
    accessorKey: "customer",
    header: "Khách hàng",
    cell: ({ row }: { row: { original: Order } }) => row.original.customer.name,
  },
  {
    accessorKey: "orderDate",
    header: "Ngày đặt",
    cell: ({ row }: { row: { original: Order } }) => format(new Date(row.original.orderDate), "dd/MM/yyyy"),
  },
  {
    accessorKey: "deliveryDate",
    header: "Ngày giao",
    cell: ({ row }: { row: { original: Order } }) => format(new Date(row.original.deliveryDate), "dd/MM/yyyy"),
  },
   {
    accessorKey: "confirmationDate",
    header: "Thời gian xác nhận",
    cell: ({ row }: { row: { original: Order } }) => 
      row.original.confirmationDate 
        ? format(new Date(row.original.confirmationDate), "dd/MM/yyyy HH:mm") 
        : 'N/A',
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }: { row: { original: Order } }) => <StatusCell order={row.original} />,
  },
];
