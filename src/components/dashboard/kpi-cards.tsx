// This file is no longer used for the new dashboard layout.
// The new component is order-kpi-cards.tsx
// I will remove this file in a future step if it's not referenced anywhere else.
"use client";

import { useData } from "@/hooks/use-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Truck,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Archive,
} from "lucide-react";
import { isToday } from 'date-fns';

type Kpi = {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
};

export function KpiCards() {
  const { deliveries } = useData();

  const needsDelivery = deliveries.filter(d => d.status === "Cần giao").length;
  const waitingForPickup = deliveries.filter(d => d.status === "Chờ giao").length;
  const inTransit = deliveries.filter(d => d.status === "Đang giao").length;
  const completedToday = deliveries.filter(d => d.status === "Đã giao" && d.deliveryDateTime && isToday(new Date(d.deliveryDateTime))).length;
  const failedOrCanceled = deliveries.filter(d => d.status === "Thất bại" || d.status === "Đã hủy").length;
  const totalDelivered = deliveries.filter(d => d.status === "Đã giao").length;
  
  const kpis: Kpi[] = [
    {
      title: "Cần Giao Hàng",
      value: needsDelivery,
      icon: Package,
      description: "Đơn hàng đã xác nhận, chờ tạo lệnh giao.",
    },
    {
      title: "Chờ Lấy Hàng",
      value: waitingForPickup,
      icon: Clock,
      description: "Lệnh giao đã tạo, chờ nhà vận tải lấy hàng.",
    },
    {
      title: "Đang Vận Chuyển",
      value: inTransit,
      icon: Truck,
      description: "Đơn hàng đang trên đường giao cho khách.",
    },
    {
      title: "Hoàn Thành Hôm Nay",
      value: completedToday,
      icon: CheckCircle,
      description: "Đơn hàng đã giao thành công trong ngày.",
    },
    {
      title: "Giao Thất Bại / Hủy",
      value: failedOrCanceled,
      icon: XCircle,
      description: "Đơn hàng giao thất bại hoặc đã bị hủy.",
    },
    {
      title: "Tổng Đơn Đã Giao",
      value: totalDelivered,
      icon: Archive,
      description: "Tổng số đơn hàng đã giao thành công.",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
