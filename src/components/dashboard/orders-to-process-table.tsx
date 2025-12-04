
"use client";

import { useData } from "@/hooks/use-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { OrderStatus, Order } from "@/lib/types";
import { format } from 'date-fns';
import { Button } from "../ui/button";
import { ArrowRight, Check, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function OrdersToProcessTable() {
  const { orders, updateOrderStatus } = useData();
  const { toast } = useToast();
  const router = useRouter();

  const ordersToProcess = orders
    .filter(order => order.status === "Pending")
    .sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime())
    .slice(0, 5);

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    toast({
      title: "Cập nhật thành công!",
      description: `Đơn hàng ${orderId} đã được ${status === 'Confirmed' ? 'xác nhận' : 'hủy'}.`
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
           <CardTitle>Các đơn hàng cần xử lý</CardTitle>
            <CardDescription>
                Các đơn hàng đang chờ xác nhận hoặc hủy.
            </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
            <a href="/orders">
                Xem tất cả
                <ArrowRight className="h-4 w-4" />
            </a>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-card-foreground">Mã Đơn</TableHead>
              <TableHead className="text-card-foreground">Khách Hàng</TableHead>
              <TableHead className="text-card-foreground">Ngày Đặt</TableHead>
              <TableHead className="text-card-foreground text-right">Tổng Tiền</TableHead>
              <TableHead className="text-card-foreground text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersToProcess.length > 0 ? (
              ordersToProcess.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-card-foreground">{order.id}</TableCell>
                  <TableCell className="text-card-foreground">{order.customer.name}</TableCell>
                  <TableCell className="text-card-foreground">{format(new Date(order.orderDate), 'dd/MM/yyyy')}</TableCell>
                  <TableCell className="text-right text-card-foreground">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(order.id, 'Confirmed')}>
                            <Check className="mr-2 h-4 w-4" /> Xác nhận
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleUpdateStatus(order.id, 'Canceled')}>
                            <Ban className="mr-2 h-4 w-4" /> Hủy
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-card-foreground">
                        Không có đơn hàng nào cần xử lý.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
