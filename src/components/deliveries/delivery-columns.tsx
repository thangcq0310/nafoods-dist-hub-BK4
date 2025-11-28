"use client";

import type { Delivery, DeliveryStatus } from "@/lib/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Truck, Printer, Copy, CheckCircle, Clock, XCircle, ArrowRight, Package } from "lucide-react";
import { useData } from "@/hooks/use-data";
import { useToast } from "@/hooks/use-toast";
import { CreateDeliverySheet } from "./create-delivery-sheet";

const statusConfig: { [key in DeliveryStatus]: { variant: "default" | "secondary" | "destructive" | "outline", icon: React.ElementType, label: string } } = {
  "Needs Delivery": { variant: "outline", icon: Package, label: 'Cần giao' },
  "Waiting for Pickup": { variant: "secondary", icon: Clock, label: 'Chờ giao' },
  "In Transit": { variant: "default", icon: Truck, label: 'Đang vận chuyển' },
  "Delivered": { variant: "default", icon: CheckCircle, label: 'Đã giao' },
  "Failed": { variant: "destructive", icon: XCircle, label: 'Thất bại' },
  "Canceled": { variant: "destructive", icon: XCircle, label: 'Đã hủy' },
};

export const RowActions = ({ delivery }: { delivery: Delivery }) => {
  const { updateDeliveryStatus } = useData();
  const { toast } = useToast();

  const handleStatusUpdate = (status: DeliveryStatus) => {
    updateDeliveryStatus(delivery.id, status);
    toast({ title: "Cập nhật thành công", description: `Trạng thái giao hàng ${delivery.id} đã đổi thành "${statusConfig[status].label}".` });
  };
  
  const handlePrint = () => {
    window.open(`/print/delivery/${delivery.id}`, '_blank');
  };

  const isActionable = delivery.status !== 'Delivered' && delivery.status !== 'Canceled' && delivery.status !== 'Failed';

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
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(delivery.id)}>
          <Copy className="mr-2 h-4 w-4" /> Sao chép mã giao hàng
        </DropdownMenuItem>
        
        {delivery.status === "Needs Delivery" && (
          <CreateDeliverySheet orderId={delivery.order.id} trigger={
            <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              <ArrowRight className="mr-2 h-4 w-4" /> Tạo lệnh giao
            </div>
          } />
        )}

        {isActionable && delivery.status !== "Needs Delivery" && (
           <DropdownSub>
            <DropdownSubTrigger>
              <Truck className="mr-2 h-4 w-4" />
              <span>Cập nhật trạng thái</span>
            </DropdownSubTrigger>
            <DropdownMenuPortal>
              <DropdownSubContent>
                <DropdownMenuLabel>Chọn trạng thái mới</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(statusConfig).map(status => (
                  <DropdownMenuItem key={status} onClick={() => handleStatusUpdate(status as DeliveryStatus)} disabled={delivery.status === status}>
                    {statusConfig[status as DeliveryStatus].label}
                  </DropdownMenuItem>
                ))}
              </DropdownSubContent>
            </DropdownMenuPortal>
          </DropdownSub>
        )}
        
        {delivery.status !== "Needs Delivery" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> In phiếu giao hàng
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


export const deliveryColumns = [
  {
    accessorKey: "id",
    header: "Mã Giao Hàng",
    cell: ({ row }: { row: Delivery }) => <div className="font-medium">{row.id}</div>,
  },
  {
    accessorKey: "orderId",
    header: "Mã Đơn Hàng",
    cell: ({ row }: { row: Delivery }) => row.order.id,
  },
  {
    accessorKey: "customer",
    header: "Khách hàng",
    cell: ({ row }: { row: Delivery }) => row.order.customer.name,
  },
  {
    accessorKey: "deliveryDateTime",
    header: "Ngày Giao",
    cell: ({ row }: { row: Delivery }) => row.deliveryDateTime ? format(new Date(row.deliveryDateTime), "dd/MM/yyyy") : 'N/A',
  },
  {
    accessorKey: "driverName",
    header: "Tài xế",
    cell: ({ row }: { row: Delivery }) => row.driverName || 'N/A',
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }: { row: Delivery }) => {
        const config = statusConfig[row.status];
        return (
            <Badge variant={config.variant}>
              <config.icon className="mr-1 h-3 w-3" />
              {config.label}
            </Badge>
        )
    },
  },
];
