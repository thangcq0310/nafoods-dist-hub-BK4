
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/types";
import { format } from 'date-fns';

const statusVariant: { [key in OrderStatus]: "default" | "secondary" | "destructive" | "outline" | "accent" } = {
  "Confirmed": "default",
  "Pending": "accent",
  "Canceled": "destructive",
};

export function RecentOrdersTable() {
  const { orders } = useData();
  const recentOrders = orders.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đơn Hàng Gần Đây</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-card-foreground">Mã Đơn</TableHead>
              <TableHead className="text-card-foreground">Khách Hàng</TableHead>
              <TableHead className="text-card-foreground">Ngày Đặt</TableHead>
              <TableHead className="text-right text-card-foreground">Trạng Thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-card-foreground">{order.id}</TableCell>
                <TableCell className="text-card-foreground">{order.customer.name}</TableCell>
                <TableCell className="text-card-foreground">{format(new Date(order.orderDate), 'dd/MM/yyyy')}</TableCell>
                <TableCell className="text-right">
                   <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
