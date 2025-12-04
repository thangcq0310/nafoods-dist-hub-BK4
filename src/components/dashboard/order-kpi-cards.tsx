
"use client";

import { useData } from "@/hooks/use-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Clock,
  DollarSign,
  Truck,
} from "lucide-react";
import { parseISO } from 'date-fns';

type Kpi = {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
};

export function OrderKpiCards() {
  const { orders, deliveries } = useData();

  // Removed isThisMonth filter to show all data
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const revenue = orders
    .filter(o => o.status === 'Confirmed')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const delivered = deliveries.filter(d => 
    d.status === 'Đã giao' && d.deliveryDateTime
  );

  const totalDeliveryCost = delivered.reduce((acc, d) => acc + (d.deliveryFee || 0), 0);

  
  const kpis: Kpi[] = [
    {
      title: "Tổng đơn hàng",
      value: totalOrders.toString(),
      icon: Package,
      description: "Tổng số đơn hàng được tạo trong hệ thống.",
    },
    {
      title: "Đơn hàng chờ duyệt",
      value: pendingOrders.toString(),
      icon: Clock,
      description: "Đơn hàng đang chờ xác nhận.",
    },
    {
      title: "Tổng doanh thu",
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(revenue),
      icon: DollarSign,
      description: "Tổng doanh thu từ các đơn đã xác nhận.",
    },
     {
      title: "Tổng chi phí giao hàng",
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalDeliveryCost),
      icon: Truck,
      description: "Tổng chi phí cho các đơn đã giao thành công.",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <p className="text-xs text-muted-foreground">{kpi.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
