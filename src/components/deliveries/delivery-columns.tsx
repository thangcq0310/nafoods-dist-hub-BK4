"use client";

import type { Delivery, DeliveryStatus } from "@/lib/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Truck, Printer, CheckCircle, Clock, XCircle, ArrowRight, Package, Play, Ban } from "lucide-react";
import { useData } from "@/hooks/use-data";
import { useToast } from "@/hooks/use-toast";
import { CreateDeliverySheet } from "./create-delivery-sheet";
import { cn } from "@/lib/utils";

const statusConfig: { [key in DeliveryStatus]: { variant: "default" | "secondary" | "destructive" | "outline", icon: React.ElementType } } = {
  "Cần giao": { variant: "outline", icon: Package },
  "Chờ giao": { variant: "secondary", icon: Clock },
  "Đang giao": { variant: "default", icon: Truck },
  "Đã giao": { variant: "default", icon: CheckCircle },
  "Thất bại": { variant: "destructive", icon: XCircle },
  "Đã hủy": { variant: "destructive", icon: XCircle },
};

const ActionButton = ({ onClick, icon: Icon, label, className, ...props }: { onClick: () => void, icon: React.ElementType, label: string, className?: string } & React.ComponentProps<typeof Button>) => (
    <Button onClick={onClick} variant="outline" size="sm" className={cn("h-8 gap-1", className)} {...props}>
        <Icon className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{label}</span>
    </Button>
);

export const RowActions = ({ delivery }: { delivery: Delivery }) => {
  const { updateDeliveryStatus } = useData();
  const { toast } = useToast();

  const handleStatusUpdate = (status: DeliveryStatus) => {
    updateDeliveryStatus(delivery.id, status);
    toast({ title: "Cập nhật thành công", description: `Trạng thái giao hàng đã đổi thành "${status}".` });
  };
  
  const handlePrint = () => {
    window.open(`/print/delivery/${delivery.id}`, '_blank');
  };

  const renderActions = () => {
    switch (delivery.status) {
        case "Cần giao":
            return (
                 <CreateDeliverySheet orderId={delivery.order.id} trigger={
                    <Button size="sm" className="h-8 gap-1" disabled={delivery.order.status !== 'Confirmed'}>
                        <ArrowRight className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Tạo lệnh giao</span>
                    </Button>
                } />
            );
        case "Chờ giao":
            return (
                <div className="flex items-center gap-2">
                    <ActionButton onClick={() => handleStatusUpdate('Đang giao')} icon={Play} label="Bắt đầu giao" />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> In phiếu</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleStatusUpdate('Đã hủy')} className="text-destructive"><Ban className="mr-2 h-4 w-4" /> Hủy lệnh</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        case "Đang giao":
            return (
                <div className="flex items-center gap-2">
                    <ActionButton onClick={() => handleStatusUpdate('Đã giao')} icon={CheckCircle} label="Đã giao" />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> In phiếu</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleStatusUpdate('Thất bại')} className="text-destructive"><XCircle className="mr-2 h-4 w-4" /> Báo thất bại</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        case "Đã giao":
        case "Thất bại":
        case "Đã hủy":
            return <ActionButton onClick={handlePrint} icon={Printer} label="In phiếu" />;
        default:
            return null;
    }
  }

  return <div className="flex items-center justify-end">{renderActions()}</div>;
};


export const deliveryColumns = [
  {
    accessorKey: "orderId",
    header: "Mã Đơn Hàng",
    cell: ({ row }: { row: { original: Delivery } }) => (
        <div className="flex flex-col">
            <span className="font-medium">{row.original.order.id}</span>
        </div>
    ),
  },
  {
    accessorKey: "customer",
    header: "Khách hàng",
    cell: ({ row }: { row: { original: Delivery } }) => row.original.order.customer.name,
  },
  {
    accessorKey: "deliveryDateTime",
    header: "Ngày Giao",
    cell: ({ row }: { row: { original: Delivery } }) => row.original.deliveryDateTime ? format(new Date(row.original.deliveryDateTime), "dd/MM/yyyy") : 'N/A',
  },
  {
    accessorKey: "driverName",
    header: "Tài xế",
    cell: ({ row }: { row: { original: Delivery } }) => row.original.driverName || 'N/A',
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }: { row: { original: Delivery } }) => {
        const config = statusConfig[row.original.status];
        return (
            <Badge variant={config.variant} className="gap-1">
              <config.icon className="h-3 w-3" />
              {row.original.status}
            </Badge>
        )
    },
  },
];
