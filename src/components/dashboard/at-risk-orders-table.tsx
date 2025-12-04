"use client";

import * as React from "react";
import { useData } from "@/hooks/use-data";
import { differenceInHours, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { CreateDeliverySheet } from "../deliveries/create-delivery-sheet";
import { Button } from "../ui/button";

export function AtRiskOrdersTable() {
  const { orders, deliveries } = useData();

  const atRiskOrders = React.useMemo(() => {
    const now = new Date();
    return orders.filter(order => {
      if (order.status !== 'Confirmed' || !order.confirmationDate) {
        return false;
      }

      const hoursSinceConfirmation = differenceInHours(now, parseISO(order.confirmationDate));
      if (hoursSinceConfirmation < 24) {
        return false;
      }

      const delivery = deliveries.find(d => d.order.id === order.id);
      return !delivery || delivery?.status === 'Cần giao';
    });
  }, [orders, deliveries]);


  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Đơn Hàng Có Rủi Ro
        </CardTitle>
        <CardDescription>
          Đã xác nhận trên 24 giờ nhưng chưa có lệnh giao.
        </CardDescription>
      </CardHeader>
      <CardContent>
         {atRiskOrders.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
                <p>Không có đơn hàng nào rủi ro.</p>
            </div>
         ) : (
            <div className="rounded-md border">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Mã Đơn</TableHead>
                    <TableHead>Khách Hàng</TableHead>
                    <TableHead>T.gian trễ</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {atRiskOrders.slice(0, 5).map(order => (
                    <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell className="text-xs">{order.customer.name}</TableCell>
                    <TableCell>
                        <Badge variant="destructive">
                        {differenceInHours(new Date(), parseISO(order.confirmationDate!))} giờ
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <CreateDeliverySheet orderId={order.id} trigger={
                            <Button size="sm" className="h-8 gap-1">
                                <ArrowRight className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Tạo lệnh</span>
                            </Button>
                        } />
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
