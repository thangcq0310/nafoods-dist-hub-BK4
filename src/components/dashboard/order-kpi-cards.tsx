"use client";

import { useData } from "@/hooks/use-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Clock,
  DollarSign,
} from "lucide-react";
import { isThisMonth, parseISO } from 'date-fns';

type Kpi = {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
};

export function OrderKpiCards() {
  const { orders } = useData();

  const currentMonthOrders = orders.filter(o => isThisMonth(parseISO(o.orderDate)));
  
  const totalOrdersMonth = currentMonthOrders.length;
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const revenueMonth = currentMonthOrders
    .filter(o => o.status === 'Confirmed')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  
  const kpis: Kpi[] = [
    {
      title: "Tổng đơn hàng (tháng)",
      value: totalOrdersMonth.toString(),
      icon: Package,
      description: "Tổng số đơn hàng được tạo trong tháng này.",
    },
    {
      title: "Đơn hàng chờ duyệt",
      value: pendingOrders.toString(),
      icon: Clock,
      description: "Tổng số đơn hàng đang chờ xác nhận.",
    },
    {
      title: "Doanh thu (tháng)",
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(revenueMonth),
      icon: DollarSign,
      description: "Tổng doanh thu từ các đơn đã xác nhận trong tháng.",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
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
